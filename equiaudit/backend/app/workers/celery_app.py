# Celery app
from celery import Celery

from app.core.config import settings

celery = Celery(
    "equiaudit",
    broker=settings.celery_broker,
)

celery.conf.update(
    result_backend=settings.celery_result_backend,
)