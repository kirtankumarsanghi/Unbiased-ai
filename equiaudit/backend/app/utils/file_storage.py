from pathlib import Path
from datetime import datetime
from fastapi import UploadFile


def save_uploaded_file(upload_file: UploadFile, storage_dir: str) -> str:
    base_dir = Path(storage_dir)
    base_dir.mkdir(parents=True, exist_ok=True)

    safe_name = (upload_file.filename or "dataset.csv").replace(" ", "_")
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
    file_name = f"{timestamp}_{safe_name}"
    file_path = base_dir / file_name

    with file_path.open("wb") as output:
        output.write(upload_file.file.read())

    return str(file_path)
