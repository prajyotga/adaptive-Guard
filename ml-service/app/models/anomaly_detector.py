from sklearn.ensemble import IsolationForest
import numpy as np


class AnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(
            contamination=0.1,
            random_state=42
        )

        self.is_trained = False

    def train(self, traffic_data: list[list[float]]):
        data = np.array(traffic_data)

        self.model.fit(data)
        self.is_trained = True

    def predict(self, traffic_features: list[float]):
        if not self.is_trained:
            raise RuntimeError("Model has not been trained yet")

        data = np.array([traffic_features])

        prediction = self.model.predict(data)[0]
        score = self.model.decision_function(data)[0]

        return {
            "prediction": int(prediction),
            "anomaly_score": float(score),
            "is_anomaly": bool(prediction == -1)
        }