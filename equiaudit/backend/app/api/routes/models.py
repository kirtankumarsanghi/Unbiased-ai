from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi import Depends
from sqlalchemy.orm import Session
from pathlib import Path
import os

from app.api.deps.deps import get_database, require_roles
from app.models.ai_model import AIModel
from app.services.fairness.dataset_fairness_service import calculate_fairness_metrics_from_csv
from app.utils.file_storage import save_uploaded_file

router = APIRouter()


@router.get("/")
def get_models(
    db: Session = Depends(get_database),
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
    models = db.query(AIModel).order_by(AIModel.id.asc()).all()
    return [
        {
            "id": model.id,
            "name": model.name,
            "status": model.status,
            "biasIndex": model.bias_index,
            "throughput": model.throughput,
            "dataDrift": f"{model.data_drift:.1f}%",
        }
        for model in models
    ]


@router.get("/{model_id}")
def get_model(
    model_id: int,
    db: Session = Depends(get_database),
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST", "AUDITOR")),
):
    model = db.query(AIModel).filter(AIModel.id == model_id).first()

    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    return {
        "id": model.id,
        "name": model.name,
        "status": model.status,
        "biasIndex": model.bias_index,
        "throughput": model.throughput,
        "dataDrift": f"{model.data_drift:.1f}%",
    }


@router.post("/upload")
def upload_model(
    file: UploadFile = File(...),
    name: str | None = Form(None),
    db: Session = Depends(get_database),
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN", "ANALYST")),
):
    model_name = name or file.filename or "Unnamed Model"
    storage_dir = Path(__file__).resolve().parents[3] / "storage" / "uploads"
    dataset_path = save_uploaded_file(file, str(storage_dir))

    try:
        metrics = calculate_fairness_metrics_from_csv(dataset_path)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    avg_fairness = round(
        (
            metrics["demographic_parity"] +
            metrics["equalized_odds"] +
            metrics["disparate_impact"]
        ) / 3,
        2,
    )

    if avg_fairness >= 0.85:
        status = "SAFE"
    elif avg_fairness >= 0.70:
        status = "WARNING"
    else:
        status = "CRITICAL"

    model = AIModel(
        name=model_name,
        status=status,
        bias_index=round(1 - avg_fairness, 2),
        throughput=f"{max(0.1, round(metrics['rows'] / 1000, 1))}k req/s",
        data_drift=round(abs(0.5 - metrics["disparate_impact"]) * 100, 1),
        dataset_path=dataset_path,
        dataset_rows=metrics["rows"],
    )
    db.add(model)
    db.commit()
    db.refresh(model)

    return {
        "message": "Model uploaded",
        "model": {
            "id": model.id,
            "name": model.name,
            "status": model.status,
            "biasIndex": model.bias_index,
            "throughput": model.throughput,
            "dataDrift": f"{model.data_drift:.1f}%",
        },
        "computed_metrics": metrics,
    }


@router.delete("/{model_id}")
def delete_model(
    model_id: int,
    db: Session = Depends(get_database),
    _=Depends(require_roles("SUPER_ADMIN", "ORG_ADMIN")),
):
    model = db.query(AIModel).filter(AIModel.id == model_id).first()

    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    if model.dataset_path and os.path.exists(model.dataset_path):
        os.remove(model.dataset_path)
    db.delete(model)
    db.commit()

    return {
        "message": "Model deleted",
        "model": {
            "id": model.id,
            "name": model.name,
        },
    }
