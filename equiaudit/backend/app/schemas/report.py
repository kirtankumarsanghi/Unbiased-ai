# Report schema
from pydantic import BaseModel


class ReportSchema(BaseModel):
    id: int

    status: str