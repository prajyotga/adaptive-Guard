import { Bell, CircleDot, Menu } from "lucide-react";

interface NavbarProps {
  onMenu?: () => void;
  backendOnline?: boolean;
}

export default function Navbar({ onMenu, backendOnline }: NavbarProps) {
  return (
    <header className="navbar">
      <button className="mobile-menu" onClick={onMenu} aria-label="Open menu">
        <Menu size={20} />
      </button>

      <div>
        <h1>API Protection Dashboard</h1>
        <p>Monitor traffic, anomalies and adaptive decisions.</p>
      </div>

      <div className="navbar-actions">
        <div className={`connection ${backendOnline ? "online" : "offline"}`}>
          <CircleDot size={13} />
          {backendOnline ? "System Operational" : "Backend Offline"}
        </div>
        <button className="icon-button" aria-label="Notifications">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}