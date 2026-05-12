# Users route
from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.api.deps.deps import get_current_user, get_database, require_roles
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


@router.get("")
def list_users(
    db: Session = Depends(get_database),
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN")),
):
    users = db.query(User).order_by(User.id.asc()).all()
    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
        }
        for user in users
    ]
