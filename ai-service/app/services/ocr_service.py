import os
import cv2
import numpy as np
import pytesseract
import easyocr
from PIL import Image
from pdf2image import convert_from_path


# EasyOCR model loads once when FastAPI starts
easyocr_reader = easyocr.Reader(["en"], gpu=False)


def clean_text(text: str) -> str:
    """
    Remove empty lines and extra spaces from OCR output.
    """

    if not text:
        return ""

    lines = text.splitlines()
    cleaned_lines = []

    for line in lines:
        line = line.strip()
        if line:
            cleaned_lines.append(line)

    return "\n".join(cleaned_lines)


def preprocess_image(pil_image: Image.Image):
    """
    Improve image quality before OCR.
    This helps scanned prescriptions and medical reports.
    """

    image = np.array(pil_image)

    if len(image.shape) == 3:
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Resize image to improve text visibility
    gray = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

    # Reduce noise
    gray = cv2.fastNlMeansDenoising(gray, h=30)

    # Improve contrast
    gray = cv2.convertScaleAbs(gray, alpha=1.5, beta=10)

    # Thresholding
    threshold = cv2.threshold(
        gray,
        0,
        255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )[1]

    return threshold


def tesseract_ocr(processed_image) -> str:
    """
    Tesseract works better for printed text.
    We try multiple page segmentation modes and keep the best result.
    """

    configs = [
        r"--oem 3 --psm 6",
        r"--oem 3 --psm 11",
        r"--oem 3 --psm 4"
    ]

    best_text = ""

    for config in configs:
        text = pytesseract.image_to_string(
            processed_image,
            lang="eng",
            config=config
        )

        text = clean_text(text)

        if len(text.split()) > len(best_text.split()):
            best_text = text

    return best_text


def easyocr_ocr(processed_image) -> str:
    """
    EasyOCR sometimes performs better on rough images and handwritten-like text.
    """

    results = easyocr_reader.readtext(processed_image)

    lines = []

    for result in results:
        detected_text = result[1]
        confidence = result[2]

        if confidence >= 0.25:
            lines.append(detected_text)

    return clean_text("\n".join(lines))


def calculate_ocr_score(text: str) -> int:
    """
    Simple scoring method to choose better OCR result.
    More medical keywords means better result.
    """

    if not text:
        return 0

    medical_keywords = [
        "tab", "tablet", "cap", "capsule", "syrup",
        "mg", "ml", "days", "daily", "dose",
        "morning", "night", "after", "before",
        "diagnosis", "treatment", "medicine"
    ]

    text_lower = text.lower()

    keyword_score = 0

    for keyword in medical_keywords:
        if keyword in text_lower:
            keyword_score += 5

    word_score = len(text.split())

    return keyword_score + word_score


def choose_best_text(tesseract_text: str, easyocr_text: str) -> str:
    """
    Choose the better OCR result between Tesseract and EasyOCR.
    """

    tesseract_score = calculate_ocr_score(tesseract_text)
    easyocr_score = calculate_ocr_score(easyocr_text)

    if easyocr_score > tesseract_score:
        return easyocr_text

    return tesseract_text


def extract_text_from_image(file_path: str) -> str:
    """
    Extract text from image using hybrid OCR.
    """

    image = Image.open(file_path)

    processed_image = preprocess_image(image)

    tesseract_text = tesseract_ocr(processed_image)
    easyocr_text = easyocr_ocr(processed_image)

    best_text = choose_best_text(tesseract_text, easyocr_text)

    return best_text


def extract_text_from_pdf(file_path: str) -> str:
    """
    Convert PDF pages to images, then apply OCR.
    """

    pages = convert_from_path(file_path, dpi=300)

    all_text = []

    for page_number, page in enumerate(pages, start=1):
        processed_image = preprocess_image(page)

        tesseract_text = tesseract_ocr(processed_image)
        easyocr_text = easyocr_ocr(processed_image)

        best_text = choose_best_text(tesseract_text, easyocr_text)

        all_text.append(f"--- Page {page_number} ---\n{best_text}")

    return clean_text("\n\n".join(all_text))


def extract_text(file_path: str) -> str:
    """
    Main OCR function.
    Supports images and PDFs.
    """

    try:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        extension = os.path.splitext(file_path)[1].lower()

        if extension in [".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"]:
            return extract_text_from_image(file_path)

        if extension == ".pdf":
            return extract_text_from_pdf(file_path)

        raise ValueError(f"Unsupported file type: {extension}")
 
    except Exception as e:
        return f"OCR_ERROR: {str(e)}"    