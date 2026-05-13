from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.ocr_service import extract_text
from app.services.nlp_service import extract_entities
from app.services.drug_service import check_interactions


router = APIRouter()


class FileRequest(BaseModel):
    file_path: str


@router.post("/process")
def process_file(request: FileRequest):
    try:
        text = extract_text(request.file_path)

        if text.startswith("OCR_ERROR"):
            raise HTTPException(status_code=500, detail=text)

        entities = extract_entities(text)

        interactions = check_interactions(entities["medicines"])

        return {
            "raw_text": text,
            "structured_data": entities,
            "drug_alerts": interactions
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))