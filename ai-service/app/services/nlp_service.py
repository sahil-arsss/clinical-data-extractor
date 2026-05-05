import spacy
import re

nlp = spacy.load("en_core_web_sm")

def extract_entities(text):
    doc = nlp(text)

    data = {
        "diseases": [],
        "medicines": [],
        "dosage": [],
        "frequency": [],
        "duration": []
    }


    for ent in doc.ents:
        if ent.label_ in ["ORG", "PRODUCT"]:
            data["medicines"].append(ent.text)

   
    dosage_pattern = r"\b\d+\s?(mg|ml|g|tablets?)\b"
    data["dosage"] = re.findall(dosage_pattern, text, re.IGNORECASE)

    
    freq_pattern = r"(once|twice|thrice)\s(daily|a day)"
    data["frequency"] = [" ".join(match) for match in re.findall(freq_pattern, text, re.IGNORECASE)]

   
    duration_pattern = r"\b\d+\s(days?|weeks?|months?)\b"
    data["duration"] = [" ".join(match) for match in re.findall(duration_pattern, text, re.IGNORECASE)]

    return data