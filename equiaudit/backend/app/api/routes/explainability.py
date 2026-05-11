from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.api.deps.deps import require_roles
from app.services.explainability.shap_service import SHAPService
from app.services.explainability.lime_service import LIMEService
from app.services.explainability.counterfactual_service import CounterfactualService
from app.services.explainability.proxy_detection_service import ProxyDetectionService

router = APIRouter()


class ExplainabilityBase(BaseModel):
	features: dict[str, float] = Field(default_factory=dict)
	top_k: int = 5


class SHAPRequest(ExplainabilityBase):
	baseline: dict[str, float] | None = None


class LIMERequest(ExplainabilityBase):
	weights: dict[str, float] | None = None


class CounterfactualRequest(ExplainabilityBase):
	pass


class ProxyDetectionRequest(BaseModel):
	features: list[str] = Field(default_factory=list)
	sensitive_keywords: list[str] | None = None


@router.get("/health")
def explainability_health():
	return {"status": "ok"}


@router.post("/shap")
def explain_shap(
	payload: SHAPRequest,
	_=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
	if not payload.features:
		raise HTTPException(status_code=400, detail="Features are required")
	return SHAPService.explain(payload.features, payload.baseline, payload.top_k)


@router.post("/lime")
def explain_lime(
	payload: LIMERequest,
	_=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
	if not payload.features:
		raise HTTPException(status_code=400, detail="Features are required")
	return LIMEService.explain(payload.features, payload.weights, payload.top_k)


@router.post("/counterfactual")
def explain_counterfactual(
	payload: CounterfactualRequest,
	_=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
	if not payload.features:
		raise HTTPException(status_code=400, detail="Features are required")
	return CounterfactualService.propose(payload.features, payload.top_k)


@router.post("/proxy-detection")
def explain_proxy_detection(
	payload: ProxyDetectionRequest,
	_=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
	if not payload.features:
		raise HTTPException(status_code=400, detail="Features are required")
	return ProxyDetectionService.detect(payload.features, payload.sensitive_keywords)
