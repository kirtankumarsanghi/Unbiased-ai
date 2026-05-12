from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.api.deps.deps import require_roles
from app.services.explainability.shap_service import SHAPService
from app.services.explainability.lime_service import LIMEService
from app.services.explainability.counterfactual_service import CounterfactualService
from app.services.explainability.proxy_detection_service import ProxyDetectionService
from app.services.llm.openai_client import get_openai_client

router = APIRouter()


EXPLAINABILITY_SYSTEM = (
	"You are an explainability assistant. "
	"Explain results in 2-3 sentences, plain language, neutral tone."
)


async def _explain_commentary(user_prompt: str) -> str | None:
	client = get_openai_client()
	return await client.generate_text(EXPLAINABILITY_SYSTEM, user_prompt)


def _top_features_summary(items: list[dict], key: str) -> str:
	parts = []
	for item in items[:3]:
		name = item.get("feature", "feature")
		val = item.get(key)
		if isinstance(val, (int, float)):
			parts.append(f"{name} ({val:.2f})")
		else:
			parts.append(str(name))
	return ", ".join(parts) if parts else "Top features were identified."


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


class ExplainabilityAskRequest(BaseModel):
	question: str = Field(min_length=4, max_length=4000)
	analysis_context: dict[str, object] | None = None


@router.get("/health")
def explainability_health():
	return {"status": "ok"}


@router.post("/shap")
async def explain_shap(
	payload: SHAPRequest,
	_=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
	if not payload.features:
		raise HTTPException(status_code=400, detail="Features are required")
	result = SHAPService.explain(payload.features, payload.baseline, payload.top_k)
	summary = _top_features_summary(result.get("top_features", []), "importance")
	commentary = await _explain_commentary(
		f"SHAP top drivers: {summary}. Explain what this means."
	)
	if not commentary:
		commentary = f"Top SHAP drivers are {summary}. Higher importance means stronger influence on the prediction."
	result["commentary"] = commentary
	return result


@router.post("/lime")
async def explain_lime(
	payload: LIMERequest,
	_=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
	if not payload.features:
		raise HTTPException(status_code=400, detail="Features are required")
	result = LIMEService.explain(payload.features, payload.weights, payload.top_k)
	summary = _top_features_summary(result.get("top_features", []), "importance")
	commentary = await _explain_commentary(
		f"LIME top drivers: {summary}. Explain what this means."
	)
	if not commentary:
		commentary = f"LIME shows the strongest local drivers as {summary}. Larger weights indicate higher local impact."
	result["commentary"] = commentary
	return result


@router.post("/counterfactual")
async def explain_counterfactual(
	payload: CounterfactualRequest,
	_=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
	if not payload.features:
		raise HTTPException(status_code=400, detail="Features are required")
	result = CounterfactualService.propose(payload.features, payload.top_k)
	changes = result.get("counterfactuals", [])
	if changes:
		first = changes[0]
		summary = f"{first.get('feature')} from {first.get('current')} to {first.get('suggested')}"
	else:
		summary = "a few minimal feature changes"
	commentary = await _explain_commentary(
		f"Counterfactual suggestion: {summary}. Explain the minimal changes." 
	)
	if not commentary:
		commentary = "These are the smallest feature changes that would most likely flip the outcome."
	result["commentary"] = commentary
	return result


@router.post("/proxy-detection")
async def explain_proxy_detection(
	payload: ProxyDetectionRequest,
	_=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
	if not payload.features:
		raise HTTPException(status_code=400, detail="Features are required")
	result = ProxyDetectionService.detect(payload.features, payload.sensitive_keywords)
	flagged = result.get("flagged_count", 0)
	risk = result.get("risk_score", 0)
	commentary = await _explain_commentary(
		f"Proxy detection flagged {flagged} features. Risk score {risk}. Explain the governance risk." 
	)
	if not commentary:
		if flagged:
			commentary = "Potential proxy features were detected. Review them for correlation with protected classes."
		else:
			commentary = "No strong proxy signals detected in the current feature set."
	result["commentary"] = commentary
	return result


@router.post("/assistant")
async def explainability_assistant(
	payload: ExplainabilityAskRequest,
	_=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
	context_text = str(payload.analysis_context) if payload.analysis_context else "None"
	commentary = await _explain_commentary(
		"User asked an explainability question. "
		f"Question: {payload.question}\n"
		f"Analysis context: {context_text}\n"
		"Explain in plain language and include one practical next step."
	)
	if not commentary:
		commentary = "I could not generate live explainability guidance right now. Please verify OpenAI configuration and retry."
	return {
		"question": payload.question,
		"answer": commentary,
		"comment": "This is a model-generated explanation and should be validated for high-stakes use."
	}
