from fastapi import FastAPI
from app.schemas.traffic import TrafficFeatures
from app.services.prediction import predict_anomaly


app = FastAPI(
    title="AdaptiveGuard ML Service",
    description="AI-powered traffic anomaly detection service",
    version="1.0.0"
)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "adaptiveguard-ml"
    }


@app.post("/predict")
def predict(features: TrafficFeatures):
    traffic_values = [
        features.requests_per_minute,
        features.average_response_time,
        features.error_rate,
        features.unique_ip_count
    ]

    result = predict_anomaly(traffic_values)

    return {
        "success": True,
        "data": result
    }