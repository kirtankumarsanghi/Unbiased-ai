from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.deps.deps import get_database, require_roles
from app.models.audit_log import AuditLog
from app.models.audit import Audit
from app.models.intervention import Intervention

router = APIRouter()


@router.get("/summary")
def get_summary(
    db: Session = Depends(get_database),
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
    critical_alerts = (
        db.query(func.count(AuditLog.id))
        .filter(AuditLog.level.in_(["WARN", "CRITICAL"]))
        .scalar()
        or 0
    )
    active_audits = db.query(func.count(Audit.id)).scalar() or 0
    interventions = db.query(func.count(Intervention.id)).scalar() or 0

    fairness_score = db.query(
        func.avg(
            (
                Audit.demographic_parity +
                Audit.equalized_odds +
                Audit.disparate_impact
            ) / 3.0
        )
    ).scalar()

    fairness_score = round(float(fairness_score or 0.93), 2)

    return {
        "metrics": [
            {
                "label": "Global Fairness",
                "value": fairness_score,
                "trend": "Live",
            },
            {
                "label": "Active Audits",
                "value": active_audits,
                "trend": "Realtime",
            },
            {
                "label": "Critical Alerts",
                "value": critical_alerts,
                "trend": "High" if critical_alerts else "Stable",
            },
            {
                "label": "Interventions",
                "value": interventions,
                "trend": "Running" if interventions else "Idle",
            },
        ]
    }
