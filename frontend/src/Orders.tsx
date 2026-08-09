import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type Customer = { id: number; name: string; email: string | null };
type Product  = { id: number; name: string; price: number; stock: number };

type OrderItem = {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
};

type Order = {
  id: number;
  status: OrderStatus;
  total: number;
  createdAt: string;
  customer: Customer;
  items: OrderItem[];
};

type CartItem = { productId: number; quantity: number; product: Product };

type Toast = { type: "success" | "error"; text: string };

const STATUS_BADGE: Record<OrderStatus, string> = {
  PENDING:   "badge-orange",
  CONFIRMED: "badge-blue",
  SHIPPED:   "badge-purple",
  DELIVERED: "badge-green",
  CANCELLED: "badge-red",
};
const STATUS_ICON: Record<OrderStatus, string> = {
  PENDING: "⏳", CONFIRMED: "✅", SHIPPED: "🚚", DELIVERED: "📬", CANCELLED: "❌",
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

  // Create order
  const [showCreate, setShowCreate] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartProductId, setCartProductId] = useState("");
  const [cartQty, setCartQty] = useState(1);
  const [saving, setSaving] = useState(false);

  // Update status modal
  const [statusModal, setStatusModal] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("PENDING");

  // Delete modal
  const [deleteModal, setDeleteModal] = useState<Order | null>(null);

  // Detail view
  const [detailModal, setDetailModal] = useState<Order | null>(null);

  const [toast, setToast] = useState<Toast | null>(null);

  const token = localStorage.getItem("token")!;

  const showToast = (type: Toast["type"], text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setOrders(data.orders || []);
    } catch {
      showToast("error", "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomersAndProducts = async () => {
    const [cRes, pRes] = await Promise.all([
      fetch(`${API_URL}/api/customers`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_URL}/api/products`,  { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    const [cData, pData] = await Promise.all([cRes.json(), pRes.json()]);
    setCustomers(cData.customers || []);
    setProducts(pData.products || []);
  };

  useEffect(() => { fetchOrders(); }, []);

  const openCreate = async () => {
    setCart([]);
    setSelectedCustomer("");
    setCartProductId("");
    setCartQty(1);
    await fetchCustomersAndProducts();
    setShowCreate(true);
  };

  const addToCart = () => {
    if (!cartProductId) { showToast("error", "Select a product"); return; }
    if (cartQty < 1)    { showToast("error", "Quantity must be at least 1"); return; }
    const product = products.find((p) => p.id === Number(cartProductId));
    if (!product) return;
    if (cartQty > product.stock) {
      showToast("error", `Only ${product.stock} units available for ${product.name}`);
      return;
    }
    const existing = cart.findIndex((c) => c.productId === product.id);
    if (existing >= 0) {
      const updated = [...cart];
      updated[existing].quantity += cartQty;
      setCart(updated);
    } else {
      setCart([...cart, { productId: product.id, quantity: cartQty, product }]);
    }
    setCartProductId("");
    setCartQty(1);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((c) => c.productId !== productId));
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.product.price * c.quantity, 0);

  const handleCreateOrder = async () => {
    if (!selectedCustomer) { showToast("error", "Select a customer"); return; }
    if (cart.length === 0)  { showToast("error", "Add at least one product"); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          customerId: Number(selectedCustomer),
          items: cart.map((c) => ({ productId: c.productId, quantity: c.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.message || "Failed to create order"); return; }
      showToast("success", "Order created successfully!");
      setShowCreate(false);
      fetchOrders();
    } catch {
      showToast("error", "Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!statusModal) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/orders/${statusModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.message || "Failed to update"); return; }
      showToast("success", "Order status updated!");
      setStatusModal(null);
      fetchOrders();
    } catch {
      showToast("error", "Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/orders/${deleteModal.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast("success", "Order deleted");
        setDeleteModal(null);
        fetchOrders();
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

  const filtered = orders.filter((o) => {
    const matchSearch =
      `#${o.id}`.includes(search) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p style={{ marginTop: "4px", fontSize: "13.5px" }}>{orders.length} total orders</p>
        </div>
        <div className="flex gap-3 items-center" style={{ flexWrap: "wrap" }}>
          <div className="search-bar">
            <span style={{ color: "var(--text-muted)" }}>🔍</span>
            <input placeholder="Search by ID or customer…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select
            className="form-select"
            style={{ width: "auto", padding: "10px 14px" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "ALL")}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button className="btn btn-primary" onClick={openCreate}>＋ New Order</button>
        </div>
      </div>

      {/* Status pills */}
      <div className="flex gap-2" style={{ marginBottom: "24px", flexWrap: "wrap" }}>
        {(["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const).map((s) => {
          const count = s === "ALL" ? orders.length : orders.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: "5px 14px", borderRadius: "999px",
                border: `1px solid ${statusFilter === s ? "rgba(99,102,241,0.5)" : "var(--border)"}`,
                background: statusFilter === s ? "rgba(99,102,241,0.15)" : "transparent",
                color: statusFilter === s ? "var(--primary-light)" : "var(--text-muted)",
                fontSize: "12.5px", fontWeight: "500", cursor: "pointer",
                fontFamily: "var(--font)", transition: "var(--transition)",
              }}
            >
              {s === "ALL" ? "All" : `${STATUS_ICON[s as OrderStatus]} ${s}`} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-state"><div className="spinner" /><span>Loading…</span></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🛒</span>
          <h3>No orders {search || statusFilter !== "ALL" ? "found" : "yet"}</h3>
          <p>{search || statusFilter !== "ALL" ? "Try changing filters" : "Create your first order to get started"}</p>
          {!search && statusFilter === "ALL" && (
            <button className="btn btn-primary" style={{ marginTop: "8px" }} onClick={openCreate}>＋ New Order</button>
          )}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td className="cell-primary">#{o.id}</td>
                  <td>{o.customer.name}</td>
                  <td style={{ color: "var(--text-secondary)" }}>
                    {o.items.length} item{o.items.length !== 1 ? "s" : ""}
                  </td>
                  <td style={{ fontWeight: "600", color: "#34d399" }}>
                    ₹{o.total.toLocaleString("en-IN")}
                  </td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[o.status]}`}>
                      {STATUS_ICON[o.status]} {o.status}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: "12.5px" }}>
                    {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-ghost btn-sm" title="View details" onClick={() => setDetailModal(o)}>👁</button>
                      <button
                        className="btn btn-ghost btn-sm"
                        title="Update status"
                        onClick={() => { setStatusModal(o); setNewStatus(o.status); }}
                      >
                        🔄
                      </button>
                      <button className="btn btn-danger btn-sm" title="Delete order" onClick={() => setDeleteModal(o)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Create Order Modal ── */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🛒 New Order</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowCreate(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Customer */}
              <div className="form-group">
                <label className="form-label">Customer *</label>
                <select className="form-select" value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
                  <option value="">— Select a customer —</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}{c.email ? ` (${c.email})` : ""}</option>
                  ))}
                </select>
              </div>

              {/* Add product to cart */}
              <div>
                <label className="form-label" style={{ display: "block", marginBottom: "8px" }}>Add Products</label>
                <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
                  <select
                    className="form-select"
                    style={{ flex: 2 }}
                    value={cartProductId}
                    onChange={(e) => setCartProductId(e.target.value)}
                  >
                    <option value="">— Select a product —</option>
                    {products.filter((p) => p.stock > 0).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ₹{p.price.toLocaleString("en-IN")} ({p.stock} in stock)
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className="form-input"
                    style={{ width: "80px", flexShrink: 0 }}
                    min={1}
                    value={cartQty}
                    onChange={(e) => setCartQty(parseInt(e.target.value) || 1)}
                  />
                  <button className="btn btn-primary" onClick={addToCart}>＋ Add</button>
                </div>
              </div>

              {/* Cart */}
              {cart.length > 0 && (
                <div>
                  <label className="form-label" style={{ display: "block", marginBottom: "8px" }}>
                    Order Items ({cart.length})
                  </label>
                  <div style={{ border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
                    {cart.map((c) => (
                      <div
                        key={c.productId}
                        style={{
                          display: "flex", alignItems: "center", gap: "12px",
                          padding: "12px 16px",
                          borderBottom: "1px solid var(--border)",
                          background: "rgba(255,255,255,0.02)",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "500", color: "var(--text-primary)" }}>{c.product.name}</div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                            ₹{c.product.price.toLocaleString("en-IN")} × {c.quantity} = ₹{(c.product.price * c.quantity).toLocaleString("en-IN")}
                          </div>
                        </div>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeFromCart(c.productId)}
                        >✕</button>
                      </div>
                    ))}
                    <div style={{
                      padding: "12px 16px",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      background: "rgba(99,102,241,0.06)",
                    }}>
                      <span style={{ fontWeight: "600", color: "var(--text-secondary)" }}>Total</span>
                      <span style={{ fontWeight: "800", fontSize: "18px", color: "#34d399" }}>
                        ₹{cartTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleCreateOrder}
                disabled={saving || !selectedCustomer || cart.length === 0}
              >
                {saving ? "Placing Order…" : `Place Order${cartTotal > 0 ? ` — ₹${cartTotal.toLocaleString("en-IN")}` : ""}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Status Update Modal ── */}
      {statusModal && (
        <div className="modal-overlay" onClick={() => setStatusModal(null)}>
          <div className="modal" style={{ maxWidth: "420px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Order #{statusModal.id}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setStatusModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">New Status</label>
                <select
                  className="form-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                >
                  <option value="PENDING">⏳ Pending</option>
                  <option value="CONFIRMED">✅ Confirmed</option>
                  <option value="SHIPPED">🚚 Shipped</option>
                  <option value="DELIVERED">📬 Delivered</option>
                  <option value="CANCELLED">❌ Cancelled</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setStatusModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleUpdateStatus} disabled={saving}>
                {saving ? "Saving…" : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Order Detail Modal ── */}
      {detailModal && (
        <div className="modal-overlay" onClick={() => setDetailModal(null)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Order #{detailModal.id}</h2>
                <p style={{ fontSize: "13px", marginTop: "2px" }}>
                  {new Date(detailModal.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <span className={`badge ${STATUS_BADGE[detailModal.status]}`}>
                  {STATUS_ICON[detailModal.status]} {detailModal.status}
                </span>
                <button className="btn btn-ghost btn-icon" onClick={() => setDetailModal(null)}>✕</button>
              </div>
            </div>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Customer */}
              <div style={{
                padding: "16px", borderRadius: "10px",
                background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
              }}>
                <div className="form-label" style={{ marginBottom: "8px" }}>Customer</div>
                <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>{detailModal.customer.name}</div>
                {detailModal.customer.email && (
                  <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{detailModal.customer.email}</div>
                )}
              </div>

              {/* Items */}
              <div>
                <div className="form-label" style={{ marginBottom: "8px" }}>Items ({detailModal.items.length})</div>
                <div style={{ border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Unit Price</th>
                        <th>Qty</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailModal.items.map((item) => (
                        <tr key={item.id}>
                          <td className="cell-primary">{item.product.name}</td>
                          <td>₹{item.price.toLocaleString("en-IN")}</td>
                          <td>{item.quantity}</td>
                          <td style={{ fontWeight: "600", color: "#34d399" }}>
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{
                    padding: "14px 16px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "rgba(99,102,241,0.06)", borderTop: "1px solid var(--border)",
                  }}>
                    <span style={{ fontWeight: "600", color: "var(--text-secondary)" }}>Order Total</span>
                    <span style={{ fontWeight: "800", fontSize: "20px", color: "#34d399" }}>
                      ₹{detailModal.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setDetailModal(null)}>Close</button>
              <button
                className="btn btn-primary"
                onClick={() => { setDetailModal(null); setStatusModal(detailModal); setNewStatus(detailModal.status); }}
              >
                🔄 Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="modal" style={{ maxWidth: "400px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-body" style={{ textAlign: "center", padding: "36px 28px 24px" }}>
              <div className="confirm-icon">🗑</div>
              <h2>Delete Order #{deleteModal.id}?</h2>
              <p style={{ marginTop: "8px", fontSize: "14px" }}>
                This order for <strong style={{ color: "var(--text-primary)" }}>{deleteModal.customer.name}</strong> worth{" "}
                <strong style={{ color: "#34d399" }}>₹{deleteModal.total.toLocaleString("en-IN")}</strong> will be permanently deleted.
              </p>
            </div>
            <div className="modal-footer" style={{ justifyContent: "center" }}>
              <button className="btn btn-ghost" onClick={() => setDeleteModal(null)}>Cancel</button>
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
