import spacy

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
        if ent.label_ == "DISEASE":
            data["diseases"].append(ent.text)
        elif ent.label_ == "ORG":  # temporary for medicines
            data["medicines"].append(ent.text)

    return data