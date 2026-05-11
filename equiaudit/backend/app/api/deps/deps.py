from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from fastapi import Request
from fastapi import WebSocket
from fastapi import WebSocketException
from sqlalchemy.orm import Session
from redis.exceptions import RedisError

from app.core.database import get_db, SessionLocal
from app.core.config import settings
from app.core.redis import redis_client
from app.models.session import UserSession
from app.models.user import User


def get_database(
    db: Session = Depends(get_db)
):
    return db

def get_current_user(
    request: Request,
    db: Session = Depends(get_database),
):
    session_id = request.cookies.get(settings.SESSION_COOKIE_NAME)
    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    cached_user_id = None
    try:
        cached_user_id = redis_client.get(f"equiaudit:session:{session_id}")
    except RedisError:
        # Redis cache miss/failure should not break auth when DB session is valid.
        cached_user_id = None
    session_row = (
        db.query(UserSession)
        .filter(UserSession.session_id == session_id, UserSession.revoked.is_(False))
        .first()
    )
    if not session_row:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session not found",
        )

    user_id = int(cached_user_id) if cached_user_id else session_row.user_id
    user = db.query(User).filter(User.id == user_id, User.is_active.is_(True)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user


def get_current_user_ws(websocket: WebSocket) -> User:
    session_id = websocket.cookies.get(settings.SESSION_COOKIE_NAME)
    if not session_id:
        raise WebSocketException(code=1008)

    db = SessionLocal()
    try:
        cached_user_id = None
        try:
            cached_user_id = redis_client.get(f"equiaudit:session:{session_id}")
        except RedisError:
            cached_user_id = None

        session_row = (
            db.query(UserSession)
            .filter(UserSession.session_id == session_id, UserSession.revoked.is_(False))
            .first()
        )
        if not session_row:
            raise WebSocketException(code=1008)

        user_id = int(cached_user_id) if cached_user_id else session_row.user_id
        user = db.query(User).filter(User.id == user_id, User.is_active.is_(True)).first()
        if not user:
            raise WebSocketException(code=1008)
        return user
    finally:
        db.close()


def enforce_csrf(request: Request):
    if request.method in {"POST", "PUT", "PATCH", "DELETE"}:
        cookie_token = request.cookies.get(settings.CSRF_COOKIE_NAME)
        header_token = request.headers.get("x-csrf-token")
        if not cookie_token or not header_token or cookie_token != header_token:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="CSRF validation failed",
            )


def require_roles(*roles: str):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient role permissions",
            )
        return current_user

    return role_checker
