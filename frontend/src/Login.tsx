import { useState } from "react";

const API_URL = "https://mini-erp-crm-izul.onrender.com";

type Mode = "login" | "register";

interface ToastMsg { type: "success" | "error"; text: string; }

export default function Login() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastMsg | null>(null);

  const showToast = (type: ToastMsg["type"], text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body =
        mode === "login"
          ? { email, password }
          : { name, email, password, role };

      const res = await fetch(`${API_URL}/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.message || "Something went wrong");
        return;
      }
      if (mode === "login") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.reload();
      } else {
        showToast("success", "Account created! Please log in.");
        setMode("login");
        setName("");
        setPassword("");
        setRole("EMPLOYEE");
      }
    } catch {
      showToast("error", "Cannot reach server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "var(--bg-base)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background blobs */}
      <div style={{
        position: "absolute", top: "-20%", left: "-10%",
        width: "600px", height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-20%", right: "-10%",
        width: "500px", height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Left panel */}
      <div style={{
        display: "none",
        flex: 1,
        background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #1e1b4b 100%)",
        borderRight: "1px solid var(--border)",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px",
        position: "relative",
        overflow: "hidden",
      }} className="left-panel">
        {/* decorative */}
        <div style={{
          position: "absolute", top: "30%", right: "-80px",
          width: "300px", height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px",
          }}>
            <div style={{
              width: "44px", height: "44px",
              background: "var(--grad-primary)",
              borderRadius: "12px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px",
            }}>⚡</div>
            <span style={{ fontSize: "22px", fontWeight: "700", color: "var(--text-primary)" }}>
              Mini ERP CRM
            </span>
          </div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", lineHeight: 1.2, marginBottom: "20px" }}>
            Run your business,<br />
            <span style={{ background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              smarter.
            </span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: "1.7", maxWidth: "380px" }}>
            Track customers, manage leads, monitor inventory, and process orders — all from one unified workspace.
          </p>
          <div style={{ marginTop: "48px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {["Customers & Lead tracking", "Inventory & Product management", "Order processing & Dashboard"].map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "24px", height: "24px",
                  background: "rgba(99,102,241,0.2)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", color: "var(--primary-light)",
                }}>✓</div>
                <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "440px",
        }}>
          {/* Logo on small screen */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            marginBottom: "40px", justifyContent: "center",
          }}>
            <div style={{
              width: "40px", height: "40px",
              background: "var(--grad-primary)",
              borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px",
            }}>⚡</div>
            <span style={{ fontSize: "20px", fontWeight: "700" }}>Mini ERP CRM</span>
          </div>

          {/* Card */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border)",
            borderRadius: "24px",
            padding: "40px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 48px rgba(0,0,0,0.4)",
          }}>
            {/* Tabs */}
            <div style={{
              display: "flex",
              background: "rgba(255,255,255,0.04)",
              borderRadius: "10px",
              padding: "4px",
              marginBottom: "32px",
            }}>
              {(["login", "register"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontFamily: "var(--font)",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "var(--transition)",
                    background: mode === m ? "var(--grad-primary)" : "transparent",
                    color: mode === m ? "#fff" : "var(--text-muted)",
                    boxShadow: mode === m ? "0 4px 12px rgba(99,102,241,0.3)" : "none",
                  }}
                >
                  {m === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h2 style={{ textAlign: "center", fontSize: "1.25rem", marginBottom: "4px" }}>
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p style={{ textAlign: "center", fontSize: "13px", marginTop: "-8px", color: "var(--text-muted)" }}>
                {mode === "login" ? "Sign in to your workspace" : "Get started in seconds"}
              </p>

              {mode === "register" && (
                <>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="EMPLOYEE">👤 Employee</option>
                      <option value="MANAGER">🧑‍💼 Manager</option>
                      <option value="ADMIN">🛡 Admin</option>
                    </select>
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
                style={{ justifyContent: "center", padding: "12px", fontSize: "15px" }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: "16px", height: "16px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                      display: "inline-block",
                    }} />
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  mode === "login" ? "Sign In" : "Create Account"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            <span>{toast.type === "success" ? "✓" : "✕"}</span>
            {toast.text}
          </div>
        </div>
      )}
    </div>
  );
}
