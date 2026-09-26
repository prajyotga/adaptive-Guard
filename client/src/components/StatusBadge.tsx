interface StatusBadgeProps {
  status: string | number;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const value = String(status).toUpperCase();

  let className = "status neutral";
  if (value === "ALLOW" || value.startsWith("2")) className = "status success";
  if (value === "THROTTLE" || value === "429" || value.startsWith("4")) className = "status warning";
  if (value === "BLOCK" || value.startsWith("5") || value === "403") className = "status danger";

  return <span className={className}>{value}</span>;
}