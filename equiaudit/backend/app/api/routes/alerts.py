# Alerts route
from fastapi import APIRouter
from fastapi import Depends
from pydantic import BaseModel
from app.api.deps.deps import require_roles
from app.core.websocket import manager

router = APIRouter()


class ThresholdPayload(BaseModel):
    fairness_threshold: float | None = None
    disparity_threshold: float | None = None


class IncidentPayload(BaseModel):
    severity: str
    source: str
    summary: str
    metadata: dict | None = None


@router.get("/")
def get_alerts(
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
    return [
        {
            "severity": "CRITICAL",
            "message":
                "Bias threshold exceeded"
        }
    ]


@router.post("/thresholds")
def update_thresholds(
    payload: ThresholdPayload,
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN")),
):
    return {
        "message": "Thresholds updated",
        "thresholds": payload.model_dump(),
    }


@router.post("/incidents/emit")
async def emit_incident(
    payload: IncidentPayload,
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST")),
):
    body = payload.model_dump()
    await manager.broadcast_event(
        "incident.detected",
        body,
        channel="enterprise_incidents",
    )
    return {"message": "Incident broadcasted", "incident": body}
