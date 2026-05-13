def check_interactions(medicines):
    """
    Basic rule-based drug interaction checker.
    This can later be replaced by a real drug interaction API/database.
    """

    interactions = []

    normalized_medicines = [
        medicine.lower().strip()
        for medicine in medicines
        if medicine
    ]

    medicine_text = " ".join(normalized_medicines)

    if "aspirin" in medicine_text and "ibuprofen" in medicine_text:
        interactions.append("Aspirin + Ibuprofen may increase bleeding risk")

    if "paracetamol" in medicine_text and "alcohol" in medicine_text:
        interactions.append("Paracetamol + Alcohol may increase liver damage risk")

    if "warfarin" in medicine_text and "aspirin" in medicine_text:
        interactions.append("Warfarin + Aspirin may increase bleeding risk")

    return interactions