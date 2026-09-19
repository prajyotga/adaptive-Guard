import numpy as np

from app.models.anomaly_detector import AnomalyDetector
from app.services.risk import calculate_risk

detector = AnomalyDetector()


def train_model():
    np.random.seed(42)

    training_data = []

    for _ in range(200):
        requests_per_minute = np.random.randint(5, 31)

        average_response_time = np.random.randint(80, 251)

        error_rate = round(
            np.random.uniform(0.00, 0.08),
            3
        )

        unique_ip_count = np.random.randint(3, 51)

        training_data.append([
            requests_per_minute,
            average_response_time,
            error_rate,
            unique_ip_count
        ])

    detector.train(training_data)

    print("Isolation Forest trained with 200 normal traffic records")


def predict_anomaly(features: list[float]):
    if not detector.is_trained:
        train_model()

    result = detector.predict(features)

    risk = calculate_risk(
        result["prediction"],
        result["anomaly_score"]
    )

    return {
        **result,
        **risk
    }