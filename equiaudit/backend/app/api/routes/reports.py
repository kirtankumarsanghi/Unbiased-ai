from fastapi import APIRouter, HTTPException
from fastapi import Depends
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from datetime import datetime

from app.api.deps.deps import get_database, require_roles
from app.models.report import Report

router = APIRouter()


@router.get("/")
def list_reports(
    db: Session = Depends(get_database),
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
    reports = db.query(Report).order_by(Report.id.desc()).all()
    return [
        {
            "id": report.id,
            "title": report.title,
            "status": report.status,
            "generated_at": (
                report.generated_at.isoformat()
                if report.generated_at
                else None
            ),
        }
        for report in reports
    ]


@router.post("/generate")
def generate_report(
    db: Session = Depends(get_database),
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    report = Report(
        title=f"EquiAudit Report {timestamp}",
        status="COMPLIANT",
        content=f"EquiAudit Compliance Report\nGenerated: {timestamp}\nStatus: COMPLIANT\n",
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return {
        "report_id": report.id,
        "status": "COMPLETED",
    }


@router.get("/{report_id}/download")
def download_report(
    report_id: int,
    db: Session = Depends(get_database),
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
    report = db.query(Report).filter(Report.id == report_id).first()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    return PlainTextResponse(
        report.content or "Report content unavailable",
        headers={
            "Content-Disposition": f"attachment; filename=report-{report_id}.txt"
        },
    )
