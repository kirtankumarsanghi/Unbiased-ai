# Celery tasks
from datetime import datetime

from app.core.database import SessionLocal
from app.models.report import Report
from app.workers.celery_app import celery


@celery.task
def run_bias_scan():
    return {"status": "completed"}


@celery.task
def generate_report_task(title: str, content: str, status: str = "COMPLIANT"):
    db = SessionLocal()
    try:
        report = Report(
            title=title,
            status=status,
            content=content,
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        return {"report_id": report.id, "generated_at": report.generated_at.isoformat()}
    finally:
        db.close()