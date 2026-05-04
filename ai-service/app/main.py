from app.services.tesseract_config import configure_tesseract

configure_tesseract()
#use for configuration for OCR model 


from fastapi import FastAPI
from app.routes.process import router

app = FastAPI()

app.include_router(router)

@app.get("/")
def home():
    return {"message": "AI Service Running"}  #vf





# import pytesseract

# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# print(pytesseract.get_tesseract_version())