from fastapi import APIRouter
from pydantic import BaseModel

from app.data.store import store

router = APIRouter()


class InterventionPayload(BaseModel):
    intervention: str


@router.get("/")
def get_interventions():
    return store.list_interventions()


@router.post("/{model_id}/enable")
def enable_intervention(model_id: int, payload: InterventionPayload):
    intervention = store.set_intervention_status(
        payload.intervention, "ACTIVE"
    )

    return {
        "model_id": model_id,
        "status": "enabled",
        "intervention": intervention,
    }


@router.post("/{model_id}/disable")
def disable_intervention(model_id: int, payload: InterventionPayload):
    intervention = store.set_intervention_status(
        payload.intervention, "STANDBY"
    )

    return {
        "model_id": model_id,
        "status": "disabled",
        "intervention": intervention,
    }


@router.get("/{model_id}/preview")
def preview_intervention(model_id: int):
    return {
        "model_id": model_id,
        "fairness_gain": "+12%",
        "accuracy_tradeoff": "-1.4%",
        "eta": "15s",
    }