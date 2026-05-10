from fastapi import APIRouter

from app.data.store import store

router = APIRouter()


@router.get("/")
def get_audit_logs():
	return store.audit_logs
