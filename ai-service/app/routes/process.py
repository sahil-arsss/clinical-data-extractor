from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ocr_service import extract_text
from app.services.nlp_service import extract_entities

router = APIRouter()

class FileRequest(BaseModel):
    file_path: str

@router.post("/process")
def process_file(request: FileRequest):
    text = extract_text(request.file_path)

    entities = extract_entities(text)

    return {
        "raw_text": text,
        "structured_data": entities
    }