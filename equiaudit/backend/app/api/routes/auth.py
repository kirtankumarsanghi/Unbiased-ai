from datetime import datetime, timedelta, timezone
import hashlib
import secrets

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from pydantic import BaseModel, EmailStr
from redis.exceptions import RedisError
from sqlalchemy.orm import Session

from app.api.deps.deps import enforce_csrf, get_current_user, get_database
from app.core.config import settings
from app.core.redis import redis_client
from app.core.security import hash_password, verify_password
from app.models.login_history import LoginHistory
from app.models.organisation import Organisation
from app.models.refresh_token import RefreshToken
from app.models.session import UserSession
from app.models.user import User
from app.models.auth_token import AuthToken
from app.services.auth_session_service import AuthSessionService

router = APIRouter()


class SignupSchema(BaseModel):
    name: str
    email: EmailStr
    password: str
    organisation_name: str | None = None


class LoginSchema(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = True


class ForgotPasswordSchema(BaseModel):
    email: EmailStr


class ResetPasswordSchema(BaseModel):
    token: str
    new_password: str


class VerifyEmailSchema(BaseModel):
    token: str


TOKEN_TYPE_RESET = "reset"
TOKEN_TYPE_VERIFY = "verify"


@router.get("/status")
def auth_status():
    return {"status": "ok", "auth": "ready"}


def _validate_password(password: str):
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    if settings.dev_auth_relaxed_password_policy:
        return
    if password.lower() == password or password.upper() == password:
        raise HTTPException(status_code=400, detail="Password must include mixed case")
    if not any(ch.isdigit() for ch in password):
        raise HTTPException(status_code=400, detail="Password must include a digit")


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _create_token(db: Session, user: User, token_type: str, ttl_minutes: int) -> str:
    raw = secrets.token_urlsafe(48)
    token_hash = _hash_token(raw)
    token = AuthToken(
        user_id=user.id,
        token_hash=token_hash,
        token_type=token_type,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=ttl_minutes),
        used=False,
    )
    db.add(token)
    db.commit()
    return raw


@router.get("/csrf")
def get_csrf(response: Response):
    csrf = secrets.token_urlsafe(32)
    response.set_cookie(
        key=settings.CSRF_COOKIE_NAME,
        value=csrf,
        httponly=False,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        max_age=settings.SESSION_TTL_SECONDS,
        path="/",
    )
    return {"csrf_token": csrf}


