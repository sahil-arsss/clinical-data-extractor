import pytesseract
from PIL import Image

def extract_text(file_path):
    try:
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        return str(e)