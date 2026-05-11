from fastapi import APIRouter
from pydantic import BaseModel
from fastapi import Depends
from sqlalchemy.orm import Session

from app.api.deps.deps import get_database, require_roles
from app.models.intervention import Intervention

router = APIRouter()


class InterventionPayload(BaseModel):
    intervention: str


@router.get("/")
def get_interventions(
    db: Session = Depends(get_database),
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
    interventions = db.query(Intervention).order_by(Intervention.id.asc()).all()
    return [
        {
            "name": intervention.name,
            "status": intervention.status,
            "fairnessGain": intervention.fairness_gain,
            "accuracyTradeoff": intervention.accuracy_tradeoff,
            "processingTime": intervention.processing_time,
        }
        for intervention in interventions
    ]


@router.post("/{model_id}/enable")
def enable_intervention(
    model_id: int,
    payload: InterventionPayload,
    db: Session = Depends(get_database),
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN")),
):
    intervention = (
        db.query(Intervention)
        .filter(Intervention.name == payload.intervention)
        .first()
    )
    if intervention:
        intervention.status = "ACTIVE"
    else:
        intervention = Intervention(
            name=payload.intervention,
            status="ACTIVE",
            fairness_gain="+10%",
            accuracy_tradeoff="-1.0%",
            processing_time="10s",
        )
        db.add(intervention)
    db.commit()
    db.refresh(intervention)

    return {
        "model_id": model_id,
        "status": "enabled",
        "intervention": {
            "name": intervention.name,
            "status": intervention.status,
            "fairnessGain": intervention.fairness_gain,
            "accuracyTradeoff": intervention.accuracy_tradeoff,
            "processingTime": intervention.processing_time,
        },
    }


@router.post("/{model_id}/disable")
def disable_intervention(
    model_id: int,
    payload: InterventionPayload,
    db: Session = Depends(get_database),
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN")),
):
    intervention = (
        db.query(Intervention)
        .filter(Intervention.name == payload.intervention)
        .first()
    )
    if intervention:
        intervention.status = "STANDBY"
    else:
        intervention = Intervention(
            name=payload.intervention,
            status="STANDBY",
        )
        db.add(intervention)
    db.commit()
    db.refresh(intervention)

    return {
        "model_id": model_id,
        "status": "disabled",
        "intervention": {
            "name": intervention.name,
            "status": intervention.status,
            "fairnessGain": intervention.fairness_gain,
            "accuracyTradeoff": intervention.accuracy_tradeoff,
            "processingTime": intervention.processing_time,
        },
    }


@router.get("/{model_id}/preview")
def preview_intervention(
    model_id: int,
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
    return {
        "model_id": model_id,
        "fairness_gain": "+12%",
        "accuracy_tradeoff": "-1.4%",
        "eta": "15s",
    }
