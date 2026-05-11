from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.api.deps.deps import get_database, require_roles
from app.models.audit_log import AuditLog

router = APIRouter()


@router.get("/")
def get_audit_logs(
    db: Session = Depends(get_database),
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
    logs = db.query(AuditLog).order_by(AuditLog.id.desc()).limit(200).all()
    return [
        {
            "id": log.id,
            "level": log.level,
            "timestamp": (
                log.created_at.strftime("%H:%M:%S")
                if log.created_at
                else "--:--:--"
            ),
            "message": log.message,
        }
        for log in logs
    ]
