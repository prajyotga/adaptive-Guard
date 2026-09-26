import {
  Activity,
  CheckCircle2,
  Clock3,
  ServerCrash,
  ShieldCheck
} from "lucide-react";
import StatCard from "../components/StatCard";
import TrafficChart from "../components/TrafficChart";
import RecentRequests from "../components/RecentRequests";
import AdaptiveDecision from "../components/AdaptiveDecision";
import RiskCard from "../components/RiskCard";
import RateLimitCard from "../components/RateLimitCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import { useTraffic } from "../hooks/useTraffic";

export default function Dashboard() {
  const { logs, stats, analysis, loading, error, refresh } = useTraffic();

  if (loading && !stats) return <LoadingSpinner />;

  if (error && !stats) {
    return <ErrorState message={error} onRetry={refresh} />;
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h2>Protection at a glance</h2>
          <p>Real-time visibility into your API traffic and adaptive security.</p>
        </div>
        <div className="refresh-state">
          <Activity size={14} />
          Auto-refreshing
        </div>
      </div>

      {error && <div className="inline-warning">{error}</div>}

      <section className="stats-grid">
        <StatCard title="Total Requests" value={stats?.totalRequests ?? 0} subtitle="Observed traffic" icon={Activity} />
        <StatCard title="Successful" value={stats?.successfulRequests ?? 0} subtitle="2xx responses" icon={CheckCircle2} />
        <StatCard title="Client Errors" value={stats?.clientErrors ?? 0} subtitle="4xx responses" icon={ServerCrash} />
        <StatCard title="Server Errors" value={stats?.serverErrors ?? 0} subtitle="5xx responses" icon={ServerCrash} />
        <StatCard title="Avg Response" value={`${(stats?.averageResponseTime ?? 0).toFixed(1)} ms`} subtitle="Gateway latency" icon={Clock3} />
      </section>

      <div className="two-column">
        <TrafficChart stats={stats!} />
        <AdaptiveDecision analysis={analysis} />
      </div>

      <div className="two-column">
        <RiskCard analysis={analysis} />
        <RateLimitCard analysis={analysis} stats={stats} />
      </div>

      <RecentRequests logs={logs} />
    </div>
  );
}