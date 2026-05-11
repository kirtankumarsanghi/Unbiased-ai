from fastapi import APIRouter, HTTPException
from fastapi import Depends
from sqlalchemy.orm import Session

from app.api.deps.deps import get_database, require_roles
from app.models.ai_model import AIModel
from app.models.audit import Audit
from app.models.audit_log import AuditLog
from app.services.fairness.dataset_fairness_service import calculate_fairness_metrics_from_csv

router = APIRouter()


@router.post("/run/{model_id}")
def run_audit(
    model_id: int,
    db: Session = Depends(get_database),
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
    model = db.query(AIModel).filter(AIModel.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    if not model.dataset_path:
        raise HTTPException(status_code=400, detail="Model dataset is missing")

    try:
        metrics = calculate_fairness_metrics_from_csv(model.dataset_path)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    audit = Audit(
        model_id=model_id,
        demographic_parity=metrics["demographic_parity"],
        equalized_odds=metrics["equalized_odds"],
        disparate_impact=metrics["disparate_impact"],
    )
    db.add(audit)
    db.flush()

    db.add(
        AuditLog(
            level="INFO",
            message=f"Audit #{audit.id} completed for model {model_id}",
        )
    )
    db.commit()
    db.refresh(audit)

    return {
        "audit_id": audit.id,
        "metrics": {
            "demographic_parity": audit.demographic_parity,
            "equalized_odds": audit.equalized_odds,
            "disparate_impact": audit.disparate_impact,
        },
    }


@router.get("/{audit_id}/metrics")
def get_metrics(
    audit_id: int,
    db: Session = Depends(get_database),
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
    audit = db.query(Audit).filter(Audit.id == audit_id).first()

    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")

    return {
        "audit_id": audit.id,
        "demographic_parity": audit.demographic_parity,
        "equalized_odds": audit.equalized_odds,
        "disparate_impact": audit.disparate_impact,
    }
