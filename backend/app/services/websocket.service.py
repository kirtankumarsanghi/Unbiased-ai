# WebSocket service
from app.core.websocket import (
    manager
)


class WebSocketService:

    @staticmethod
    async def send_update(
        message: str
    ):
        await manager.broadcast(
            message
        )