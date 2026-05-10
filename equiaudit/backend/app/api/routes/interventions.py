# Interventions route
from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def get_interventions():
    return [
        {
            "name": "Reweighing",
            "status": "ACTIVE"
        },

        {
            "name": "Adversarial Debiasing",
            "status": "STANDBY"
        }
    ]


@router.post("/{model_id}/enable")
def enable_intervention(
    model_id: int
):
    return {
        "model_id": model_id,
        "status": "enabled"
    }   