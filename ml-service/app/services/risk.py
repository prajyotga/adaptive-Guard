def calculate_risk(
    prediction: int,
    anomaly_score: float,
    features: list[float]
):
    requests_per_minute = features[0]
    average_response_time = features[1]
    error_rate = features[2]
    unique_ip_count = features[3]

    risk_score = 0

    # High request rate
    if requests_per_minute > 100:
        risk_score += 40
    elif requests_per_minute > 50:
        risk_score += 20

    # High response time
    if average_response_time > 500:
        risk_score += 30
    elif average_response_time > 200:
        risk_score += 15

    # High error rate
    if error_rate > 0.5:
        risk_score += 30
    elif error_rate > 0.1:
        risk_score += 15

    # Very low IP diversity
    if requests_per_minute > 50 and unique_ip_count <= 2:
        risk_score += 20

    # Isolation Forest anomaly signal
    if prediction == -1:
        risk_score += 10

    if risk_score >= 50:
        return {
            "risk_level": "HIGH",
            "action": "BLOCK",
            "risk_score": risk_score
        }

    if risk_score >= 20:
        return {
            "risk_level": "MEDIUM",
            "action": "THROTTLE",
            "risk_score": risk_score
        }

    return {
        "risk_level": "LOW",
        "action": "ALLOW",
        "risk_score": risk_score
    }