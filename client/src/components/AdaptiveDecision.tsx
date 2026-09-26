import { ShieldAlert, ShieldCheck, ShieldOff } from "lucide-react";
import type { AnalysisResult } from "../types";

interface Props {
  analysis: AnalysisResult | null;
}

export default function AdaptiveDecision({ analysis }: Props) {
  const result = analysis?.mlResult?.data;
  const action = result?.action || "NO DECISION";

  const config =
    action === "BLOCK"
      ? { icon: ShieldOff, className: "danger", label: "BLOCK" }
      : action === "THROTTLE"
        ? { icon: ShieldAlert, className: "warning", label: "THROTTLE" }
        : { icon: ShieldCheck, className: "success", label: action === "ALLOW" ? "ALLOW" : "NO DECISION" };

  const Icon = config.icon;

  return (
    <div className={`decision-card ${config.className}`}>
      <div className="decision-top">
        <div>
          <span className="eyebrow">ADAPTIVE DECISION</span>
          <h2>{config.label}</h2>
        </div>
        <div className="decision-icon">
          <Icon size={27} />
        </div>
      </div>

      <p>
        {result
          ? `Traffic analysis currently maps to a ${result.risk_level} risk response.`
          : "Enter an API key to run adaptive traffic analysis."}
      </p>

      <div className="decision-meta">
        <div>
          <span>Risk</span>
          <strong>{result?.risk_level || "—"}</strong>
        </div>
        <div>
          <span>Anomaly</span>
          <strong>
            {result ? (result.is_anomaly ? "Detected" : "Normal") : "—"}
          </strong>
        </div>
        <div>
          <span>Score</span>
          <strong>
            {result?.risk_score ?? "—"}
          </strong>
        </div>
      </div>
    </div>
  );
}