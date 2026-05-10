from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.data.store import store

router = APIRouter()


@router.get("/")
def get_models():
    return store.list_models()


@router.get("/{model_id}")
def get_model(model_id: int):
    model = store.get_model(model_id)

    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    return model


@router.post("/upload")
def upload_model(
    file: UploadFile = File(...),
    name: str | None = Form(None),
):
    model_name = name or file.filename or "Unnamed Model"
    model = store.add_model(model_name)

    return {
        "message": "Model uploaded",
        "model": model,
    }


@router.delete("/{model_id}")
def delete_model(model_id: int):
    model = store.delete_model(model_id)

    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    return {
        "message": "Model deleted",
        "model": model,
    }