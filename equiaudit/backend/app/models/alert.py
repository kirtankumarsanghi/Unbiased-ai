from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey, Boolean, Float
from sqlalchemy.sql import func

from app.core.database import Base


class AlertThreshold(Base):
	__tablename__ = "alert_thresholds"

	id = Column(Integer, primary_key=True, index=True)
	organisation_id = Column(Integer, ForeignKey("organisations.id"), nullable=True, index=True)
	fairness_threshold = Column(Float, nullable=True)
	disparity_threshold = Column(Float, nullable=True)
	created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)


class AlertIncident(Base):
	__tablename__ = "alert_incidents"

	id = Column(Integer, primary_key=True, index=True)
	organisation_id = Column(Integer, ForeignKey("organisations.id"), nullable=True, index=True)
	severity = Column(String, index=True)
	source = Column(String, index=True)
	summary = Column(String)
	status = Column(String, default="OPEN", index=True)
	metadata_json = Column(JSON, nullable=True)
	resolved = Column(Boolean, default=False)
	created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
