# Alerts route
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class ThresholdPayload(BaseModel):
    fairness_threshold: float | None = None
    disparity_threshold: float | None = None


@router.get("/")
def get_alerts():
    return [
        {
            "severity": "CRITICAL",
            "message":
                "Bias threshold exceeded"
        }
    ]


@router.post("/thresholds")
def update_thresholds(payload: ThresholdPayload):
    return {
        "message": "Thresholds updated",
        "thresholds": payload.model_dump(),
    }
