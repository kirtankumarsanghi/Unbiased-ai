# JWT utilities
from jose import jwt

SECRET = "secret"


def generate_token(data: dict):
    return jwt.encode(
        data,
        SECRET,
        algorithm="HS256"
    )