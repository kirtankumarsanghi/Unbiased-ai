# Reports route
from datetime import datetime

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def list_reports():
    return [
        {
            "id": 1,
            "title": "EquiAudit Q1 Compliance",
            "status": "COMPLIANT",
            "generated_at": datetime.utcnow().isoformat()
        }
    ]


@router.post("/generate")
def generate_report():
    return {
        "report_id": 101,
        "status": "QUEUED"
    }