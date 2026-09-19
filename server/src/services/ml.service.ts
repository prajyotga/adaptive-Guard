import axios from "axios";

const ML_SERVICE_URL = "http://localhost:8000";

interface TrafficFeatures {
    requests_per_minute: number;
    average_response_time: number;
    error_rate: number;
    unique_ip_count: number;
}

interface MLResponse {
    success: boolean;
    data: {
        prediction: number;
        anomaly_score: number;
        is_anomaly: boolean;
        risk_level: string;
        action: string;
    };
}

export const analyzeTraffic = async (
    features: TrafficFeatures
): Promise<MLResponse> => {

    const response = await axios.post<MLResponse>(
        `${ML_SERVICE_URL}/predict`,
        features
    );

    return response.data;
};