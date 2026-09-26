import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import type { TrafficStats } from "../types";

interface Props {
  stats: TrafficStats;
}

export default function TrafficChart({ stats }: Props) {
  const raw = stats.requestsPerMinute ?? [];

  const data = raw.map((item, index) => {
    const mongoId = item._id;

    let label = `${index + 1}m`;

    if (mongoId && typeof mongoId === "object") {
      const hour =
        "hour" in mongoId
          ? String(mongoId.hour).padStart(2, "0")
          : "";

      const minute =
        "minute" in mongoId
          ? String(mongoId.minute).padStart(2, "0")
          : "";

      if (hour && minute) {
        label = `${hour}:${minute}`;
      }
    }

    return {
      name: label,
      requests: Number(item.requests) || 0
    };
  });

  return (
    <div className="chart-card">
      <div className="section-heading">
        <div>
          <h2>Requests per minute</h2>
          <p>Recent API traffic volume</p>
        </div>

        <span className="live-pill">LIVE</span>
      </div>

      <div className="chart">
        {data.length === 0 ? (
          <div className="empty-state">
            No traffic data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0
              }}
            >
              <defs>
                <linearGradient
                  id="trafficFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#6ee7b7"
                    stopOpacity={0.28}
                  />

                  <stop
                    offset="100%"
                    stopColor="#6ee7b7"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#1e293b"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                stroke="#64748b"
                tick={{
                  fill: "#64748b",
                  fontSize: 10
                }}
                tickLine={false}
                axisLine={{
                  stroke: "#334155"
                }}
              />

              <YAxis
                allowDecimals={false}
                stroke="#64748b"
                tick={{
                  fill: "#64748b",
                  fontSize: 10
                }}
                tickLine={false}
                axisLine={{
                  stroke: "#334155"
                }}
              />

              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #243244",
                  borderRadius: 10,
                  color: "#e2e8f0"
                }}
                formatter={(value) => [
                  `${value} requests`,
                  "Traffic"
                ]}
              />

              <Area
                type="monotone"
                dataKey="requests"
                stroke="#6ee7b7"
                strokeWidth={2}
                fill="url(#trafficFill)"
                dot={false}
                activeDot={{
                  r: 4
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}