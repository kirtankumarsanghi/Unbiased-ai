# Celery app
from celery import Celery

celery = Celery(
    "equiaudit",
    broker="redis://redis:6379/0"
)

celery.conf.update(
    result_backend="redis://redis:6379/0"
)