import { useEffect, useState } from "react";
import { KeyRound, Save, Sparkles } from "lucide-react";
import { createAPIKey, updateRateLimit } from "../services/api";
import type { APIKey } from "../types";
import StatusBadge from "../components/StatusBadge";

export default function APIKeys() {
  const [name, setName] = useState("AdaptiveGuard Dashboard");
  const [rateLimit, setRateLimit] = useState(5);
  const [windowSize, setWindowSize] = useState(60);
  const [apiKey, setApiKey] = useState<APIKey | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("adaptiveguard_api_key");
    if (saved) setApiKey({
      key: saved,
      name: "Saved API Key",
      rateLimit: rateLimit,
      windowSize,
      isActive: true
    });
  }, []);

  async function handleCreate() {
    setSaving(true);
    setMessage("");

    try {
      const result = await createAPIKey(name, rateLimit, windowSize);
      const created = result.apiKey;

      if (!created?.key) {
        throw new Error(result.message || "API key was not returned.");
      }

      localStorage.setItem("adaptiveguard_api_key", created.key);
      setApiKey(created);
      setMessage("API key created and saved locally.");
    } catch (error: any) {
      setMessage(error?.response?.data?.message || error.message || "Failed to create API key.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate() {
    if (!apiKey?.key) {
      setMessage("Create or enter an API key first.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const result = await updateRateLimit(apiKey.key, rateLimit, windowSize);
      setApiKey((current) => current ? {
        ...current,
        rateLimit,
        windowSize,
        ...(result.data || {})
      } : current);
      setMessage("Rate limit updated.");
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Failed to update rate limit.");
    } finally {
      setSaving(false);
    }
  }

  function clearKey() {
    localStorage.removeItem("adaptiveguard_api_key");
    setApiKey(null);
    setMessage("Local API key removed.");
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">ACCESS CONTROL</span>
          <h2>API keys</h2>
          <p>Create a key for the dashboard and configure its traffic policy.</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="panel form-panel">
          <div className="panel-icon"><KeyRound size={20} /></div>
          <h2>Create API key</h2>
          <p className="form-help">The generated key is stored only in this browser for local development.</p>

          <label>
            Application name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <div className="input-row">
            <label>
              Requests
              <input type="number" min="1" value={rateLimit} onChange={(e) => setRateLimit(Number(e.target.value))} />
            </label>
            <label>
              Window (seconds)
              <input type="number" min="1" value={windowSize} onChange={(e) => setWindowSize(Number(e.target.value))} />
            </label>
          </div>

          <button className="button primary" onClick={handleCreate} disabled={saving}>
            <Sparkles size={16} />
            {saving ? "Creating..." : "Create API Key"}
          </button>

          {message && <div className="form-message">{message}</div>}
        </div>

        <div className="panel form-panel">
          <div className="panel-icon"><Save size={20} /></div>
          <h2>Current key</h2>
          <p className="form-help">This is used by the dashboard when calling protected traffic analysis endpoints.</p>

          {apiKey ? (
            <>
              <div className="secret-box">{apiKey.key}</div>
              <div className="key-meta">
                <div><span>Status</span><StatusBadge status={apiKey.isActive ? "ACTIVE" : "INACTIVE"} /></div>
                <div><span>Limit</span><strong>{apiKey.rateLimit} req</strong></div>
                <div><span>Window</span><strong>{apiKey.windowSize}s</strong></div>
              </div>

              <button className="button secondary" onClick={handleUpdate} disabled={saving}>
                <Save size={16} />
                Update Rate Limit
              </button>
              <button className="button danger-button" onClick={clearKey}>
                Remove Local Key
              </button>
            </>
          ) : (
            <div className="empty-state">No API key is configured in this browser.</div>
          )}
        </div>
      </div>
    </div>
  );
}