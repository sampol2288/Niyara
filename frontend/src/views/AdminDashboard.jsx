import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { adminApi } from "../api/adminApi";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  MessageSquare,
  Shield,
  Sun,
  Moon,
  Lock,
  Plus,
  Search,
  Trash2,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  FileText,
  DollarSign,
  TrendingUp,
  RefreshCw,
  LogOut,
  KeyRound,
  UserPlus,
  ShieldCheck,
  X,
  ChevronRight,
  Filter
} from "lucide-react";

export const AdminDashboard = () => {
  const {
    theme,
    toggleTheme,
    showToast,
    adminSession,
    lockAdminSession,
    auditLogs,
    clearAuditLogs,
    updateAdminPinCode,
    products,
    orders,
    users,
    discounts,
    reviews,
    categories,
    isLoading,
    refreshAllAdminData,
    fetchProducts,
    fetchOrders,
    fetchUsers,
    fetchDiscounts,
    fetchReviews,
    fetchCategories,
    formatPrice
  } = useApp();

  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'products' | 'categories' | 'orders' | 'users' | 'discounts' | 'reviews' | 'audit' | 'security'

  useEffect(() => {
    if (refreshAllAdminData) {
      refreshAllAdminData();
    }
  }, []);

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Form Input States
  const [prodForm, setProdForm] = useState({ title: "", category: "Outerwear", price: "", stock: 10, sku: "", image: "", description: "", materials: "", shippingInfo: "" });
  const [catForm, setCatForm] = useState({ name: "", description: "", image: "" });
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", role: "member", phone: "" });
  const [discForm, setDiscForm] = useState({ code: "", type: "Percentage", value: 10, usageCap: 100, expires: "Dec 31, 2026" });

  // PIN Change State
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");

  const isLight = theme === "light";

  // Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.fulfillmentStatus !== "FULFILLED").length;
  const activeProducts = products.length;
  const totalCustomers = users.length;

  // Handlers
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!prodForm.title || !prodForm.price) {
      showToast("Title and Price are required.");
      return;
    }
    const res = await adminApi.saveProduct(prodForm);
    if (res.success) {
      showToast("Product SKU saved to MongoDB Atlas!");
      setIsProductModalOpen(false);
      setProdForm({ title: "", category: "Outerwear", price: "", stock: 10, sku: "", image: "", description: "", materials: "", shippingInfo: "" });
      fetchProducts();
    } else {
      showToast(res.error || "Failed to save product SKU.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const res = await adminApi.deleteProduct(id);
    if (res.success) {
      showToast("Product deleted.");
      fetchProducts();
    } else {
      showToast(res.error || "Failed to delete product.");
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catForm.name) return;
    const res = await adminApi.saveCategory(catForm);
    if (res.success) {
      showToast("Category saved to MongoDB Atlas!");
      setIsCategoryModalOpen(false);
      setCatForm({ name: "", description: "", image: "" });
      fetchCategories();
    } else {
      showToast(res.error || "Failed to save category.");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    const res = await adminApi.deleteCategory(id);
    if (res.success) {
      showToast("Category deleted.");
      fetchCategories();
    } else {
      showToast(res.error || "Failed to delete category.");
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) return;
    const res = await adminApi.createUser(userForm);
    if (res.success) {
      showToast("User account created in MongoDB Atlas!");
      setIsUserModalOpen(false);
      setUserForm({ name: "", email: "", password: "", role: "member", phone: "" });
      fetchUsers();
    } else {
      showToast(res.error || "Failed to create user.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user account?")) return;
    const res = await adminApi.deleteUser(id);
    if (res.success) {
      showToast("User deleted.");
      fetchUsers();
    } else {
      showToast(res.error || "Failed to delete user.");
    }
  };

  const handleSaveDiscount = async (e) => {
    e.preventDefault();
    if (!discForm.code || !discForm.value) return;
    const res = await adminApi.createDiscount(discForm);
    if (res.success) {
      showToast("Promo voucher created in MongoDB Atlas!");
      setIsDiscountModalOpen(false);
      setDiscForm({ code: "", type: "Percentage", value: 10, usageCap: 100, expires: "Dec 31, 2026" });
      fetchDiscounts();
    } else {
      showToast(res.error || "Failed to create discount.");
    }
  };

  const handleDeleteDiscount = async (id) => {
    if (!window.confirm("Delete this promo voucher?")) return;
    const res = await adminApi.deleteDiscount(id);
    if (res.success) {
      showToast("Promo voucher deleted.");
      fetchDiscounts();
    } else {
      showToast(res.error || "Failed to delete discount.");
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    const res = await adminApi.updateOrderStatus(id, { fulfillmentStatus: status });
    if (res.success) {
      showToast(`Order ${id} status updated to ${status}`);
      fetchOrders();
    } else {
      showToast(res.error || "Failed to update order status.");
    }
  };

  const handleUpdatePin = (e) => {
    e.preventDefault();
    const ok = updateAdminPinCode(currentPin, newPin);
    if (ok) {
      setCurrentPin("");
      setNewPin("");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: isLight ? "#f4f4f5" : "#09090b", color: isLight ? "#09090b" : "#f4f4f5" }}>
      {/* Sidebar Navigation */}
      <aside style={{ width: "260px", background: isLight ? "#ffffff" : "#121215", borderRight: isLight ? "1px solid #e4e4e7" : "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "1.75rem 1.5rem", borderBottom: isLight ? "1px solid #e4e4e7" : "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "1.25rem", letterSpacing: "0.15em", color: "#c5a072", fontWeight: 700, display: "block" }}>
            NIYARA
          </span>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: isLight ? "#71717a" : "#a1a1aa" }}>
            COMMAND CENTER
          </span>
        </div>

        <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "products", label: "Inventory SKU", icon: Package, count: products.length },
            { id: "categories", label: "Categories", icon: Tag, count: categories.length },
            { id: "orders", label: "Orders & Fulfillment", icon: ShoppingBag, count: orders.length },
            { id: "users", label: "Users & Accounts", icon: Users, count: users.length },
            { id: "discounts", label: "Promo Codes", icon: DollarSign, count: discounts.length },
            { id: "reviews", label: "Reviews Moderation", icon: MessageSquare, count: reviews.length },
            { id: "audit", label: "Audit & Security Logs", icon: FileText },
            { id: "security", label: "Change Security PIN", icon: KeyRound }
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: "none",
                  background: active ? (isLight ? "#f4f4f5" : "rgba(197, 160, 114, 0.12)") : "transparent",
                  color: active ? "#c5a072" : isLight ? "#71717a" : "#a1a1aa",
                  fontWeight: active ? 700 : 500,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span style={{ fontSize: "0.7rem", background: isLight ? "#e4e4e7" : "rgba(255,255,255,0.08)", padding: "0.15rem 0.5rem", borderRadius: "999px", color: isLight ? "#09090b" : "#ffffff" }}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Session Info */}
        <div style={{ padding: "1.25rem", borderTop: isLight ? "1px solid #e4e4e7" : "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "0.75rem" }}>
              <strong style={{ display: "block", color: isLight ? "#09090b" : "#ffffff" }}>{adminSession.name || adminSession.user || "Operator"}</strong>
              <span style={{ color: "#c5a072", fontSize: "0.65rem", textTransform: "uppercase" }}>{adminSession.role}</span>
            </div>
            <button onClick={lockAdminSession} title="Lock Session" style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "0.25rem" }}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "2rem 2.5rem", overflowY: "auto" }}>
        {/* Top Operational Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontFamily: "Georgia, serif", margin: 0 }}>
              {activeTab === "dashboard" && "Executive Dashboard"}
              {activeTab === "products" && "Inventory SKU Catalog"}
              {activeTab === "categories" && "Category Management"}
              {activeTab === "orders" && "Orders & Fulfillment Center"}
              {activeTab === "users" && "User Accounts & Access Control"}
              {activeTab === "discounts" && "Promo Voucher Codes"}
              {activeTab === "reviews" && "Review Moderation Queue"}
              {activeTab === "audit" && "Security Audit Trail"}
              {activeTab === "security" && "Master Security Settings"}
            </h1>
            <p style={{ fontSize: "0.8rem", color: isLight ? "#71717a" : "#a1a1aa", marginTop: "0.25rem" }}>
              MongoDB Atlas Live Synchronized Operational Console
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={toggleTheme} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem" }}>
              {isLight ? <Moon size={16} /> : <Sun size={16} />}
              <span>{isLight ? "Dark" : "Light"}</span>
            </button>

            {activeTab === "products" && (
              <button onClick={() => setIsProductModalOpen(true)} className="btn-camel" style={{ padding: "0.6rem 1.25rem", fontSize: "0.8rem", cursor: "pointer", background: "#c5a072", color: "#000", fontWeight: 700, border: "none", borderRadius: "6px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Plus size={16} /> ADD NEW SKU
              </button>
            )}
            {activeTab === "categories" && (
              <button onClick={() => setIsCategoryModalOpen(true)} className="btn-camel" style={{ padding: "0.6rem 1.25rem", fontSize: "0.8rem", cursor: "pointer", background: "#c5a072", color: "#000", fontWeight: 700, border: "none", borderRadius: "6px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Plus size={16} /> ADD CATEGORY
              </button>
            )}
            {activeTab === "users" && (
              <button onClick={() => setIsUserModalOpen(true)} className="btn-camel" style={{ padding: "0.6rem 1.25rem", fontSize: "0.8rem", cursor: "pointer", background: "#c5a072", color: "#000", fontWeight: 700, border: "none", borderRadius: "6px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <UserPlus size={16} /> ADD USER
              </button>
            )}
            {activeTab === "discounts" && (
              <button onClick={() => setIsDiscountModalOpen(true)} className="btn-camel" style={{ padding: "0.6rem 1.25rem", fontSize: "0.8rem", cursor: "pointer", background: "#c5a072", color: "#000", fontWeight: 700, border: "none", borderRadius: "6px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Plus size={16} /> CREATE PROMO CODE
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {activeTab === "dashboard" && (
          <div>
            {/* Metric KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
              <div style={{ background: isLight ? "#ffffff" : "#121215", border: isLight ? "1px solid #e4e4e7" : "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1.5rem" }}>
                <span style={{ fontSize: "0.75rem", color: isLight ? "#71717a" : "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.1em" }}>Gross Revenue</span>
                <h2 style={{ fontSize: "2rem", color: "#c5a072", margin: "0.5rem 0 0" }}>{formatPrice(totalRevenue)}</h2>
              </div>
              <div style={{ background: isLight ? "#ffffff" : "#121215", border: isLight ? "1px solid #e4e4e7" : "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1.5rem" }}>
                <span style={{ fontSize: "0.75rem", color: isLight ? "#71717a" : "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.1em" }}>Total Orders</span>
                <h2 style={{ fontSize: "2rem", color: isLight ? "#09090b" : "#ffffff", margin: "0.5rem 0 0" }}>{orders.length}</h2>
              </div>
              <div style={{ background: isLight ? "#ffffff" : "#121215", border: isLight ? "1px solid #e4e4e7" : "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1.5rem" }}>
                <span style={{ fontSize: "0.75rem", color: isLight ? "#71717a" : "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.1em" }}>Catalog Products</span>
                <h2 style={{ fontSize: "2rem", color: isLight ? "#09090b" : "#ffffff", margin: "0.5rem 0 0" }}>{activeProducts}</h2>
              </div>
              <div style={{ background: isLight ? "#ffffff" : "#121215", border: isLight ? "1px solid #e4e4e7" : "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1.5rem" }}>
                <span style={{ fontSize: "0.75rem", color: isLight ? "#71717a" : "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.1em" }}>Registered Users</span>
                <h2 style={{ fontSize: "2rem", color: isLight ? "#09090b" : "#ffffff", margin: "0.5rem 0 0" }}>{totalCustomers}</h2>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY SKU CATALOG */}
        {activeTab === "products" && (
          <div style={{ background: isLight ? "#ffffff" : "#121215", border: isLight ? "1px solid #e4e4e7" : "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
              <thead style={{ background: isLight ? "#f4f4f5" : "#18181b", borderBottom: isLight ? "1px solid #e4e4e7" : "1px solid rgba(255,255,255,0.08)" }}>
                <tr>
                  <th style={{ padding: "1rem" }}>Product</th>
                  <th style={{ padding: "1rem" }}>SKU</th>
                  <th style={{ padding: "1rem" }}>Category</th>
                  <th style={{ padding: "1rem" }}>Price</th>
                  <th style={{ padding: "1rem" }}>Stock</th>
                  <th style={{ padding: "1rem" }}>Status</th>
                  <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#a1a1aa" }}>
                      No product SKUs found in MongoDB Atlas. Click "+ Add New SKU" to create one.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id || p._id} style={{ borderBottom: isLight ? "1px solid #f4f4f5" : "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <img src={p.image || p.images?.[0]} alt="" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                        <span style={{ fontWeight: 600 }}>{p.title || p.name}</span>
                      </td>
                      <td style={{ padding: "1rem", fontFamily: "monospace" }}>{p.sku}</td>
                      <td style={{ padding: "1rem" }}>{p.category}</td>
                      <td style={{ padding: "1rem", fontWeight: 600 }}>{formatPrice(p.price)}</td>
                      <td style={{ padding: "1rem" }}>{p.stock}</td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{ padding: "0.25rem 0.6rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, background: p.stock > 10 ? "rgba(16,185,129,0.15)" : p.stock > 0 ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)", color: p.stock > 10 ? "#10b981" : p.stock > 0 ? "#f59e0b" : "#ef4444" }}>
                          {p.status || (p.stock > 10 ? "In Stock" : p.stock > 0 ? "Low Stock" : "Out of Stock")}
                        </span>
                      </td>
                      <td style={{ padding: "1rem", textAlign: "right" }}>
                        <button onClick={() => handleDeleteProduct(p.id || p._id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "0.25rem" }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* MODAL: ADD PRODUCT */}
      {isProductModalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 3000, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: isLight ? "#ffffff" : "#141210", border: "1px solid #c5a072", borderRadius: "12px", padding: "2rem", maxWidth: "480px", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0, fontFamily: "Georgia, serif" }}>Add New Product SKU</h3>
              <button onClick={() => setIsProductModalOpen(false)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", marginBottom: "0.25rem" }}>TITLE</label>
                <input type="text" value={prodForm.title} onChange={(e) => setProdForm({ ...prodForm, title: e.target.value })} required style={{ width: "100%", padding: "0.65rem", background: isLight ? "#f4f4f5" : "#09090b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", color: "inherit" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", marginBottom: "0.25rem" }}>CATEGORY</label>
                  <select value={prodForm.category} onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })} style={{ width: "100%", padding: "0.65rem", background: isLight ? "#f4f4f5" : "#09090b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", color: "inherit" }}>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", marginBottom: "0.25rem" }}>SKU CODE</label>
                  <input type="text" value={prodForm.sku} onChange={(e) => setProdForm({ ...prodForm, sku: e.target.value })} placeholder="NYR-001" style={{ width: "100%", padding: "0.65rem", background: isLight ? "#f4f4f5" : "#09090b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", color: "inherit" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", marginBottom: "0.25rem" }}>PRICE ($)</label>
                  <input type="number" value={prodForm.price} onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })} required style={{ width: "100%", padding: "0.65rem", background: isLight ? "#f4f4f5" : "#09090b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", color: "inherit" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", marginBottom: "0.25rem" }}>STOCK COUNT</label>
                  <input type="number" value={prodForm.stock} onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })} required style={{ width: "100%", padding: "0.65rem", background: isLight ? "#f4f4f5" : "#09090b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", color: "inherit" }} />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", marginBottom: "0.25rem" }}>DESCRIPTION</label>
                <textarea rows={3} value={prodForm.description} onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })} placeholder="Premium quality garment crafted with attention to detail..." style={{ width: "100%", padding: "0.65rem", background: isLight ? "#f4f4f5" : "#09090b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", color: "inherit", resize: "vertical" }} />
              </div>

              {/* Materials & Care */}
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", marginBottom: "0.25rem" }}>MATERIALS & CARE</label>
                <textarea rows={2} value={prodForm.materials} onChange={(e) => setProdForm({ ...prodForm, materials: e.target.value })} placeholder="100% Italian Wool, Silk Lining, Dry Clean Only" style={{ width: "100%", padding: "0.65rem", background: isLight ? "#f4f4f5" : "#09090b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", color: "inherit", resize: "vertical" }} />
              </div>

              {/* Shipping & Returns */}
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", marginBottom: "0.25rem" }}>SHIPPING & RETURNS</label>
                <textarea rows={2} value={prodForm.shippingInfo} onChange={(e) => setProdForm({ ...prodForm, shippingInfo: e.target.value })} placeholder="Free shipping on orders over $200. 30-day returns accepted..." style={{ width: "100%", padding: "0.65rem", background: isLight ? "#f4f4f5" : "#09090b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", color: "inherit", resize: "vertical" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", marginBottom: "0.25rem" }}>IMAGE URL</label>
                <input type="text" value={prodForm.image} onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })} placeholder="https://..." style={{ width: "100%", padding: "0.65rem", background: isLight ? "#f4f4f5" : "#09090b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", color: "inherit" }} />
              </div>
              <button type="submit" style={{ marginTop: "1rem", padding: "0.85rem", background: "#c5a072", color: "#000", border: "none", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}>
                SAVE SKU TO MONGODB
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
