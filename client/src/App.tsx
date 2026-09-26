import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Traffic from "./pages/Traffic";
import APIKeys from "./pages/APIKeys";
import Settings from "./pages/Settings";

import { checkBackend } from "./services/api";

import "./App.css";

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      const online = await checkBackend();
      setBackendOnline(online);
    };

    checkConnection();

    const interval = window.setInterval(
      checkConnection,
      10000
    );

    return () => window.clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <div className="app-shell">

        <div
          className={
            mobileOpen
              ? "sidebar-mobile open"
              : "sidebar-mobile"
          }
        >
          <Sidebar />
        </div>

        <div className="desktop-sidebar">
          <Sidebar />
        </div>

        <main className="main">

          <Navbar
            onMenu={() =>
              setMobileOpen((value) => !value)
            }
            backendOnline={backendOnline}
          />

          <Routes>
            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/traffic"
              element={<Traffic />}
            />

            <Route
              path="/api-keys"
              element={<APIKeys />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />
          </Routes>

        </main>
      </div>
    </BrowserRouter>
  );
}