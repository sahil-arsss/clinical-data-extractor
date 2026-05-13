import re
from transformers import pipeline


ner_pipeline = pipeline(
    "ner",
    model="d4data/biomedical-ner-all",
    aggregation_strategy="simple"
)


def normalize_value(value: str) -> str:
    """
    Cleans entity values returned by model or regex.
    """
    if not value:
        return ""

    value = value.replace("##", "")
    value = value.strip()
    value = re.sub(r"\s+", " ", value)

    return value


def add_unique(target_list, value):
    """
    Adds value only if it is not already present.
    Case-insensitive duplicate removal.
    """
    value = normalize_value(value)

    if not value:
        return

    existing_values = [item.lower() for item in target_list]

    if value.lower() not in existing_values:
        target_list.append(value)


def extract_dosage(text: str):
    """
    Extract medicine dosage patterns.
    Examples:
    500mg, 5 ml, 1 tablet, 2 tablets, 10 mg
    """

    dosage_pattern = r"\b\d+(\.\d+)?\s?(mg|ml|g|mcg|tablet|tablets|capsule|capsules|drops|units)\b"

    results = []

    for match in re.finditer(dosage_pattern, text, re.IGNORECASE):
        add_unique(results, match.group())

    return results


def extract_frequency(text: str):
    """
    Extract frequency patterns.
    Examples:
    once daily, twice daily, thrice daily, every 8 hours, 1-0-1
    """

    patterns = [
        r"\b(once|twice|thrice)\s+(daily|a day|per day)\b",
        r"\b(every)\s+\d+\s+(hours?|hrs?|days?)\b",
        r"\b\d-\d-\d\b",
        r"\b(morning|night|evening|afternoon)\b",
        r"\b(after food|before food|with food|empty stomach)\b"
    ]

    results = []

    for pattern in patterns:
        for match in re.finditer(pattern, text, re.IGNORECASE):
            add_unique(results, match.group())

    return results


def extract_duration(text: str):
    """
    Extract duration patterns.
    Examples:
    5 days, 2 weeks, for 10 days
    """

    duration_pattern = r"\b(?:for\s+)?\d+\s+(days?|weeks?|months?)\b"

    results = []

    for match in re.finditer(duration_pattern, text, re.IGNORECASE):
        add_unique(results, match.group())

    return results


def extract_entities(text: str):
    """
    Extract medical structured data from OCR text.
    Uses:
    1. Biomedical NER model
    2. Regex for dosage/frequency/duration
    3. Rule-based cleanup
    """

    data = {
        "diseases": [],
        "medicines": [],
        "dosage": [],
        "frequency": [],
        "duration": []
    }

    if not text or text.startswith("OCR_ERROR"):
        return data

    ner_results = ner_pipeline(text)

    for entity in ner_results:
        label = entity.get("entity_group", "").upper()
        value = entity.get("word", "")

        value = normalize_value(value)

        if not value:
            continue

        # Model labels can vary, so we keep this flexible
        if any(keyword in label for keyword in ["DISEASE", "DISORDER", "SYMPTOM", "SIGN"]):
            add_unique(data["diseases"], value)

        elif any(keyword in label for keyword in ["DRUG", "MEDICATION", "CHEMICAL"]):
            add_unique(data["medicines"], value)

    data["dosage"] = extract_dosage(text)
    data["frequency"] = extract_frequency(text)
    data["duration"] = extract_duration(text)

    return data