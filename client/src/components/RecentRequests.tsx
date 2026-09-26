import type { TrafficLog } from "../types";
import StatusBadge from "./StatusBadge";

export default function RecentRequests({ logs }: { logs: TrafficLog[] }) {
  return (
    <div className="panel">
      <div className="section-heading">
        <div>
          <h2>Recent requests</h2>
          <p>Latest traffic observed by the gateway</p>
        </div>
        <span className="count-pill">{logs.length}</span>
      </div>

      {logs.length === 0 ? (
        <div className="empty-state">No request logs available.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Status</th>
                <th>Response</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 15).map((log, index) => (
                <tr key={log._id || `${log.timestamp}-${index}`}>
                  <td>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td>
                    <span className="method">{log.method}</span>
                  </td>
                  <td className="endpoint">{log.endpoint}</td>
                  <td>
                    <StatusBadge status={log.statusCode} />
                  </td>
                  <td>{Math.round(log.responseTime)} ms</td>
                  <td className="muted">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}