@router.post("/signup")
def signup(payload: SignupSchema, request: Request, response: Response, db: Session = Depends(get_database)):
    normalized_email = payload.email.strip().lower()
    _validate_password(payload.password)
    existing_user = db.query(User).filter(User.email == normalized_email).first()
    if existing_user:
        if settings.dev_auth_accept_any_password:
            existing_user.password = hash_password(payload.password)
            existing_user.is_active = True
            db.commit()
            db.refresh(existing_user)
        auth_payload = AuthSessionService.create_session(db, existing_user, request, remember_me=True)
        AuthSessionService.set_auth_cookies(response, auth_payload)
        return {
            "user": {
                "id": existing_user.id,
                "name": existing_user.name,
                "email": existing_user.email,
                "role": existing_user.role,
            },
            "message": "Account already existed. Logged in successfully.",
        }

    org = None
    if payload.organisation_name:
        slug = payload.organisation_name.strip().lower().replace(" ", "-")
        org = db.query(Organisation).filter(Organisation.slug == slug).first()
        if not org:
            org = Organisation(name=payload.organisation_name.strip(), slug=slug)
            db.add(org)
            db.flush()

    user = User(
        name=payload.name.strip(),
        email=normalized_email,
        password=hash_password(payload.password),
        role="ANALYST",
        organisation_id=org.id if org else None,
        email_verified=False,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    verify_token = _create_token(db, user, TOKEN_TYPE_VERIFY, ttl_minutes=24 * 60)

    auth_payload = AuthSessionService.create_session(db, user, request, remember_me=True)
    AuthSessionService.set_auth_cookies(response, auth_payload)
    return {
        "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role},
        "verify_token": verify_token,
    }


@router.post("/login")
def login(payload: LoginSchema, request: Request, response: Response, db: Session = Depends(get_database)):
    normalized_email = payload.email.strip().lower()
    user = db.query(User).filter(User.email == normalized_email).first()
    if not user and settings.dev_auth_auto_provision:
        domain = normalized_email.split("@")[-1].lower()
        if domain in settings.auto_provision_email_domains:
            _validate_password(payload.password)
            derived_name = normalized_email.split("@")[0].replace(".", " ").replace("_", " ").strip().title() or "Analyst"
            user = User(
                name=derived_name,
                email=normalized_email,
                password=hash_password(payload.password),
                role=settings.AUTO_PROVISION_ROLE,
                is_active=True,
                email_verified=False,
            )
            db.add(user)
            db.commit()
            db.refresh(user)

    success = bool(user and verify_password(payload.password, user.password))
    if user and not success and settings.dev_auth_accept_any_password:
        # Dev-mode compatibility: keep account accessible even if password drifted.
        user.password = hash_password(payload.password)
        db.commit()
        db.refresh(user)
        success = True

    db.add(
        LoginHistory(
            user_id=user.id if user else None,
            email=normalized_email,
            success=success,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
        )
    )
    db.commit()

    if not success:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account disabled")

    auth_payload = AuthSessionService.create_session(db, user, request, remember_me=payload.remember_me)
    AuthSessionService.set_auth_cookies(response, auth_payload)

    return {"user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}}


@router.post("/logout")
def logout(
    request: Request,
    response: Response,
    db: Session = Depends(get_database),
    _=Depends(enforce_csrf),
):
    session_id = request.cookies.get(settings.SESSION_COOKIE_NAME)
    refresh_token = request.cookies.get(settings.REFRESH_COOKIE_NAME)
    if session_id:
        db.query(UserSession).filter(UserSession.session_id == session_id).update({"revoked": True})
        try:
            redis_client.delete(f"equiaudit:session:{session_id}")
        except RedisError:
            pass
    if refresh_token:
        token_hash = AuthSessionService._hash_token(refresh_token)
        db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash).update({"revoked": True})
    db.commit()
    AuthSessionService.clear_auth_cookies(response)
    return {"message": "Logged out"}


@router.post("/refresh")
def refresh_session(
    request: Request,
    response: Response,
    db: Session = Depends(get_database),
):
    refresh_raw = request.cookies.get(settings.REFRESH_COOKIE_NAME)
    if not refresh_raw:
        raise HTTPException(status_code=401, detail="Missing refresh cookie")
    rotated = AuthSessionService.rotate_refresh(db, refresh_raw, request)
    AuthSessionService.set_auth_cookies(response, rotated)
    user = rotated["user"]
    return {"user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}}


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordSchema, db: Session = Depends(get_database)):
    user = db.query(User).filter(User.email == payload.email).first()
    if user:
        token = _create_token(db, user, TOKEN_TYPE_RESET, ttl_minutes=60)
        return {"message": "Password reset initiated", "reset_token": token}
    return {"message": "If email exists, reset instructions were sent"}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordSchema, db: Session = Depends(get_database)):
    _validate_password(payload.new_password)
    token_hash = _hash_token(payload.token)
    token_row = (
        db.query(AuthToken)
        .filter(
            AuthToken.token_hash == token_hash,
            AuthToken.token_type == TOKEN_TYPE_RESET,
            AuthToken.used.is_(False),
            AuthToken.expires_at >= datetime.now(timezone.utc),
        )
        .first()
    )
    if not token_row:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    user = db.query(User).filter(User.id == token_row.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.password = hash_password(payload.new_password)
    token_row.used = True
    db.commit()
    return {"message": "Password reset successful"}


@router.post("/verify-email")
def verify_email(payload: VerifyEmailSchema, db: Session = Depends(get_database)):
    token_hash = _hash_token(payload.token)
    token_row = (
        db.query(AuthToken)
        .filter(
            AuthToken.token_hash == token_hash,
            AuthToken.token_type == TOKEN_TYPE_VERIFY,
            AuthToken.used.is_(False),
            AuthToken.expires_at >= datetime.now(timezone.utc),
        )
        .first()
    )
    if not token_row:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")
    user = db.query(User).filter(User.id == token_row.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.email_verified = True
    token_row.used = True
    db.commit()
    return {"message": "Email verified"}


@router.get("/sessions")
def list_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_database),
):
    sessions = (
        db.query(UserSession)
        .filter(UserSession.user_id == current_user.id, UserSession.revoked.is_(False))
        .order_by(UserSession.created_at.desc())
        .all()
    )
    return [
        {
            "session_id": s.session_id,
            "device_info": s.device_info,
            "ip_address": s.ip_address,
            "expires_at": s.expires_at.isoformat() if s.expires_at else None,
            "created_at": s.created_at.isoformat() if s.created_at else None,
        }
        for s in sessions
    ]
