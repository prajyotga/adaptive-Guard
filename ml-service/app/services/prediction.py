from app.models.anomaly_detector import AnomalyDetector


detector = AnomalyDetector()


def train_model():
    training_data = [
        [10, 120, 0.01, 5],
        [12, 110, 0.02, 6],
        [15, 130, 0.01, 7],
        [9, 100, 0.00, 4],
        [20, 150, 0.03, 8],
        [14, 125, 0.02, 6],
        [11, 115, 0.01, 5],
        [13, 140, 0.02, 7],
        [16, 135, 0.01, 8],
        [18, 145, 0.03, 9]
    ]

    detector.train(training_data)


def predict_anomaly(features: list[float]):
    if not detector.is_trained:
        train_model()

    return detector.predict(features)