import { BrainCircuit, TriangleAlert } from "lucide-react";
import type { AnalysisResult } from "../types";

export default function RiskCard({ analysis }: { analysis: AnalysisResult | null }) {
  const result = analysis?.mlResult?.data;

  return (
    <div className="panel risk-panel">
      <div className="panel-icon">
        <BrainCircuit size={20} />
      </div>
      <div className="section-heading compact">
        <div>
          <h2>AI traffic analysis</h2>
          <p>Isolation Forest + risk engine</p>
        </div>
      </div>

      <div className="risk-grid">
        <div>
          <span>Requests/min</span>
          <strong>{analysis?.features.requests_per_minute ?? "—"}</strong>
        </div>
        <div>
          <span>Avg response</span>
          <strong>
            {analysis ? `${analysis.features.average_response_time.toFixed(1)} ms` : "—"}
          </strong>
        </div>
        <div>
          <span>Error rate</span>
          <strong>
            {analysis ? `${(analysis.features.error_rate * 100).toFixed(1)}%` : "—"}
          </strong>
        </div>
        <div>
          <span>Unique IPs</span>
          <strong>{analysis?.features.unique_ip_count ?? "—"}</strong>
        </div>
      </div>

      {result?.is_anomaly && (
        <div className="anomaly-note">
          <TriangleAlert size={16} />
          Anomalous traffic signal detected by the ML model.
        </div>
      )}
    </div>
  );
}