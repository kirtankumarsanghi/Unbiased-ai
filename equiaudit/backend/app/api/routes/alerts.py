# Alerts route
from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def get_alerts():
    return [
        {
            "severity": "CRITICAL",
            "message":
                "Bias threshold exceeded"
        }
    ]