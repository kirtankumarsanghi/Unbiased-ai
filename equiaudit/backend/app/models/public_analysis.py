from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import JSON
from sqlalchemy.sql import func

from app.core.database import Base


class PublicAnalysis(Base):
    __tablename__ = "public_analyses"

    id = Column(Integer, primary_key=True, index=True)
    analysis_type = Column(String, index=True, nullable=False)
    input_payload = Column(JSON, nullable=False)
    output_payload = Column(JSON, nullable=False)
    confidence_score = Column(String, nullable=True)
    risk_score = Column(String, nullable=True)
    neutrality_score = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    organisation_id = Column(Integer, ForeignKey("organisations.id"), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
