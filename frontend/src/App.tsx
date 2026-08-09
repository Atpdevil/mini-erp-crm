import { useState } from "react";
import Dashboard from "./dashboard";
import Customers from "./Customers";
import Leads from "./Leads";
import Products from "./Products";
import Orders from "./Orders";

type Page = "dashboard" | "customers" | "leads" | "products" | "orders";

const NAV_ITEMS: { key: Page; label: string; icon: string }[] = [
  { key: "dashboard", label: "Dashboard",  icon: "📊" },
  { key: "customers", label: "Customers",  icon: "👥" },
  { key: "leads",     label: "Leads",      icon: "🎯" },
  { key: "products",  label: "Products",   icon: "📦" },
  { key: "orders",    label: "Orders",     icon: "🛒" },
];

function App() {
  const [page, setPage] = useState<Page>("dashboard");

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: "240px",
        minWidth: "240px",
        background: "rgba(15,23,42,0.95)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(16px)",
        position: "sticky",
        top: 0,
        height: "100vh",
        zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}>
          <div style={{
            width: "36px", height: "36px",
            background: "var(--grad-primary)",
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px",
            flexShrink: 0,
          }}>⚡</div>
          <div>
            <div style={{ fontWeight: "700", fontSize: "14px", color: "var(--text-primary)" }}>
              Mini ERP CRM
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Business Suite</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          <div style={{ fontSize: "10.5px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", padding: "0 8px", marginBottom: "8px" }}>
            Main Menu
          </div>
          {NAV_ITEMS.map(({ key, label, icon }) => {
            const active = page === key;
            return (
              <button
                key={key}
                onClick={() => setPage(key)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  marginBottom: "4px",
                  fontFamily: "var(--font)",
                  fontSize: "13.5px",
                  fontWeight: active ? "600" : "500",
                  transition: "var(--transition)",
                  background: active
                    ? "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.12))"
                    : "transparent",
                  color: active ? "var(--primary-light)" : "var(--text-secondary)",
                  borderLeft: active ? "2px solid var(--primary)" : "2px solid transparent",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: "16px" }}>{icon}</span>
                {label}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div style={{
          padding: "16px 12px",
          borderTop: "1px solid var(--border)",
        }}>
          {user && (
            <div style={{
              padding: "10px 12px",
              borderRadius: "10px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              marginBottom: "8px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "32px", height: "32px",
                  background: "var(--grad-primary)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", fontWeight: "700", color: "#fff",
                  flexShrink: 0,
                }}>
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{user.role}</div>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontFamily: "var(--font)",
              fontSize: "13px",
              fontWeight: "500",
              transition: "var(--transition)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.08)";
              e.currentTarget.style.color = "#f87171";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-muted)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, overflow: "auto", minHeight: "100vh" }}>
        {page === "dashboard" && <Dashboard />}
        {page === "customers" && <Customers />}
        {page === "leads"     && <Leads />}
        {page === "products"  && <Products />}
        {page === "orders"    && <Orders />}
      </main>
    </div>
  );
}

export default App;