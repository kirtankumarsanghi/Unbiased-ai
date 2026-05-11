# Intervention model
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.core.database import Base


class Intervention(Base):
    __tablename__ = "interventions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(String)

    status = Column(String)

    fairness_gain = Column(String, default="+0%")

    accuracy_tradeoff = Column(String, default="0%")

    processing_time = Column(String, default="N/A")
