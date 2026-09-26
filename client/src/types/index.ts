export type AdaptiveAction = "ALLOW" | "THROTTLE" | "BLOCK";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface TrafficLog {
  _id?: string;
  apiKey?: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  ip: string;
  timestamp: string;
}

export interface TrafficStats {
  totalRequests: number;
  successfulRequests: number;
  clientErrors: number;
  serverErrors: number;
  averageResponseTime: number;
  topEndpoints: Array<{
    _id: string;
    requests: number;
  }>;
 requestsPerMinute: Array<{
  _id?: string | {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
  };
  minute?: string;
  requests: number;
}>;
}

export interface TrafficFeatures {
  requests_per_minute: number;
  average_response_time: number;
  error_rate: number;
  unique_ip_count: number;
}

export interface MLResult {
  prediction: number;
  anomaly_score: number;
  is_anomaly: boolean;
  risk_level: RiskLevel | string;
  action: AdaptiveAction | string;
  risk_score?: number;
}

export interface AnalysisResult {
  features: TrafficFeatures;
  mlResult: {
    success: boolean;
    data: MLResult;
  } | null;
}

export interface APIKey {
  id?: string;
  _id?: string;
  key: string;
  name: string;
  rateLimit: number;
  windowSize: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface APIKeyResponse {
  success: boolean;
  message?: string;
  apiKey?: APIKey;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}