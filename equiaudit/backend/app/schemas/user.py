# User schema
from pydantic import BaseModel


class UserSchema(BaseModel):
    id: int

    name: str

    email: str

    role: str