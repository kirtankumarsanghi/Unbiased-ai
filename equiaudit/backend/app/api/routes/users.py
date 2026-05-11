# Users route
from fastapi import APIRouter
from fastapi import Depends

from app.api.deps.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/me")
def current_user_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }
