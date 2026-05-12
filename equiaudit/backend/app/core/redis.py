from redis import Redis
from app.core.config import settings

redis_client = Redis.from_url(
    settings.REDIS_URL,
    decode_responses=True,
    socket_connect_timeout=0.4,
    socket_timeout=0.4,
    retry_on_timeout=False,
)
