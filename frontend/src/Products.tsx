import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

type Product = {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  price: number;
  stock: number;
};

type FormData = Omit<Product, "id">;
const EMPTY: FormData = { name: "", sku: "", description: "", price: 0, stock: 0 };

type Toast = { type: "success" | "error"; text: string };

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const token = localStorage.getItem("token")!;

  const showToast = (type: Toast["type"], text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setProducts(data.products || []);
    } catch {
      showToast("error", "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal("add"); };
  const openEdit = (p: Product) => {
    setSelected(p);
    setForm({ name: p.name, sku: p.sku, description: p.description ?? "", price: p.price, stock: p.stock });
    setModal("edit");
  };
  const openDelete = (p: Product) => { setSelected(p); setModal("delete"); };
  const closeModal = () => { setModal(null); setSelected(null); setForm(EMPTY); };

  const handleSave = async () => {
    if (!form.name.trim()) { showToast("error", "Product name is required"); return; }
    if (!form.sku.trim() && modal === "add") { showToast("error", "SKU is required"); return; }
    if (form.price < 0) { showToast("error", "Price cannot be negative"); return; }
    if (form.stock < 0) { showToast("error", "Stock cannot be negative"); return; }
    setSaving(true);
    try {
      const isEdit = modal === "edit";
      const url = isEdit ? `${API_URL}/api/products/${selected!.id}` : `${API_URL}/api/products`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) }),
      });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.message || "Failed to save"); return; }
      showToast("success", isEdit ? "Product updated!" : "Product added!");
      closeModal();
      fetchProducts();
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
      const res = await fetch(`${API_URL}/api/products/${selected.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast("success", "Product deleted");
        closeModal();
        fetchProducts();
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

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    (p.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const stockBadge = (stock: number) => {
    if (stock === 0) return "badge-red";
    if (stock <= 5) return "badge-orange";
    return "badge-green";
  };
  const stockLabel = (stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 5) return "Low Stock";
    return "In Stock";
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p style={{ marginTop: "4px", fontSize: "13.5px" }}>{products.length} products in inventory</p>
        </div>
        <div className="flex gap-3 items-center" style={{ flexWrap: "wrap" }}>
          <div className="search-bar">
            <span style={{ color: "var(--text-muted)" }}>🔍</span>
            <input placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={openAdd}>＋ Add Product</button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="loading-state"><div className="spinner" /><span>Loading…</span></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <h3>No products {search ? "found" : "yet"}</h3>
          <p>{search ? "Try a different search" : "Add your first product to get started"}</p>
          {!search && <button className="btn btn-primary" style={{ marginTop: "8px" }} onClick={openAdd}>＋ Add Product</button>}
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}>
          {filtered.map((p) => (
            <div
              key={p.id}
              className="card"
              style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {/* Icon + name row */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "20px", flexShrink: 0,
                }}>📦</div>
                <span className={`badge ${stockBadge(p.stock)}`}>{stockLabel(p.stock)}</span>
              </div>
              <div>
                <h3 style={{ marginBottom: "4px" }}>{p.name}</h3>
                <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px", fontFamily: "monospace", letterSpacing: "0.05em" }}>
                  SKU: {p.sku}
                </div>
                <p style={{ fontSize: "13px", lineHeight: "1.5", color: "var(--text-muted)" }}>
                  {p.description || "No description"}
                </p>
              </div>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                paddingTop: "12px", borderTop: "1px solid var(--border)",
              }}>
                <div>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "var(--primary-light)" }}>
                    ₹{p.price.toLocaleString("en-IN")}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {p.stock} units in stock
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>✏️</button>
                  <button className="btn btn-danger btn-sm" onClick={() => openDelete(p)}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === "add" ? "Add Product" : "Edit Product"}</h2>
              <button className="btn btn-ghost btn-icon" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input className="form-input" placeholder="Laptop Pro" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">SKU *</label>
                  <input
                    className="form-input"
                    placeholder="LAP-001"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    disabled={modal === "edit"}
                    title={modal === "edit" ? "SKU cannot be changed after creation" : ""}
                    style={modal === "edit" ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" placeholder="Describe the product…" value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input type="number" className="form-input" placeholder="0.00" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock (units) *</label>
                  <input type="number" className="form-input" placeholder="0" min="0" step="1" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : modal === "add" ? "Add Product" : "Save Changes"}
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
              <h2>Delete Product?</h2>
              <p style={{ marginTop: "8px", fontSize: "14px" }}>
                Delete <strong style={{ color: "var(--text-primary)" }}>{selected.name}</strong>? This cannot be undone.
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