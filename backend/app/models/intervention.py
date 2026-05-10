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