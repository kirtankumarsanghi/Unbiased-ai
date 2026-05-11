# API router
from fastapi import APIRouter, Depends

from app.api.routes import (
    auth,
    models,
    audits,
    interventions,
    reports,
    alerts,
    users,
    audit_logs,
    metrics,
    public_intelligence,
    explainability,
    jobs,
)
from app.api.deps.deps import enforce_csrf

api_router = APIRouter()

api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Auth"]
)

api_router.include_router(
    models.router,
    prefix="/models",
    tags=["Models"],
    dependencies=[Depends(enforce_csrf)],
)

api_router.include_router(
    audits.router,
    prefix="/audits",
    tags=["Audits"],
    dependencies=[Depends(enforce_csrf)],
)

api_router.include_router(
    interventions.router,
    prefix="/interventions",
    tags=["Interventions"],
    dependencies=[Depends(enforce_csrf)],
)

api_router.include_router(
    reports.router,
    prefix="/reports",
    tags=["Reports"],
    dependencies=[Depends(enforce_csrf)],
)

api_router.include_router(
    alerts.router,
    prefix="/alerts",
    tags=["Alerts"],
    dependencies=[Depends(enforce_csrf)],
)

api_router.include_router(
    audit_logs.router,
    prefix="/audit-logs",
    tags=["Audit Logs"],
    dependencies=[Depends(enforce_csrf)],
)

api_router.include_router(
    metrics.router,
    prefix="/metrics",
    tags=["Metrics"],
    dependencies=[Depends(enforce_csrf)],
)

api_router.include_router(
    users.router,
    prefix="/users",
    tags=["Users"],
    dependencies=[Depends(enforce_csrf)],
)

api_router.include_router(
    public_intelligence.router,
    prefix="/public-intelligence",
    tags=["Public Intelligence"],
    dependencies=[Depends(enforce_csrf)],
)

api_router.include_router(
    explainability.router,
    prefix="/explainability",
    tags=["Explainability"],
    dependencies=[Depends(enforce_csrf)],
)

api_router.include_router(
    jobs.router,
    prefix="/jobs",
    tags=["Jobs"],
    dependencies=[Depends(enforce_csrf)],
)
