from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func

from app.core.database import Base


class AuthToken(Base):
    __tablename__ = "auth_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    token_hash = Column(String, unique=True, index=True, nullable=False)
    token_type = Column(String, index=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), index=True, nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
