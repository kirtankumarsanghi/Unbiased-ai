# Models route
from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def get_models():
    return [
        {
            "id": 1,
            "name": "HireScore",
            "status": "SAFE"
        },

        {
            "id": 2,
            "name": "RiskEval",
            "status": "CRITICAL"
        }
    ]