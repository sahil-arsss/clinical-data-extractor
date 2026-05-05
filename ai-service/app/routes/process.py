from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ocr_service import extract_text
from app.services.nlp_service import extract_entities
from app.services.drug_service import check_interactions

router = APIRouter()

class FileRequest(BaseModel):
    file_path: str

@router.post("/process")
def process_file(request: FileRequest):
    text = extract_text(request.file_path)

    entities = extract_entities(text)

    interactions = check_interactions(entities["medicines"])

    return {
        "raw_text": text,
        "structured_data": entities,
        "drug_alerts": interactions
    }