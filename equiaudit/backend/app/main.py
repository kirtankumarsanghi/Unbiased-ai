# Main entrypoint
import time

from fastapi import FastAPI
from fastapi import WebSocket
from fastapi import WebSocketDisconnect
from fastapi import WebSocketException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from sqlalchemy.exc import OperationalError
from sqlalchemy.exc import SQLAlchemyError

from app.api.router import api_router
from app.api.deps.deps import get_current_user_ws
from app.core.websocket import manager
from app.core.config import settings
from app.models.ai_model import AIModel
from app.models.intervention import Intervention
from app.models.audit_log import AuditLog
from app.models.user import User
from app.models.public_analysis import PublicAnalysis
from app.core.security import hash_password
from app.core.database import engine

app = FastAPI(
    title="Unbiased AI API",
    version="4.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    api_router,
    prefix="/api/v1"
)


def seed_initial_data():
    from app.core.database import SessionLocal
    db = SessionLocal()
    try:
        if db.query(AIModel).count() == 0:
            db.add_all(
                [
                    AIModel(
                        name="HireScore",
                        status="SAFE",
                        bias_index=0.12,
                        throughput="1.2k req/s",
                        data_drift=1.4,
                        dataset_path=None,
                        dataset_rows=None,
                    ),
                    AIModel(
                        name="RiskEval",
                        status="CRITICAL",
                        bias_index=0.65,
                        throughput="12k req/s",
                        data_drift=18.4,
                        dataset_path=None,
                        dataset_rows=None,
                    ),
                ]
            )
        if db.query(Intervention).count() == 0:
            db.add_all(
                [
                    Intervention(
                        name="Reweighing",
                        status="ACTIVE",
                        fairness_gain="+14%",
                        accuracy_tradeoff="-1.2%",
                        processing_time="12s",
                    ),
                    Intervention(
                        name="Adversarial Debiasing",
                        status="STANDBY",
                        fairness_gain="+18%",
                        accuracy_tradeoff="-2.1%",
                        processing_time="30s",
                    ),
                ]
            )
        if db.query(AuditLog).count() == 0:
            db.add_all(
                [
                    AuditLog(level="INFO", message="Model ingestion complete"),
                    AuditLog(level="SYSTEM", message="Calculating demographic parity"),
                    AuditLog(level="WARN", message="Disparate impact detected in Age_Bracket_3"),
                ]
            )
        if db.query(User).count() == 0:
            db.add_all(
                [
                    User(
                        name="Platform Admin",
                        email="admin@equiaudit.ai",
                        password=hash_password("Admin@123"),
                        role="SUPER_ADMIN",
                    ),
                    User(
                        name="Org Admin",
                        email="orgadmin@equiaudit.ai",
                        password=hash_password("OrgAdmin@123"),
                        role="ORG_ADMIN",
                    ),
                    User(
                        name="Fairness Analyst",
                        email="analyst@equiaudit.ai",
                        password=hash_password("Analyst@123"),
                        role="ANALYST",
                    ),
                    User(
                        name="Audit Reviewer",
                        email="auditor@equiaudit.ai",
                        password=hash_password("Auditor@123"),
                        role="AUDITOR",
                    ),
                ]
            )
        default_admin = db.query(User).filter(User.email == settings.DEFAULT_ADMIN_EMAIL).first()
        if default_admin:
            default_admin.name = settings.DEFAULT_ADMIN_NAME
            default_admin.password = hash_password(settings.DEFAULT_ADMIN_PASSWORD)
            default_admin.role = settings.DEFAULT_ADMIN_ROLE
            default_admin.is_active = True
        else:
            db.add(
                User(
                    name=settings.DEFAULT_ADMIN_NAME,
                    email=settings.DEFAULT_ADMIN_EMAIL,
                    password=hash_password(settings.DEFAULT_ADMIN_PASSWORD),
                    role=settings.DEFAULT_ADMIN_ROLE,
                    is_active=True,
                )
            )
        db.commit()
    except (OperationalError, SQLAlchemyError):
        # Database/schema may not be ready yet; skip seeding without crashing app startup.
        db.rollback()
    finally:
        db.close()


def ensure_runtime_tables():
    PublicAnalysis.__table__.create(bind=engine, checkfirst=True)


seed_initial_data()
ensure_runtime_tables()


@app.get("/")
def root():
    return {
        "message": "Unbiased AI Backend Running"
    }


async def _handle_websocket(websocket: WebSocket, channel: str | None = None):
    try:
        user = get_current_user_ws(websocket)
    except WebSocketException as exc:
        await websocket.close(code=exc.code)
        return

    org_channel = f"org:{user.organisation_id or 'public'}"
    requested_channel = channel or websocket.query_params.get("channel")
    active_channel = requested_channel or org_channel
    if active_channel != org_channel:
        active_channel = org_channel

    await manager.connect(websocket, channel=active_channel)
    window_start = time.monotonic()
    message_count = 0
    try:
        while True:
            message = await websocket.receive_text()
            now = time.monotonic()
            if now - window_start > 10:
                window_start = now
                message_count = 0
            message_count += 1
            if message_count > 20:
                await websocket.close(code=1008)
                return
            await manager.broadcast(message, channel=active_channel)
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await _handle_websocket(websocket)


@app.websocket("/ws/{channel}")
async def websocket_channel_endpoint(websocket: WebSocket, channel: str):
    await _handle_websocket(websocket, channel=channel)


@app.get("/metrics", response_class=PlainTextResponse)
def prometheus_metrics():
    return (
        "# HELP equiaudit_up Backend availability\n"
        "# TYPE equiaudit_up gauge\n"
        "equiaudit_up 1\n"
    )
