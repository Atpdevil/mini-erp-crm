import { useEffect, useState } from "react";

const API_URL = "https://mini-erp-crm-izul.onrender.com";

type Customer = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  address: string | null;
};

type FormData = Omit<Customer, "id">;

const EMPTY: FormData = { name: "", email: "", phone: "", company: "", address: "" };

type Toast = { type: "success" | "error"; text: string };

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const token = localStorage.getItem("token")!;

  const showToast = (type: Toast["type"], text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setCustomers(data.customers || []);
    } catch {
      showToast("error", "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal("add"); };
  const openEdit = (c: Customer) => {
    setSelected(c);
    setForm({ name: c.name, email: c.email ?? "", phone: c.phone ?? "", company: c.company ?? "", address: c.address ?? "" });
    setModal("edit");
  };
  const openDelete = (c: Customer) => { setSelected(c); setModal("delete"); };
  const closeModal = () => { setModal(null); setSelected(null); setForm(EMPTY); };

  const handleSave = async () => {
    if (!form.name.trim()) { showToast("error", "Customer name is required"); return; }
    setSaving(true);
    try {
      const isEdit = modal === "edit";
      const url = isEdit ? `${API_URL}/api/customers/${selected!.id}` : `${API_URL}/api/customers`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.message || "Failed to save"); return; }
      showToast("success", isEdit ? "Customer updated!" : "Customer added!");
      closeModal();
      fetchCustomers();
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
      const res = await fetch(`${API_URL}/api/customers/${selected.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast("success", "Customer deleted");
        closeModal();
        fetchCustomers();
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

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (c.company ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p style={{ marginTop: "4px", fontSize: "13.5px" }}>{customers.length} total customers</p>
        </div>
        <div className="flex gap-3 items-center" style={{ flexWrap: "wrap" }}>
          <div className="search-bar">
            <span style={{ color: "var(--text-muted)" }}>🔍</span>
            <input
              placeholder="Search customers…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={openAdd}>
            ＋ Add Customer
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-state"><div className="spinner" /><span>Loading…</span></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">👥</span>
          <h3>No customers {search ? "found" : "yet"}</h3>
          <p>{search ? "Try a different search term" : "Add your first customer to get started"}</p>
          {!search && <button className="btn btn-primary" style={{ marginTop: "8px" }} onClick={openAdd}>＋ Add Customer</button>}
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
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td className="cell-primary">{c.name}</td>
                  <td>{c.email || <span className="text-muted">—</span>}</td>
                  <td>{c.phone || <span className="text-muted">—</span>}</td>
                  <td>{c.company || <span className="text-muted">—</span>}</td>
                  <td>{c.address || <span className="text-muted">—</span>}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => openDelete(c)}>🗑 Delete</button>
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
              <h2>{modal === "add" ? "Add Customer" : "Edit Customer"}</h2>
              <button className="btn btn-ghost btn-icon" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className="form-input" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" placeholder="john@company.com" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" placeholder="+91 98765 43210" value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input className="form-input" placeholder="Acme Corp" value={form.company ?? ""} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea className="form-textarea" placeholder="123 Main St, City, State" value={form.address ?? ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : modal === "add" ? "Add Customer" : "Save Changes"}
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
              <h2>Delete Customer?</h2>
              <p style={{ marginTop: "8px", fontSize: "14px" }}>
                Are you sure you want to delete <strong style={{ color: "var(--text-primary)" }}>{selected.name}</strong>? This cannot be undone.
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