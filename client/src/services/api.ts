import axios from "axios";
import type {
  AnalysisResult,
  APIKeyResponse,
  TrafficLog,
  TrafficStats
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem("adaptiveguard_api_key");

  if (apiKey) {
    config.headers["x-api-key"] = apiKey;
  }

  return config;
});

export async function getTraffic(): Promise<TrafficLog[]> {
  const response = await api.get("/api/traffic");
  const body = response.data;

  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.logs)) return body.logs;
  return [];
}

export async function getTrafficStats(): Promise<TrafficStats> {
  const response = await api.get("/api/traffic/stats");
  const body = response.data;
  return (body?.data ?? body) as TrafficStats;
}

export async function analyzeTraffic(): Promise<AnalysisResult> {
  const response = await api.get("/api/traffic/analyze");
  const body = response.data;
  return (body?.data ?? body) as AnalysisResult;
}

export async function createAPIKey(
  name: string,
  rateLimit?: number,
  windowSize?: number
): Promise<APIKeyResponse> {
  const response = await api.post("/api/keys", {
    name,
    ...(rateLimit !== undefined ? { rateLimit } : {}),
    ...(windowSize !== undefined ? { windowSize } : {})
  });

  return response.data as APIKeyResponse;
}

export async function updateRateLimit(
  key: string,
  rateLimit: number,
  windowSize: number
): Promise<APIKeyResponse> {
  const response = await api.patch(
    `/api/keys/${encodeURIComponent(key)}/rate-limit`,
    {
      rateLimit,
      windowSize
    }
  );

  return response.data as APIKeyResponse;
}

export async function checkBackend(): Promise<boolean> {
  try {
    const response = await api.get("/health", {
      timeout: 3000
    });

    return response.data?.status === "healthy";
  } catch {
    return false;
  }
}

export async function checkMLService(): Promise<boolean> {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_ML_BASE_URL || "http://localhost:8000"}/health`,
      { timeout: 3000 }
    );
    return response.data?.status === "healthy";
  } catch {
    return false;
  }
}