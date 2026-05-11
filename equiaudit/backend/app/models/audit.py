# Audit model
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from app.core.database import Base


class Audit(Base):
    __tablename__ = "audits"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    model_id = Column(Integer, index=True)

    demographic_parity = Column(Float)

    equalized_odds = Column(Float)

    disparate_impact = Column(Float)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
