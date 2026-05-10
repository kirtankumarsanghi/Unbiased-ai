# Auth route
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.core.security import create_access_token

router = APIRouter()


class LoginSchema(BaseModel):
    email: str

    password: str


class TokenSchema(BaseModel):
    access_token: str

    token_type: str


@router.post("/login", response_model=TokenSchema)
def login(payload: LoginSchema):
    if not payload.email or not payload.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {"sub": payload.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }