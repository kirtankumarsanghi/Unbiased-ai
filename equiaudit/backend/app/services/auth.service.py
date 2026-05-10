# Auth service
from app.core.security import (
    create_access_token
)


class AuthService:

    @staticmethod
    def login(email: str):
        return create_access_token(
            {
                "sub": email
            }
        )