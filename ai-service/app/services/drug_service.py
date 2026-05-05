def check_interactions(medicines):
    interactions = []
    # dummy rules   can be improved later 
    if "aspirin" in medicines and "ibuprofen" in medicines:
        interactions.append("Aspirin + Ibuprofen may increase bleeding risk")

    if "paracetamol" in medicines and "alcohol" in medicines:
        interactions.append("Paracetamol + Alcohol may cause liver damage")

    return interactions