# Alerts route
from datetime import datetime, timezone

from fastapi import APIRouter
from fastapi import Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps.deps import get_current_user, get_database, require_roles
from app.core.websocket import manager
from app.models.alert import AlertIncident, AlertThreshold
from app.models.user import User

router = APIRouter()


class ThresholdPayload(BaseModel):
    fairness_threshold: float | None = None
    disparity_threshold: float | None = None


class IncidentPayload(BaseModel):
    severity: str
    source: str
    summary: str
    metadata: dict | None = None


class IncidentEvaluationPayload(BaseModel):
    fairness_score: float | None = None
    disparate_impact: float | None = None
    demographic_parity: float | None = None
    equalized_odds: float | None = None
    source: str = "audit_engine"
    metadata: dict | None = None


@router.get("/")
def get_alerts(
    db: Session = Depends(get_database),
    user: User = Depends(get_current_user),
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
    query = db.query(AlertIncident).order_by(AlertIncident.id.desc())
    if user.organisation_id:
        query = query.filter(AlertIncident.organisation_id == user.organisation_id)
    incidents = query.limit(200).all()
    return [
        {
            "id": incident.id,
            "severity": incident.severity,
            "message": incident.summary,
            "source": incident.source,
            "status": incident.status,
            "created_at": incident.created_at.isoformat() if incident.created_at else None,
            "metadata": incident.metadata_json,
        }
        for incident in incidents
    ]


@router.post("/thresholds")
def update_thresholds(
    payload: ThresholdPayload,
    db: Session = Depends(get_database),
    user: User = Depends(get_current_user),
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN")),
):
    query = db.query(AlertThreshold)
    if user.organisation_id:
        query = query.filter(AlertThreshold.organisation_id == user.organisation_id)
    threshold = query.first()
    if not threshold:
        threshold = AlertThreshold(organisation_id=user.organisation_id)
        db.add(threshold)

    if payload.fairness_threshold is not None:
        threshold.fairness_threshold = float(payload.fairness_threshold)
    if payload.disparity_threshold is not None:
        threshold.disparity_threshold = float(payload.disparity_threshold)

    db.commit()
    db.refresh(threshold)
    return {
        "message": "Thresholds updated",
        "thresholds": {
            "fairness_threshold": threshold.fairness_threshold,
            "disparity_threshold": threshold.disparity_threshold,
        },
    }


@router.post("/incidents/emit")
async def emit_incident(
    payload: IncidentPayload,
    db: Session = Depends(get_database),
    user: User = Depends(get_current_user),
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST")),
):
    body = payload.model_dump()
    incident = AlertIncident(
        organisation_id=user.organisation_id,
        severity=payload.severity.upper(),
        source=payload.source,
        summary=payload.summary,
        status="OPEN",
        metadata_json=payload.metadata,
        created_at=datetime.now(timezone.utc),
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    await manager.broadcast_event(
        "incident.detected",
        body,
        channel="enterprise_incidents",
    )
    return {
        "message": "Incident broadcasted",
        "incident": {
            "id": incident.id,
            "severity": incident.severity,
            "source": incident.source,
            "summary": incident.summary,
            "status": incident.status,
            "created_at": incident.created_at.isoformat() if incident.created_at else None,
            "metadata": incident.metadata_json,
        },
    }


@router.post("/incidents/evaluate")
def evaluate_incident(
    payload: IncidentEvaluationPayload,
    db: Session = Depends(get_database),
    user: User = Depends(get_current_user),
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
    query = db.query(AlertThreshold)
    if user.organisation_id:
        query = query.filter(AlertThreshold.organisation_id == user.organisation_id)
    threshold = query.first()

    fairness_threshold = threshold.fairness_threshold if threshold and threshold.fairness_threshold is not None else 0.8
    disparity_threshold = threshold.disparity_threshold if threshold and threshold.disparity_threshold is not None else 0.8

    fairness_score = payload.fairness_score
    disparity_score = payload.disparate_impact

    should_raise = False
    summary_parts = []
    if fairness_score is not None and fairness_score < fairness_threshold:
        should_raise = True
        summary_parts.append("Fairness score below threshold")
    if disparity_score is not None and disparity_score < disparity_threshold:
        should_raise = True
        summary_parts.append("Disparate impact below threshold")

    if not should_raise:
        return {"message": "No incident", "incident": None}

    severity = "CRITICAL" if (fairness_score and fairness_score < 0.7) or (disparity_score and disparity_score < 0.7) else "WARNING"
    incident = AlertIncident(
        organisation_id=user.organisation_id,
        severity=severity,
        source=payload.source,
        summary="; ".join(summary_parts) or "Threshold breach detected",
        status="OPEN",
        metadata_json=payload.metadata,
        created_at=datetime.now(timezone.utc),
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return {
        "message": "Incident created",
        "incident": {
            "id": incident.id,
            "severity": incident.severity,
            "source": incident.source,
            "summary": incident.summary,
            "status": incident.status,
            "created_at": incident.created_at.isoformat() if incident.created_at else None,
            "metadata": incident.metadata_json,
        },
    }
