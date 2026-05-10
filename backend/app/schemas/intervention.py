# Intervention schema
from pydantic import BaseModel


class InterventionSchema(BaseModel):
    name: str

    status: str