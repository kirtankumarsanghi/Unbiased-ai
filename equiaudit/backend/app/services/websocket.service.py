# WebSocket service
from app.core.websocket import (
    manager
)


class WebSocketService:

    @staticmethod
    async def send_update(
        message: str,
        channel: str = "global",
    ):
        await manager.broadcast(
            message,
            channel=channel,
        )

    @staticmethod
    async def send_event(
        event_type: str,
        payload: dict,
        channel: str = "global",
    ):
        await manager.broadcast_event(
            event_type=event_type,
            payload=payload,
            channel=channel,
        )
