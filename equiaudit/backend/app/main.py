# Main entrypoint
from fastapi import FastAPI
from fastapi import WebSocket
from fastapi import WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse

from app.api.router import api_router
from app.core.websocket import manager

app = FastAPI(
    title="EquiAudit API",
    version="4.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    api_router,
    prefix="/api/v1"
)


@app.get("/")
def root():
    return {
        "message": "EquiAudit Backend Running"
    }


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            message = await websocket.receive_text()
            await manager.broadcast(message)
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.get("/metrics", response_class=PlainTextResponse)
def prometheus_metrics():
    return (
        "# HELP equiaudit_up Backend availability\n"
        "# TYPE equiaudit_up gauge\n"
        "equiaudit_up 1\n"
    )
