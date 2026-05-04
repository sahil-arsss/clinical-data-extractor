import pytesseract
import os

TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def configure_tesseract():
    if os.name == "nt":
        pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH