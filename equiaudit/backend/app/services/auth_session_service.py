import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import Request, Response, HTTPException, status
from sqlalchemy.orm import Session
from redis.exceptions import RedisError

from app.core.config import settings
from app.core.redis import redis_client
from app.models.refresh_token import RefreshToken
from app.models.session import UserSession
from app.models.user import User


class AuthSessionService:
    @staticmethod
    def _hash_token(raw: str) -> str:
        return hashlib.sha256(raw.encode("utf-8")).hexdigest()

    @staticmethod
    def _session_key(session_id: str) -> str:
        return f"equiaudit:session:{session_id}"

    @staticmethod
    def create_session(
        db: Session,
        user: User,
        request: Request,
        remember_me: bool = False,
    ):
        now = datetime.now(timezone.utc)
        ttl = (
            settings.REMEMBER_ME_TTL_SECONDS
            if remember_me
            else settings.SESSION_TTL_SECONDS
        )
        session_id = secrets.token_urlsafe(48)
        csrf_token = secrets.token_urlsafe(32)
        refresh_raw = secrets.token_urlsafe(64)
        refresh_hash = AuthSessionService._hash_token(refresh_raw)
        expires_at = now + timedelta(seconds=ttl)

        session_row = UserSession(
            session_id=session_id,
            user_id=user.id,
            csrf_token=csrf_token,
            device_info=request.headers.get("user-agent"),
            ip_address=request.client.host if request.client else None,
            expires_at=expires_at,
            revoked=False,
        )
        db.add(session_row)

        refresh_row = RefreshToken(
            token_hash=refresh_hash,
            user_id=user.id,
            session_id=session_id,
            expires_at=now + timedelta(seconds=settings.REFRESH_TOKEN_TTL_SECONDS),
            revoked=False,
        )
        db.add(refresh_row)
        db.commit()

        try:
            redis_client.setex(
                AuthSessionService._session_key(session_id),
                ttl,
                str(user.id),
            )
        except RedisError:
            # Cache failure is non-fatal; DB session row remains source of truth.
            pass

        return {
            "session_id": session_id,
            "csrf_token": csrf_token,
            "refresh_token": refresh_raw,
            "ttl": ttl,
        }

    @staticmethod
    def set_auth_cookies(response: Response, auth_payload: dict):
        max_age = auth_payload["ttl"]
        response.set_cookie(
            key=settings.SESSION_COOKIE_NAME,
            value=auth_payload["session_id"],
            httponly=True,
            secure=settings.COOKIE_SECURE,
            samesite="lax",
            max_age=max_age,
            path="/",
        )
        response.set_cookie(
            key=settings.REFRESH_COOKIE_NAME,
            value=auth_payload["refresh_token"],
            httponly=True,
            secure=settings.COOKIE_SECURE,
            samesite="lax",
            max_age=settings.REFRESH_TOKEN_TTL_SECONDS,
            path="/api/v1/auth",
        )
        response.set_cookie(
            key=settings.CSRF_COOKIE_NAME,
            value=auth_payload["csrf_token"],
            httponly=False,
            secure=settings.COOKIE_SECURE,
            samesite="lax",
            max_age=max_age,
            path="/",
        )

    @staticmethod
    def clear_auth_cookies(response: Response):
        response.delete_cookie(settings.SESSION_COOKIE_NAME, path="/")
        response.delete_cookie(settings.REFRESH_COOKIE_NAME, path="/api/v1/auth")
        response.delete_cookie(settings.CSRF_COOKIE_NAME, path="/")

    @staticmethod
    def rotate_refresh(db: Session, old_refresh_token: str, request: Request):
        now = datetime.now(timezone.utc)
        old_hash = AuthSessionService._hash_token(old_refresh_token)
        old_row = (
            db.query(RefreshToken)
            .filter(
                RefreshToken.token_hash == old_hash,
                RefreshToken.revoked.is_(False),
            )
            .first()
        )
        if not old_row or old_row.expires_at < now:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

        old_row.revoked = True
        new_refresh_raw = secrets.token_urlsafe(64)
        new_hash = AuthSessionService._hash_token(new_refresh_raw)
        new_row = RefreshToken(
            token_hash=new_hash,
            user_id=old_row.user_id,
            session_id=old_row.session_id,
            expires_at=now + timedelta(seconds=settings.REFRESH_TOKEN_TTL_SECONDS),
            rotated_from=old_row.token_hash,
            revoked=False,
        )
        db.add(new_row)

        session_row = (
            db.query(UserSession)
            .filter(UserSession.session_id == old_row.session_id)
            .first()
        )
        if not session_row or session_row.revoked or session_row.expires_at < now:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired",
            )

        user = db.query(User).filter(User.id == old_row.user_id).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User inactive",
            )

        ttl = max(int((session_row.expires_at - now).total_seconds()), 1)
        try:
            redis_client.setex(AuthSessionService._session_key(session_row.session_id), ttl, str(user.id))
        except RedisError:
            pass
        db.commit()

        return {
            "session_id": session_row.session_id,
            "csrf_token": session_row.csrf_token,
            "refresh_token": new_refresh_raw,
            "ttl": ttl,
            "user": user,
        }
