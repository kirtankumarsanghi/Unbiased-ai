# Audit schema
from pydantic import BaseModel


class AuditSchema(BaseModel):
    demographic_parity: float

    equalized_odds: float

    disparate_impact: float