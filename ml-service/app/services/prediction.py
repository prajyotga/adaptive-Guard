import numpy as np

from app.models.anomaly_detector import AnomalyDetector
from app.services.risk import calculate_risk


detector = AnomalyDetector()


def train_model():
    np.random.seed(42)

    training_data = []

    # Generate normal traffic patterns
    for _ in range(2000):

        requests_per_minute = np.random.uniform(1, 50)

        average_response_time = np.random.uniform(5, 100)

        error_rate = np.random.uniform(0.0, 0.05)

        unique_ip_count = np.random.randint(1, 21)

        training_data.append([
            requests_per_minute,
            average_response_time,
            error_rate,
            unique_ip_count
        ])

    detector.train(training_data)

    print(
        f"Isolation Forest trained with "
        f"{len(training_data)} normal traffic records"
    )


def predict_anomaly(features: list[float]):

    if not detector.is_trained:
        train_model()

    result = detector.predict(features)

    risk = calculate_risk(
        result["prediction"],
        result["anomaly_score"],
        features

    )

    return {
        **result,
        **risk
    }