import { Gauge } from "lucide-react";
import type { AnalysisResult, TrafficStats } from "../types";

interface Props {
  analysis: AnalysisResult | null;
  stats: TrafficStats | null;
}

export default function RateLimitCard({ analysis }: Props) {
  const action = analysis?.mlResult?.data.action;
  const key = localStorage.getItem("adaptiveguard_api_key");

  const limit =
    action === "THROTTLE"
      ? "Reduced"
      : action === "BLOCK"
        ? "Blocked"
        : "Configured";

  return (
    <div className="panel rate-card">
      <div className="panel-icon">
        <Gauge size={20} />
      </div>
      <span className="eyebrow">RATE LIMIT</span>
      <h2>{limit}</h2>
      <p>
        {key
          ? "Adaptive policy is being evaluated for the configured API key."
          : "Add an API key to view adaptive rate-limit information."}
      </p>
      <div className="mini-status">
        <span>Policy</span>
        <strong>{action || "Waiting"}</strong>
      </div>
    </div>
  );
}