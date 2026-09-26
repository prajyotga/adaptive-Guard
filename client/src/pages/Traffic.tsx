import { Activity, Clock3, Server, TrendingUp } from "lucide-react";
import StatCard from "../components/StatCard";
import TrafficChart from "../components/TrafficChart";
import RecentRequests from "../components/RecentRequests";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import { useTraffic } from "../hooks/useTraffic";

export default function Traffic() {
  const { logs, stats, loading, error, refresh } = useTraffic();

  if (loading && !stats) return <LoadingSpinner />;
  if (error && !stats) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">TRAFFIC</span>
          <h2>Traffic analytics</h2>
          <p>Understand how requests are flowing through AdaptiveGuard.</p>
        </div>
      </div>

      <section className="stats-grid">
        <StatCard title="Requests" value={stats?.totalRequests ?? 0} icon={Activity} />
        <StatCard title="Successful" value={stats?.successfulRequests ?? 0} icon={TrendingUp} />
        <StatCard title="Avg Response" value={`${(stats?.averageResponseTime ?? 0).toFixed(1)} ms`} icon={Clock3} />
        <StatCard title="Top Endpoints" value={stats?.topEndpoints?.length ?? 0} icon={Server} />
      </section>

      <TrafficChart stats={stats!} />

      <div className="panel endpoint-panel">
        <div className="section-heading">
          <div>
            <h2>Top endpoints</h2>
            <p>Most frequently observed API routes</p>
          </div>
        </div>
        <div className="endpoint-list">
          {(stats?.topEndpoints ?? []).map((item) => (
            <div className="endpoint-row" key={item._id}>
              <span>{item._id}</span>
              <strong>{item.requests}</strong>
            </div>
          ))}
        </div>
      </div>

      <RecentRequests logs={logs} />
    </div>
  );
}