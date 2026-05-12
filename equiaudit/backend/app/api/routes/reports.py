import json
from datetime import datetime

from fastapi import APIRouter, HTTPException
from fastapi import Depends, Query
from fastapi.responses import PlainTextResponse, Response
from sqlalchemy.orm import Session

from app.api.deps.deps import get_database, require_roles
from app.models.audit import Audit
from app.models.alert import AlertIncident
from app.models.report import Report
from app.utils.fairness import fairness_score
from app.utils.pdf import build_simple_pdf
from app.workers.tasks import generate_report_task

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
    latest_audit = db.query(Audit).order_by(Audit.id.desc()).first()
    incidents = db.query(AlertIncident).order_by(AlertIncident.id.desc()).limit(20).all()

    if latest_audit:
        score = fairness_score(
            latest_audit.demographic_parity,
            latest_audit.equalized_odds,
            latest_audit.disparate_impact,
        )
        status = "COMPLIANT" if score >= 0.8 else "REVIEW"
    else:
        score = None
        status = "REVIEW"

    report_payload = {
        "generated_at": timestamp,
        "status": status,
        "audit_summary": {
            "audit_id": latest_audit.id if latest_audit else None,
            "demographic_parity": latest_audit.demographic_parity if latest_audit else None,
            "equalized_odds": latest_audit.equalized_odds if latest_audit else None,
            "disparate_impact": latest_audit.disparate_impact if latest_audit else None,
            "fairness_score": score,
        },
        "incidents": [
            {
                "id": incident.id,
                "severity": incident.severity,
                "source": incident.source,
                "summary": incident.summary,
                "status": incident.status,
                "created_at": incident.created_at.isoformat() if incident.created_at else None,
            }
            for incident in incidents
        ],
    }

    title = f"EquiAudit Report {timestamp}"
    report = Report(
        title=title,
        status=status,
        content=json.dumps(report_payload),
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    generate_report_task.delay(title, report.content, status)

    return {
        "report_id": report.id,
        "status": "COMPLETED",
    }


@router.get("/{report_id}/download")
def download_report(
    report_id: int,
    db: Session = Depends(get_database),
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
    format: str = Query("pdf", pattern="^(pdf|json|txt)$"),
):
    report = db.query(Report).filter(Report.id == report_id).first()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    if format == "json":
        return Response(
            report.content or "{}",
            media_type="application/json",
            headers={
                "Content-Disposition": f"attachment; filename=report-{report_id}.json"
            },
        )

    if format == "txt":
        return PlainTextResponse(
            report.content or "Report content unavailable",
            headers={
                "Content-Disposition": f"attachment; filename=report-{report_id}.txt"
            },
        )

    payload = {}
    if report.content:
        try:
            payload = json.loads(report.content)
        except json.JSONDecodeError:
            payload = {"status": report.status, "notes": report.content}

    title = report.title or f"Report {report_id}"
    lines = [
        f"Status: {payload.get('status', report.status)}",
        f"Generated: {payload.get('generated_at', report.generated_at)}",
        "",
        "Audit Summary:",
        f"- Demographic Parity: {payload.get('audit_summary', {}).get('demographic_parity')}",
        f"- Equalized Odds: {payload.get('audit_summary', {}).get('equalized_odds')}",
        f"- Disparate Impact: {payload.get('audit_summary', {}).get('disparate_impact')}",
        f"- Fairness Score: {payload.get('audit_summary', {}).get('fairness_score')}",
        "",
        "Incidents:",
    ]
    for incident in payload.get("incidents", [])[:10]:
        lines.append(
            f"- [{incident.get('severity')}] {incident.get('summary')} ({incident.get('created_at')})"
        )

    pdf_bytes = build_simple_pdf(title, lines)
    return Response(
        pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=report-{report_id}.pdf"
        },
    )
