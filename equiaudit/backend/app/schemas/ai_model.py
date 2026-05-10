# AI Model schema
from pydantic import BaseModel


class AIModelSchema(BaseModel):
    id: int

    name: str

    status: str

    bias_index: float