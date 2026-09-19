def calculate_risk(prediction: int, anomaly_score: float):
    if prediction == -1:
        return {
            "risk_level": "HIGH",
            "action": "BLOCK"
        }

    return {
        "risk_level": "LOW",
        "action": "ALLOW"
    }