import {
  Activity,
  Gauge,
  KeyRound,
  LayoutDashboard,
  Settings,
  ShieldCheck
} from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/traffic", label: "Traffic", icon: Activity },
  { to: "/api-keys", label: "API Keys", icon: KeyRound },
  { to: "/settings", label: "Settings", icon: Settings }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <ShieldCheck size={22} />
        </div>
        <div>
          <strong>AdaptiveGuard</strong>
          <span>API Protection</span>
        </div>
      </div>

      <div className="nav-label">MONITORING</div>

      <nav className="nav-list">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <Gauge size={17} />
        <div>
          <span>Adaptive Engine</span>
          <strong>Active</strong>
        </div>
      </div>
    </aside>
  );
}