from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse

from app.data.store import store

router = APIRouter()


@router.get("/")
def list_reports():
    return store.list_reports()


@router.post("/generate")
def generate_report():
    report = store.create_report()

    return {
        "report_id": report["id"],
        "status": "COMPLETED",
    }


@router.get("/{report_id}/download")
def download_report(report_id: int):
    report = store.get_report(report_id)

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    return PlainTextResponse(
        report["content"],
        headers={
            "Content-Disposition": f"attachment; filename=report-{report_id}.txt"
        },
    )