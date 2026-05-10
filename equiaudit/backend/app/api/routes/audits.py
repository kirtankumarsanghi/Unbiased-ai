from fastapi import APIRouter, HTTPException

from app.data.store import store

router = APIRouter()


@router.post("/run/{model_id}")
def run_audit(model_id: int):
    if not store.get_model(model_id):
        raise HTTPException(status_code=404, detail="Model not found")

    audit = store.create_audit(model_id)

    return {
        "audit_id": audit["id"],
        "metrics": {
            "demographic_parity": audit["demographic_parity"],
            "equalized_odds": audit["equalized_odds"],
            "disparate_impact": audit["disparate_impact"],
        },
    }


@router.get("/{audit_id}/metrics")
def get_metrics(audit_id: int):
    audit = store.get_audit(audit_id)

    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")

    return {
        "audit_id": audit["id"],
        "demographic_parity": audit["demographic_parity"],
        "equalized_odds": audit["equalized_odds"],
        "disparate_impact": audit["disparate_impact"],
    }