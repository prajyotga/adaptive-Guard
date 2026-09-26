import { useEffect, useState } from "react";
import { CheckCircle2, Server, BrainCircuit } from "lucide-react";
import { checkBackend, checkMLService } from "../services/api";

export default function Settings() {
  const [backend, setBackend] = useState<boolean | null>(null);
  const [ml, setMl] = useState<boolean | null>(null);

  async function check() {
    setBackend(await checkBackend());
    setMl(await checkMLService());
  }

  useEffect(() => {
    check();
  }, []);

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">SYSTEM</span>
          <h2>Settings</h2>
          <p>Connection and environment information for AdaptiveGuard.</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="panel system-card">
          <Server size={21} />
          <div>
            <span>Node / Express backend</span>
            <strong>
              {backend === null ? "Checking..." : backend ? "Connected" : "Offline"}
            </strong>
          </div>
          <CheckCircle2 className={backend ? "icon-online" : "icon-offline"} size={19} />
        </div>

        <div className="panel system-card">
          <BrainCircuit size={21} />
          <div>
            <span>Python ML service</span>
            <strong>
              {ml === null ? "Checking..." : ml ? "Healthy" : "Offline"}
            </strong>
          </div>
          <CheckCircle2 className={ml ? "icon-online" : "icon-offline"} size={19} />
        </div>
      </div>

      <div className="panel">
        <div className="section-heading">
          <div>
            <h2>Environment</h2>
            <p>Current frontend configuration</p>
          </div>
        </div>

        <div className="settings-list">
          <div><span>Backend URL</span><code>{import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}</code></div>
          <div><span>ML URL</span><code>{import.meta.env.VITE_ML_BASE_URL || "http://localhost:8000"}</code></div>
          <div><span>Frontend</span><code>Vite + React + TypeScript</code></div>
        </div>

        <button className="button secondary" onClick={check}>
          Re-check connections
        </button>
      </div>
    </div>
  );
}