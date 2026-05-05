from transformers import pipeline
import re


ner_pipeline = pipeline("ner", model="d4data/biomedical-ner-all", aggregation_strategy="simple")

def extract_entities(text):
    ner_results = ner_pipeline(text)

    data = {
        "diseases": [],
        "medicines": [],
        "dosage": [],
        "frequency": [],
        "duration": []
    }

    for entity in ner_results:
        label = entity["entity_group"]
        value = entity["word"]

        if label in ["DISEASE", "SYMPTOM"]:
            data["diseases"].append(value)

        elif label in ["DRUG", "CHEMICAL"]:
            data["medicines"].append(value)

    # 🔥 Regex Enhancements (same as before)

    dosage_pattern = r"\b\d+(\.\d+)?\s?(?:mg|ml|g|tablet|tablets)\b"
    data["dosage"] = [
    match.group() for match in re.finditer(dosage_pattern, text, re.IGNORECASE)
    ]

    freq_pattern = r"(once|twice|thrice)\s(daily|a day)"
    data["frequency"] = [" ".join(match) for match in re.findall(freq_pattern, text, re.IGNORECASE)]

    duration_pattern = r"\b\d+\s(days?|weeks?|months?)\b"
    data["duration"] = [" ".join(match) for match in re.findall(duration_pattern, text, re.IGNORECASE)]

    return data