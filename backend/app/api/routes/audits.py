# Audits route
from fastapi import APIRouter

router = APIRouter()


@router.get("/{audit_id}/metrics")
def get_metrics(
    audit_id: int
):
    return {
        "audit_id": audit_id,
        "demographic_parity": 0.94,
        "equalized_odds": 0.91,
        "disparate_impact": 0.87
    }