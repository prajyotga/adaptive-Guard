from pydantic import BaseModel


class TrafficFeatures(BaseModel):
    requests_per_minute: float
    average_response_time: float
    error_rate: float
    unique_ip_count: float