import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

type DashboardData = {
  customers: number;
  leads: number;
  products: number;
  orders: number;
  pendingOrders: number;
  totalSales: number;
};

const STAT_CARDS = [
  {
    key: "customers" as keyof DashboardData,
    label: "Total Customers",
    icon: "👥",
    color: "#6366f1",
    glow: "rgba(99,102,241,0.2)",
    format: (v: number) => v.toString(),
  },
  {
    key: "leads" as keyof DashboardData,
    label: "Active Leads",
    icon: "🎯",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.2)",
    format: (v: number) => v.toString(),
  },
  {
    key: "products" as keyof DashboardData,
    label: "Products",
    icon: "📦",
    color: "#14b8a6",
    glow: "rgba(20,184,166,0.2)",
    format: (v: number) => v.toString(),
  },
  {
    key: "orders" as keyof DashboardData,
    label: "Total Orders",
    icon: "🛒",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.2)",
    format: (v: number) => v.toString(),
  },
  {
    key: "pendingOrders" as keyof DashboardData,
    label: "Pending Orders",
    icon: "⏳",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.2)",
    format: (v: number) => v.toString(),
  },
  {
    key: "totalSales" as keyof DashboardData,
    label: "Total Revenue",
    icon: "💰",
    color: "#10b981",
    glow: "rgba(16,185,129,0.2)",
    format: (v: number) => `₹${v.toLocaleString("en-IN")}`,
  },
];

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { window.location.reload(); return; }

        const res = await fetch(`${API_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) { setError(data.message || "Failed to load dashboard"); return; }
        setDashboard(data.dashboard);
      } catch {
        setError("Unable to connect to backend");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <span>Loading dashboard…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-state" style={{ color: "var(--danger)" }}>
        <span style={{ fontSize: "2rem" }}>⚠️</span>
        <span>{error}</span>
      </div>
    );
  }

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <span style={{ fontSize: "28px" }}>👋</span>
          <h1 style={{ fontSize: "1.75rem" }}>
            {greeting}{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
          </h1>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "20px",
        marginBottom: "40px",
      }}>
        {STAT_CARDS.map((card) => {
          const value = dashboard?.[card.key] ?? 0;
          return (
            <div
              key={card.key}
              className="card"
              style={{
                padding: "24px",
                position: "relative",
                overflow: "hidden",
                animation: "countUp 0.4s ease forwards",
              }}
            >
              {/* Glow */}
              <div style={{
                position: "absolute", top: "-20px", right: "-20px",
                width: "100px", height: "100px",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${card.glow} 0%, transparent 70%)`,
                pointerEvents: "none",
              }} />
              {/* Icon */}
              <div style={{
                width: "46px", height: "46px",
                borderRadius: "12px",
                background: `${card.color}20`,
                border: `1px solid ${card.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px",
                marginBottom: "16px",
              }}>
                {card.icon}
              </div>
              {/* Value */}
              <div style={{
                fontSize: card.key === "totalSales" ? "1.5rem" : "2rem",
                fontWeight: "800",
                color: card.color,
                marginBottom: "4px",
                lineHeight: 1,
              }}>
                {card.format(value)}
              </div>
              {/* Label */}
              <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "500" }}>
                {card.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Banner */}
      <div style={{
        padding: "24px 28px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))",
        border: "1px solid rgba(99,102,241,0.2)",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
      }}>
        <div style={{ fontSize: "32px" }}>🚀</div>
        <div>
          <div style={{ fontWeight: "600", color: "var(--text-primary)", marginBottom: "4px" }}>
            Business at a Glance
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "13.5px" }}>
            You have <strong style={{ color: "var(--primary-light)" }}>{dashboard?.pendingOrders ?? 0}</strong> pending orders and{" "}
            <strong style={{ color: "var(--primary-light)" }}>{dashboard?.leads ?? 0}</strong> active leads.{" "}
            Total revenue is{" "}
            <strong style={{ color: "#34d399" }}>₹{(dashboard?.totalSales ?? 0).toLocaleString("en-IN")}</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}