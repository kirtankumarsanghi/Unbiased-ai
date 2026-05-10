# AI Model
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float

from app.core.database import Base


class AIModel(Base):
    __tablename__ = "ai_models"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(String)

    status = Column(String)

    bias_index = Column(Float)

    throughput = Column(String)

    data_drift = Column(Float)