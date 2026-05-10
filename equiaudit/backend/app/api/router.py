# API router
from fastapi import APIRouter

from app.api.routes import (
    auth,
    models,
    audits,
    interventions,
    reports,
    alerts,
    users
)

api_router = APIRouter()

api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Auth"]
)

api_router.include_router(
    models.router,
    prefix="/models",
    tags=["Models"]
)

api_router.include_router(
    audits.router,
    prefix="/audits",
    tags=["Audits"]
)

api_router.include_router(
    interventions.router,
    prefix="/interventions",
    tags=["Interventions"]
)

api_router.include_router(
    reports.router,
    prefix="/reports",
    tags=["Reports"]
)

api_router.include_router(
    alerts.router,
    prefix="/alerts",
    tags=["Alerts"]
)

api_router.include_router(
    users.router,
    prefix="/users",
    tags=["Users"]
)