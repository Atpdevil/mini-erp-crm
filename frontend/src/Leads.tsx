import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "WON";

type Lead = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  source: string | null;
  status: LeadStatus;
  notes: string | null;
};

type FormData = Omit<Lead, "id">;

const EMPTY: FormData = { name: "", email: "", phone: "", company: "", source: "", status: "NEW", notes: "" };

const STATUS_BADGE: Record<LeadStatus, string> = {
  NEW:       "badge-blue",
  CONTACTED: "badge-orange",
  QUALIFIED: "badge-purple",
  WON:       "badge-green",
  LOST:      "badge-red",
};

const STATUS_ICON: Record<LeadStatus, string> = {
  NEW: "🔵", CONTACTED: "🟠", QUALIFIED: "🟣", WON: "🟢", LOST: "🔴",
};

type Toast = { type: "success" | "error"; text: string };

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");

  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const token = localStorage.getItem("token")!;

  const showToast = (type: Toast["type"], text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setLeads(data.leads || []);
    } catch {
      showToast("error", "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal("add"); };
  const openEdit = (l: Lead) => {
    setSelected(l);
    setForm({ name: l.name, email: l.email ?? "", phone: l.phone ?? "", company: l.company ?? "", source: l.source ?? "", status: l.status, notes: l.notes ?? "" });
    setModal("edit");
  };
  const openDelete = (l: Lead) => { setSelected(l); setModal("delete"); };
  const closeModal = () => { setModal(null); setSelected(null); setForm(EMPTY); };

  const handleSave = async () => {
    if (!form.name.trim()) { showToast("error", "Lead name is required"); return; }
    setSaving(true);
    try {
      const isEdit = modal === "edit";
      const url = isEdit ? `${API_URL}/api/leads/${selected!.id}` : `${API_URL}/api/leads`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.message || "Failed to save"); return; }
      showToast("success", isEdit ? "Lead updated!" : "Lead added!");
      closeModal();
      fetchLeads();
    } catch {
      showToast("error", "Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/leads/${selected.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast("success", "Lead deleted");
        closeModal();
        fetchLeads();
      } else {
        const data = await res.json();
        showToast("error", data.message || "Failed to delete");
      }
    } catch {
      showToast("error", "Network error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = leads.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      (l.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (l.company ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Leads</h1>
          <p style={{ marginTop: "4px", fontSize: "13.5px" }}>{leads.length} total leads</p>
        </div>
        <div className="flex gap-3 items-center" style={{ flexWrap: "wrap" }}>
          <div className="search-bar">
            <span style={{ color: "var(--text-muted)" }}>🔍</span>
            <input placeholder="Search leads…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select
            className="form-select"
            style={{ width: "auto", padding: "10px 14px" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "ALL")}
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="WON">Won</option>
            <option value="LOST">Lost</option>
          </select>
          <button className="btn btn-primary" onClick={openAdd}>＋ Add Lead</button>
        </div>
      </div>

      {/* Status pills summary */}
      <div className="flex gap-2" style={{ marginBottom: "24px", flexWrap: "wrap" }}>
        {(["ALL", "NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"] as const).map((s) => {
          const count = s === "ALL" ? leads.length : leads.filter((l) => l.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: "5px 14px",
                borderRadius: "999px",
                border: `1px solid ${statusFilter === s ? "rgba(99,102,241,0.5)" : "var(--border)"}`,
                background: statusFilter === s ? "rgba(99,102,241,0.15)" : "transparent",
                color: statusFilter === s ? "var(--primary-light)" : "var(--text-muted)",
                fontSize: "12.5px",
                fontWeight: "500",
                cursor: "pointer",
                fontFamily: "var(--font)",
                transition: "var(--transition)",
              }}
            >
              {s === "ALL" ? "All" : `${STATUS_ICON[s as LeadStatus]} ${s}`} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-state"><div className="spinner" /><span>Loading…</span></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🎯</span>
          <h3>No leads {search || statusFilter !== "ALL" ? "found" : "yet"}</h3>
          <p>{search || statusFilter !== "ALL" ? "Try changing filters" : "Add your first lead to get started"}</p>
          {!search && statusFilter === "ALL" && <button className="btn btn-primary" style={{ marginTop: "8px" }} onClick={openAdd}>＋ Add Lead</button>}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Source</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id}>
                  <td className="cell-primary">{l.name}</td>
                  <td>{l.email || <span className="text-muted">—</span>}</td>
                  <td>{l.phone || <span className="text-muted">—</span>}</td>
                  <td>{l.company || <span className="text-muted">—</span>}</td>
                  <td>{l.source || <span className="text-muted">—</span>}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[l.status]}`}>
                      {STATUS_ICON[l.status]} {l.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(l)}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => openDelete(l)}>🗑 Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === "add" ? "Add Lead" : "Edit Lead"}</h2>
              <button className="btn btn-ghost btn-icon" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className="form-input" placeholder="Contact name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" placeholder="lead@company.com" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" placeholder="+91 98765 43210" value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input className="form-input" placeholder="Company name" value={form.company ?? ""} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Source</label>
                  <input className="form-input" placeholder="e.g. Website, Referral" value={form.source ?? ""} onChange={(e) => setForm({ ...form, source: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}>
                    <option value="NEW">🔵 New</option>
                    <option value="CONTACTED">🟠 Contacted</option>
                    <option value="QUALIFIED">🟣 Qualified</option>
                    <option value="WON">🟢 Won</option>
                    <option value="LOST">🔴 Lost</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-textarea" placeholder="Any additional notes…" value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : modal === "add" ? "Add Lead" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {modal === "delete" && selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" style={{ maxWidth: "400px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-body" style={{ textAlign: "center", padding: "36px 28px 24px" }}>
              <div className="confirm-icon">🗑</div>
              <h2>Delete Lead?</h2>
              <p style={{ marginTop: "8px", fontSize: "14px" }}>
                Are you sure you want to delete <strong style={{ color: "var(--text-primary)" }}>{selected.name}</strong>?
              </p>
            </div>
            <div className="modal-footer" style={{ justifyContent: "center" }}>
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>
                {saving ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

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