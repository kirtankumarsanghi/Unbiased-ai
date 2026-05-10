# Users route
from fastapi import APIRouter

router = APIRouter()


@router.get("/me")
def current_user():
    return {
        "id": 1,
        "name": "Admin User",
        "email": "admin@equiaudit.ai",
        "role": "SUPER_ADMIN"
    }