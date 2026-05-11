# WebSocket config
from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.channels: dict[str, list[WebSocket]] = {}

    async def connect(
        self,
        websocket: WebSocket,
        channel: str = "global",
    ):
        await websocket.accept()

        self.active_connections.append(websocket)
        self.channels.setdefault(channel, []).append(websocket)

    def disconnect(
        self,
        websocket: WebSocket,
    ):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        for channel in list(self.channels.keys()):
            connections = self.channels[channel]
            if websocket in connections:
                connections.remove(websocket)
            if not connections:
                del self.channels[channel]

    async def broadcast(
        self,
        message: str,
        channel: str = "global",
    ):
        targets = self.channels.get(channel, [])
        for connection in list(targets):
            await connection.send_text(message)

    async def broadcast_event(
        self,
        event_type: str,
        payload: dict,
        channel: str = "global",
    ):
        import json

        body = json.dumps(
            {
                "event_type": event_type,
                "channel": channel,
                "payload": payload,
            }
        )
        await self.broadcast(body, channel=channel)


manager = ConnectionManager()
