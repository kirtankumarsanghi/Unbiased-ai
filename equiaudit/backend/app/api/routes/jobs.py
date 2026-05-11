import threading
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.api.deps.deps import require_roles
from app.services.explainability.shap_service import SHAPService
from app.services.explainability.lime_service import LIMEService
from app.services.explainability.counterfactual_service import CounterfactualService
from app.services.explainability.proxy_detection_service import ProxyDetectionService

router = APIRouter()

JOB_LOCK = threading.Lock()
JOBS: dict[str, dict] = {}


class JobRequest(BaseModel):
	job_type: str = Field(..., description="shap | lime | counterfactual | proxy_detection")
	payload: dict = Field(default_factory=dict)


def _run_job(job_id: str, job_type: str, payload: dict):
	result = None
	error = None
	try:
		if job_type == "shap":
			result = SHAPService.explain(
				payload.get("features", {}),
				payload.get("baseline"),
				payload.get("top_k", 5),
			)
		elif job_type == "lime":
			result = LIMEService.explain(
				payload.get("features", {}),
				payload.get("weights"),
				payload.get("top_k", 5),
			)
		elif job_type == "counterfactual":
			result = CounterfactualService.propose(
				payload.get("features", {}),
				payload.get("top_k", 3),
			)
		elif job_type == "proxy_detection":
			result = ProxyDetectionService.detect(
				payload.get("features", []),
				payload.get("sensitive_keywords"),
			)
		else:
			raise ValueError("Unsupported job type")
	except Exception as exc:
		error = str(exc)

	with JOB_LOCK:
		job = JOBS.get(job_id)
		if not job:
			return
		job["status"] = "failed" if error else "completed"
		job["completed_at"] = datetime.now(timezone.utc).isoformat()
		job["result"] = result
		job["error"] = error


@router.post("/")
def create_job(
	payload: JobRequest,
	_=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
	job_type = payload.job_type.strip().lower()
	if job_type not in {"shap", "lime", "counterfactual", "proxy_detection"}:
		raise HTTPException(status_code=400, detail="Unsupported job type")

	job_id = str(uuid4())
	job = {
		"id": job_id,
		"status": "queued",
		"job_type": job_type,
		"created_at": datetime.now(timezone.utc).isoformat(),
		"completed_at": None,
		"result": None,
		"error": None,
	}

	with JOB_LOCK:
		JOBS[job_id] = job

	thread = threading.Thread(
		target=_run_job,
		args=(job_id, job_type, payload.payload),
		daemon=True,
	)
	thread.start()

	return {"job_id": job_id, "status": "queued"}


@router.get("/{job_id}")
def get_job(
	job_id: str,
	_=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
	with JOB_LOCK:
		job = JOBS.get(job_id)
	if not job:
		raise HTTPException(status_code=404, detail="Job not found")
	return job


@router.get("/")
def list_jobs(
	_=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
	with JOB_LOCK:
		jobs = list(JOBS.values())
	return {"jobs": jobs}
