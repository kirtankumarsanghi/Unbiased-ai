# Audit model
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy import String

from app.core.database import Base


class Audit(Base):
    __tablename__ = "audits"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    model_name = Column(String)

    demographic_parity = Column(Float)

    equalized_odds = Column(Float)

    disparate_impact = Column(Float)