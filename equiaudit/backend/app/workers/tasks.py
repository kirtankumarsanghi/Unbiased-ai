# Celery tasks
from app.workers.celery_app import celery


@celery.task
def run_bias_scan():
    return {
        "status": "completed"
    }