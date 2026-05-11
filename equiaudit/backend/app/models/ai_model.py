# AI Model
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import DateTime
from sqlalchemy.sql import func

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

    dataset_path = Column(String, nullable=True)

    dataset_rows = Column(Integer, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
