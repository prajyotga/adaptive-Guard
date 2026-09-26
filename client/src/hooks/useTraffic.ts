import { useCallback, useEffect, useState } from "react";
import {
  analyzeTraffic,
  getTraffic,
  getTrafficStats
} from "../services/api";
import type { AnalysisResult, TrafficLog, TrafficStats } from "../types";

export function useTraffic(refreshMs = 10000) {
  const [logs, setLogs] = useState<TrafficLog[]>([]);
  const [stats, setStats] = useState<TrafficStats | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setError("");
      const [trafficData, statsData] = await Promise.all([
        getTraffic(),
        getTrafficStats()
      ]);

      setLogs(trafficData);
      setStats(statsData);

      const apiKey = localStorage.getItem("adaptiveguard_api_key");
      if (apiKey) {
        try {
          setAnalysis(await analyzeTraffic());
        } catch {
          setAnalysis(null);
        }
      }
    } catch (err) {
      setError(
        "Unable to connect to the AdaptiveGuard backend. Make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = window.setInterval(refresh, refreshMs);
    return () => window.clearInterval(interval);
  }, [refresh, refreshMs]);

  return {
    logs,
    stats,
    analysis,
    loading,
    error,
    refresh
  };
}