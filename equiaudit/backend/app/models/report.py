# Report model
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from app.core.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(String)

    status = Column(String)

    content = Column(String)

    generated_at = Column(DateTime(timezone=True), server_default=func.now())
