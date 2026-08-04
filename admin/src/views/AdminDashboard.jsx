import React, { useState } from "react";
import { useAdmin } from "../context/AdminContext";
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
  Eye,
  FolderTree,
  Layers,
  Sparkles,
  X
} from "lucide-react";

export const AdminDashboard = () => {
  const {
    theme,
    toggleTheme,
    adminSession,
    lockAdminSession,
    auditLogs,
    clearAuditLogs,
    updateAdminPinCode,
    showToast,
    formatPrice,
    products,
    orders,
    users,
    discounts,
    reviews,
    categories,
    setCategories,
    isLoading,
    refreshAllData,
    fetchProducts,
    fetchOrders,
    fetchUsers,
    fetchDiscounts,
    fetchReviews,
    fetchCategories
  } = useAdmin();

  // Navigation tab
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, inventory, categories, orders, customers, discounts, reviews, security

  // Global search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState("All");
  const [inventoryStockFilter, setInventoryStockFilter] = useState("All");
  const [ordersStatusFilter, setOrdersStatusFilter] = useState("All");

  // Selection states
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  // Product Modals state
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: "",
    category: "Outerwear",
    price: "",
    stock: "",
    sku: "",
    image: "",
    description: "",
    shippingInfo: ""
  });

  // Category Modal state
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    image: "",
    isFeatured: false,
    status: "ACTIVE"
  });

  // User modal state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", role: "member", phone: "" });

  // Discount modal state
  const [isAddDiscountModalOpen, setIsAddDiscountModalOpen] = useState(false);
  const [discountForm, setDiscountForm] = useState({ code: "", type: "Percentage", value: "", usageCap: "100", expires: "Dec 31, 2026" });

  // PIN modal state
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinForm, setPinForm] = useState({ currentPin: "", newPin: "", confirmPin: "" });

  // KPI calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalStockItems = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.fulfillmentStatus === "UNFULFILLED").length;

  // Handlers for Products
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id: editingProduct ? editingProduct.id : undefined,
        title: productForm.title,
        category: productForm.category,
        sku: productForm.sku || `NYR-${Math.floor(1000 + Math.random() * 9000)}`,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        image: productForm.image || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop",
        description: productForm.description,
        shippingInfo: productForm.shippingInfo
      };

      const res = await adminApi.saveProduct(payload);
      if (res.success) {
        showToast(editingProduct ? "Product SKU updated" : "New SKU added to inventory", "success");
        setIsAddProductModalOpen(false);
        setEditingProduct(null);
        setProductForm({ title: "", category: "Outerwear", price: "", stock: "", sku: "", image: "", description: "", shippingInfo: "" });
        fetchProducts();
      } else {
        showToast("Error saving product: " + res.error, "danger");
      }
    } catch (err) {
      showToast("Server error: " + err.message, "danger");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product from MongoDB?")) return;
    try {
      const res = await adminApi.deleteProduct(id);
      if (res.success) {
        showToast("Product SKU deleted");
        fetchProducts();
      }
    } catch (e) {
      showToast("Error deleting product");
    }
  };

  const handleEditProductClick = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      title: prod.title || prod.name || "",
      category: prod.category || "Outerwear",
      price: prod.price || "",
      stock: prod.stock || "",
      sku: prod.sku || "",
      image: prod.image || "",
      description: prod.description || "",
      shippingInfo: prod.shippingInfo || ""
    });
    setIsAddProductModalOpen(true);
  };

  // Handlers for Categories
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    const catId = editingCategory ? editingCategory.id : `CAT-${Math.floor(100 + Math.random() * 900)}`;
    const slug = categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const newCatObj = {
      id: catId,
      name: categoryForm.name,
      slug,
      description: categoryForm.description,
      image: categoryForm.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
      isFeatured: categoryForm.isFeatured,
      status: categoryForm.status,
      itemCount: 0
    };

    try {
      const res = await adminApi.saveCategory({
        id: editingCategory ? editingCategory.id : undefined,
        name: categoryForm.name,
        description: categoryForm.description,
        image: categoryForm.image,
        isFeatured: categoryForm.isFeatured,
        status: categoryForm.status
      });

      if (res.success) {
        showToast(editingCategory ? "Category updated in MongoDB" : "New Category created in MongoDB", "success");
        fetchCategories();
      } else {
        setCategories((prev) => {
          const exists = prev.some((c) => c.id === catId);
          return exists ? prev.map((c) => (c.id === catId ? newCatObj : c)) : [newCatObj, ...prev];
        });
        showToast(editingCategory ? "Category updated (Local Mode)" : "New Category created", "success");
      }
    } catch (err) {
      setCategories((prev) => {
        const exists = prev.some((c) => c.id === catId);
        return exists ? prev.map((c) => (c.id === catId ? newCatObj : c)) : [newCatObj, ...prev];
      });
      showToast(editingCategory ? "Category updated (Local Mode)" : "New Category created", "success");
    } finally {
      setIsAddCategoryModalOpen(false);
      setEditingCategory(null);
      setCategoryForm({ name: "", description: "", image: "", isFeatured: false, status: "ACTIVE" });
    }
  };

  const handleToggleCategoryStatus = async (catId, currentStatus) => {
    const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setCategories((prev) => prev.map((c) => (c.id === catId ? { ...c, status: nextStatus } : c)));
    showToast(`Category status set to ${nextStatus}`);
    try {
      await adminApi.updateCategoryStatus(catId, nextStatus);
      fetchCategories();
    } catch (err) {
      // Handled locally
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    showToast("Category removed");
    try {
      await adminApi.deleteCategory(catId);
      fetchCategories();
    } catch (err) {
      // Handled locally
    }
  };

  const handleEditCategoryClick = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name || "",
      description: cat.description || "",
      image: cat.image || "",
      isFeatured: Boolean(cat.isFeatured),
      status: cat.status || "ACTIVE"
    });
    setIsAddCategoryModalOpen(true);
  };

  // Handlers for Orders
  const handleUpdateOrderStatus = async (orderId, newFulfillmentStatus) => {
    try {
      const res = await adminApi.updateOrderStatus(orderId, { fulfillmentStatus: newFulfillmentStatus });
      if (res.success) {
        showToast(`Order ${orderId} marked as ${newFulfillmentStatus}`);
        fetchOrders();
      }
    } catch (err) {
      showToast("Failed to update order status");
    }
  };

  // Handlers for Users
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await adminApi.createUser(userForm);
      if (res.success) {
        showToast("New user account created successfully", "success");
        setIsAddUserModalOpen(false);
        setUserForm({ name: "", email: "", password: "", role: "member", phone: "" });
        fetchUsers();
      } else {
        showToast("Error creating user: " + res.error);
      }
    } catch (err) {
      showToast("Error creating user: " + err.message);
    }
  };

  const handleChangeUserRole = async (userId, newRole) => {
    try {
      const res = await adminApi.updateUserRole(userId, newRole);
      if (res.success) {
        showToast(`User role updated to ${newRole}`);
        fetchUsers();
      }
    } catch (e) {
      showToast("Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user account?")) return;
    try {
      const res = await adminApi.deleteUser(userId);
      if (res.success) {
        showToast("User account deleted");
        fetchUsers();
      }
    } catch (e) {
      showToast("Failed to delete user");
    }
  };

  // Handlers for Discounts
  const handleCreateDiscount = async (e) => {
    e.preventDefault();
    try {
      const res = await adminApi.createDiscount({
        code: discountForm.code,
        type: discountForm.type,
        value: parseFloat(discountForm.value),
        usageCap: parseInt(discountForm.usageCap),
        expires: discountForm.expires
      });
      if (res.success) {
        showToast("Promo voucher created", "success");
        setIsAddDiscountModalOpen(false);
        setDiscountForm({ code: "", type: "Percentage", value: "", usageCap: "100", expires: "Dec 31, 2026" });
        fetchDiscounts();
      } else {
        showToast("Error creating promo code: " + res.error);
      }
    } catch (err) {
      showToast("Failed to create discount");
    }
  };

  const handleDeleteDiscount = async (id) => {
    try {
      const res = await adminApi.deleteDiscount(id);
      if (res.success) {
        showToast("Discount code removed");
        fetchDiscounts();
      }
    } catch (e) {
      showToast("Failed to delete discount");
    }
  };

  // Handlers for Reviews
  const handleToggleReviewStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "APPROVED" ? "REJECTED" : "APPROVED";
    try {
      const res = await adminApi.updateReviewStatus(id, nextStatus);
      if (res.success) {
        showToast(`Review status updated to ${nextStatus}`);
        fetchReviews();
      }
    } catch (e) {
      showToast("Failed to update review status");
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      const res = await adminApi.deleteReview(id);
      if (res.success) {
        showToast("Review deleted");
        fetchReviews();
      }
    } catch (e) {
      showToast("Failed to delete review");
    }
  };

  // Handlers for PIN Change
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinForm.newPin !== pinForm.confirmPin) {
      showToast("New PIN and Confirm PIN do not match", "danger");
      return;
    }
    const res = updateAdminPinCode(pinForm.currentPin, pinForm.newPin);
    if (res.success) {
      setIsPinModalOpen(false);
      setPinForm({ currentPin: "", newPin: "", confirmPin: "" });
    } else {
      showToast(res.message, "danger");
    }
  };

  // Filtered lists
  const filteredProducts = products.filter((p) => {
    const matchesSearch = (p.title || p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (p.sku || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = inventoryCategoryFilter === "All" || p.category === inventoryCategoryFilter;
    const matchesStock =
      inventoryStockFilter === "All"
        ? true
        : inventoryStockFilter === "In Stock"
        ? (p.stock || 0) > 10
        : inventoryStockFilter === "Low Stock"
        ? (p.stock || 0) > 0 && (p.stock || 0) <= 10
        : (p.stock || 0) === 0;
    return matchesSearch && matchesCat && matchesStock;
  });

  const filteredCategories = categories.filter((c) => {
    return (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (c.description || "").toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = (o.id || "").toLowerCase().includes(searchQuery.toLowerCase()) || (o.customer || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = ordersStatusFilter === "All" || o.fulfillmentStatus === ordersStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside
        style={{
          width: "260px",
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          padding: "1.5rem 1rem",
          flexShrink: 0
        }}
      >
        <div style={{ paddingBottom: "1.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ padding: "0.5rem", background: "var(--accent-gold-soft)", borderRadius: "0.5rem", color: "var(--accent-gold)" }}>
              <Shield size={22} />
            </div>
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", letterSpacing: "0.05em" }}>NIYARA</h2>
              <span style={{ fontSize: "0.7rem", color: "var(--accent-gold)", fontWeight: 700, letterSpacing: "0.05em" }}>
                COMMAND CENTER
              </span>
            </div>
          </div>
        </div>

        {/* Menu Links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem", flex: 1 }}>
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "inventory", label: "Inventory SKU", icon: Package, count: products.length },
            { id: "categories", label: "Categories", icon: FolderTree, count: categories.length },
            { id: "orders", label: "Orders & Fulfillment", icon: ShoppingBag, count: pendingOrdersCount },
            { id: "customers", label: "Users & Accounts", icon: Users, count: users.length },
            { id: "discounts", label: "Promo Codes", icon: Tag, count: discounts.length },
            { id: "reviews", label: "Reviews Moderation", icon: MessageSquare, count: reviews.length },
            { id: "security", label: "Audit & Security Logs", icon: ShieldCheck, count: auditLogs.length }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  background: isActive ? "linear-gradient(135deg, rgba(197, 160, 114, 0.2) 0%, rgba(197, 160, 114, 0.05) 100%)" : "transparent",
                  color: isActive ? "var(--accent-gold)" : "var(--text-secondary)",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    style={{
                      padding: "0.15rem 0.5rem",
                      borderRadius: "9999px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      background: isActive ? "var(--accent-gold)" : "var(--bg-elevated)",
                      color: isActive ? "#000" : "var(--text-muted)"
                    }}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer controls */}
        <div style={{ paddingTop: "1.5rem", borderTop: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button
            onClick={() => setIsPinModalOpen(true)}
            className="btn-secondary"
            style={{ width: "100%", justifyContent: "center", fontSize: "0.8rem" }}
          >
            <KeyRound size={14} /> Change Security PIN
          </button>
          <button
            onClick={lockAdminSession}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0.6rem",
              borderRadius: "0.5rem",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              fontWeight: 600,
              fontSize: "0.8rem",
              cursor: "pointer"
            }}
          >
            <LogOut size={14} /> Lock Session
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="admin-main">
        {/* Header bar */}
        <header
          style={{
            height: "70px",
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border-color)",
            padding: "0 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, textTransform: "capitalize" }}>
              {activeTab} Overview
            </h2>
            {isLoading && (
              <span style={{ fontSize: "0.75rem", color: "var(--accent-gold)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <RefreshCw size={12} className="spin" /> Syncing MongoDB...
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Refresh button */}
            <button
              onClick={refreshAllData}
              title="Refresh Data"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                cursor: "pointer"
              }}
            >
              <RefreshCw size={16} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.85rem"
              }}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              <span>{theme === "light" ? "Dark" : "Light"}</span>
            </button>

            {/* Profile badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingLeft: "1rem", borderLeft: "1px solid var(--border-color)" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--accent-gold)",
                  color: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800
                }}
              >
                A
              </div>
              <div style={{ fontSize: "0.85rem" }}>
                <p style={{ fontWeight: 700, lineHeight: 1.1 }}>{adminSession.role}</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{adminSession.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="admin-content">
          {isLoading && (
            <div className="glass-panel loading-container" style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "1.05rem", fontWeight: 700 }}>
                <RefreshCw size={22} className="spin" color="var(--accent-gold)" />
                <span>FETCHING LIVE MONGODB DATABASE RECORDS...</span>
              </div>
              <div style={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
                <div className="skeleton-box" style={{ height: "90px" }} />
                <div className="skeleton-box" style={{ height: "90px" }} />
                <div className="skeleton-box" style={{ height: "90px" }} />
                <div className="skeleton-box" style={{ height: "90px" }} />
              </div>
            </div>
          )}

          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* KPI Cards Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
                <div className="glass-panel" style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em" }}>TOTAL REVENUE</span>
                    <DollarSign size={20} color="var(--accent-gold)" />
                  </div>
                  <h3 style={{ fontSize: "1.8rem", fontWeight: 800 }}>{formatPrice(totalRevenue)}</h3>
                  <p style={{ fontSize: "0.75rem", color: "var(--success)", marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <TrendingUp size={12} /> +14.2% from last month
                  </p>
                </div>

                <div className="glass-panel" style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em" }}>TOTAL ORDERS</span>
                    <ShoppingBag size={20} color="var(--accent-gold)" />
                  </div>
                  <h3 style={{ fontSize: "1.8rem", fontWeight: 800 }}>{orders.length}</h3>
                  <p style={{ fontSize: "0.75rem", color: "var(--warning)", marginTop: "0.25rem" }}>
                    {pendingOrdersCount} Unfulfilled orders pending
                  </p>
                </div>

                <div className="glass-panel" style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em" }}>CATEGORIES</span>
                    <FolderTree size={20} color="var(--accent-gold)" />
                  </div>
                  <h3 style={{ fontSize: "1.8rem", fontWeight: 800 }}>{categories.length}</h3>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                    Active Product Collections
                  </p>
                </div>

                <div className="glass-panel" style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em" }}>REGISTERED USERS</span>
                    <Users size={20} color="var(--accent-gold)" />
                  </div>
                  <h3 style={{ fontSize: "1.8rem", fontWeight: 800 }}>{users.length}</h3>
                  <p style={{ fontSize: "0.75rem", color: "var(--success)", marginTop: "0.25rem" }}>
                    Active MongoDB User Accounts
                  </p>
                </div>
              </div>

              {/* Recent Activity & Orders Table */}
              <div className="glass-panel" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Recent Customer Orders</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Live order stream from MongoDB database</p>
                  </div>
                  <button onClick={() => setActiveTab("orders")} className="btn-secondary" style={{ fontSize: "0.8rem" }}>
                    View All Orders
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>No orders found in database.</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                          <th style={{ padding: "0.75rem" }}>ORDER ID</th>
                          <th style={{ padding: "0.75rem" }}>CUSTOMER</th>
                          <th style={{ padding: "0.75rem" }}>TOTAL</th>
                          <th style={{ padding: "0.75rem" }}>PAYMENT</th>
                          <th style={{ padding: "0.75rem" }}>FULFILLMENT</th>
                          <th style={{ padding: "0.75rem" }}>DATE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((o) => (
                          <tr key={o.id || o._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                            <td style={{ padding: "0.75rem", fontWeight: 700, color: "var(--accent-gold)" }}>{o.id}</td>
                            <td style={{ padding: "0.75rem" }}>{o.customer}</td>
                            <td style={{ padding: "0.75rem", fontWeight: 700 }}>{formatPrice(o.total)}</td>
                            <td style={{ padding: "0.75rem" }}>
                              <span className="badge-status badge-paid">{o.paymentStatus || "PAID"}</span>
                            </td>
                            <td style={{ padding: "0.75rem" }}>
                              <span className={`badge-status ${o.fulfillmentStatus === "DELIVERED" ? "badge-paid" : "badge-low-stock"}`}>
                                {o.fulfillmentStatus || "UNFULFILLED"}
                              </span>
                            </td>
                            <td style={{ padding: "0.75rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                              {new Date(o.createdAt || Date.now()).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY SKU */}
          {activeTab === "inventory" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: "0.75rem", flex: 1, minWidth: "280px" }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                      type="text"
                      className="admin-input"
                      style={{ paddingLeft: "2.25rem" }}
                      placeholder="Search title, SKU..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="admin-input"
                    style={{ width: "160px" }}
                    value={inventoryCategoryFilter}
                    onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id || c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <button onClick={() => { setEditingProduct(null); setProductForm({ title: "", category: categories[0]?.name || "Outerwear", price: "", stock: "", sku: "", image: "", description: "", shippingInfo: "" }); setIsAddProductModalOpen(true); }} className="btn-gold">
                  <Plus size={16} /> ADD NEW SKU
                </button>
              </div>

              <div className="glass-panel" style={{ padding: "1.5rem" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                        <th style={{ padding: "0.75rem" }}>PRODUCT</th>
                        <th style={{ padding: "0.75rem" }}>SKU</th>
                        <th style={{ padding: "0.75rem" }}>CATEGORY</th>
                        <th style={{ padding: "0.75rem" }}>PRICE</th>
                        <th style={{ padding: "0.75rem" }}>STOCK</th>
                        <th style={{ padding: "0.75rem" }}>STATUS</th>
                        <th style={{ padding: "0.75rem", textAlign: "right" }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => (
                        <tr key={p.id || p._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                          <td style={{ padding: "0.75rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <img
                                src={p.image || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=200&auto=format&fit=crop"}
                                alt={p.title}
                                style={{ width: "40px", height: "48px", objectFit: "cover", borderRadius: "0.375rem" }}
                              />
                              <div>
                                <p style={{ fontWeight: 700 }}>{p.title || p.name}</p>
                                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{p.id}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "0.75rem", fontFamily: "monospace", color: "var(--accent-gold)" }}>{p.sku || "NYR-1001"}</td>
                          <td style={{ padding: "0.75rem" }}>{p.category || "Outerwear"}</td>
                          <td style={{ padding: "0.75rem", fontWeight: 700 }}>{formatPrice(p.price)}</td>
                          <td style={{ padding: "0.75rem", fontWeight: 700 }}>{p.stock}</td>
                          <td style={{ padding: "0.75rem" }}>
                            <span className={`badge-status ${p.stock > 10 ? "badge-in-stock" : p.stock > 0 ? "badge-low-stock" : "badge-out-of-stock"}`}>
                              {p.stock > 10 ? "IN STOCK" : p.stock > 0 ? "LOW STOCK" : "OUT OF STOCK"}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem", textAlign: "right" }}>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                              <button onClick={() => handleEditProductClick(p)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
                                <Edit size={16} />
                              </button>
                              <button onClick={() => handleDeleteProduct(p.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES MANAGEMENT */}
          {activeTab === "categories" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ position: "relative", minWidth: "280px" }}>
                  <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="text"
                    className="admin-input"
                    style={{ paddingLeft: "2.25rem" }}
                    placeholder="Search category name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryForm({ name: "", description: "", image: "", isFeatured: false, status: "ACTIVE" });
                    setIsAddCategoryModalOpen(true);
                  }}
                  className="btn-gold"
                >
                  <Plus size={16} /> ADD NEW CATEGORY
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
                {filteredCategories.map((cat) => {
                  const productCount = products.filter((p) => (p.category || "").toLowerCase() === (cat.name || "").toLowerCase()).length;
                  return (
                    <div
                      key={cat.id || cat._id}
                      className="glass-panel"
                      style={{
                        padding: "1.25rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        position: "relative",
                        overflow: "hidden"
                      }}
                    >
                      <div style={{ height: "160px", width: "100%", borderRadius: "0.5rem", overflow: "hidden", position: "relative" }}>
                        <img
                          src={cat.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop"}
                          alt={cat.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)" }} />

                        <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", display: "flex", gap: "0.5rem" }}>
                          {cat.isFeatured && (
                            <span style={{ padding: "0.2rem 0.5rem", borderRadius: "9999px", background: "var(--accent-gold)", color: "#000", fontWeight: 800, fontSize: "0.65rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                              <Sparkles size={10} /> FEATURED
                            </span>
                          )}
                          <span className={`badge-status ${cat.status === "ACTIVE" ? "badge-active" : "badge-out-of-stock"}`}>
                            {cat.status || "ACTIVE"}
                          </span>
                        </div>

                        <div style={{ position: "absolute", bottom: "0.75rem", left: "0.75rem" }}>
                          <h4 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>{cat.name}</h4>
                          <span style={{ fontSize: "0.75rem", color: "var(--accent-gold)", fontWeight: 700 }}>
                            /{cat.slug || cat.name.toLowerCase()}
                          </span>
                        </div>
                      </div>

                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                        {cat.description || "No description provided."}
                      </p>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: "1px solid var(--border-color)", fontSize: "0.8rem" }}>
                        <span style={{ color: "var(--text-muted)" }}>
                          Associated SKUs: <strong style={{ color: "var(--text-primary)" }}>{productCount}</strong>
                        </span>

                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => handleToggleCategoryStatus(cat.id, cat.status)}
                            className="btn-secondary"
                            style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                          >
                            Toggle Status
                          </button>
                          <button onClick={() => handleEditCategoryClick(cat)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "0.25rem" }}>
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDeleteCategory(cat.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "0.25rem" }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS & FULFILLMENT */}
          {activeTab === "orders" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <select className="admin-input" style={{ width: "200px" }} value={ordersStatusFilter} onChange={(e) => setOrdersStatusFilter(e.target.value)}>
                  <option value="All">All Fulfillment Statuses</option>
                  <option value="UNFULFILLED">Unfulfilled</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>

              <div className="glass-panel" style={{ padding: "1.5rem" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                        <th style={{ padding: "0.75rem" }}>ORDER ID</th>
                        <th style={{ padding: "0.75rem" }}>CUSTOMER</th>
                        <th style={{ padding: "0.75rem" }}>TOTAL</th>
                        <th style={{ padding: "0.75rem" }}>PAYMENT</th>
                        <th style={{ padding: "0.75rem" }}>FULFILLMENT</th>
                        <th style={{ padding: "0.75rem", textAlign: "right" }}>UPDATE STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((o) => (
                        <tr key={o.id || o._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                          <td style={{ padding: "0.75rem", fontWeight: 700, color: "var(--accent-gold)" }}>{o.id}</td>
                          <td style={{ padding: "0.75rem" }}>
                            <p style={{ fontWeight: 600 }}>{o.customer}</p>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{o.email}</p>
                          </td>
                          <td style={{ padding: "0.75rem", fontWeight: 700 }}>{formatPrice(o.total)}</td>
                          <td style={{ padding: "0.75rem" }}>
                            <span className="badge-status badge-paid">{o.paymentStatus || "PAID"}</span>
                          </td>
                          <td style={{ padding: "0.75rem" }}>
                            <span className={`badge-status ${o.fulfillmentStatus === "DELIVERED" ? "badge-paid" : o.fulfillmentStatus === "SHIPPED" ? "badge-active" : "badge-pending"}`}>
                              {o.fulfillmentStatus || "UNFULFILLED"}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem", textAlign: "right" }}>
                            <select
                              value={o.fulfillmentStatus || "UNFULFILLED"}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                              className="admin-input"
                              style={{ width: "140px", padding: "0.35rem 0.5rem", fontSize: "0.8rem" }}
                            >
                              <option value="UNFULFILLED">UNFULFILLED</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="DELIVERED">DELIVERED</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: USERS & ACCOUNTS */}
          {activeTab === "customers" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>MongoDB Registered Users ({users.length})</h3>
                <button onClick={() => setIsAddUserModalOpen(true)} className="btn-gold">
                  <UserPlus size={16} /> ADD USER ACCOUNT
                </button>
              </div>

              <div className="glass-panel" style={{ padding: "1.5rem" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                        <th style={{ padding: "0.75rem" }}>USER</th>
                        <th style={{ padding: "0.75rem" }}>EMAIL</th>
                        <th style={{ padding: "0.75rem" }}>PHONE</th>
                        <th style={{ padding: "0.75rem" }}>ROLE</th>
                        <th style={{ padding: "0.75rem", textAlign: "right" }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id || u.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                          <td style={{ padding: "0.75rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--accent-gold-soft)", color: "var(--accent-gold)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                                {u.name ? u.name[0].toUpperCase() : "U"}
                              </div>
                              <span style={{ fontWeight: 700 }}>{u.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: "0.75rem" }}>{u.email}</td>
                          <td style={{ padding: "0.75rem", color: "var(--text-muted)" }}>{u.phone || "+1 (555) 000-0000"}</td>
                          <td style={{ padding: "0.75rem" }}>
                            <select
                              value={u.role || "member"}
                              onChange={(e) => handleChangeUserRole(u._id, e.target.value)}
                              className="admin-input"
                              style={{ width: "120px", padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                            >
                              <option value="member">member</option>
                              <option value="admin">admin</option>
                              <option value="vip">vip</option>
                            </select>
                          </td>
                          <td style={{ padding: "0.75rem", textAlign: "right" }}>
                            <button onClick={() => handleDeleteUser(u._id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PROMO CODES */}
          {activeTab === "discounts" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Active Promo Vouchers</h3>
                <button onClick={() => setIsAddDiscountModalOpen(true)} className="btn-gold">
                  <Plus size={16} /> CREATE PROMO CODE
                </button>
              </div>

              <div className="glass-panel" style={{ padding: "1.5rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                      <th style={{ padding: "0.75rem" }}>CODE</th>
                      <th style={{ padding: "0.75rem" }}>TYPE</th>
                      <th style={{ padding: "0.75rem" }}>VALUE</th>
                      <th style={{ padding: "0.75rem" }}>USAGE</th>
                      <th style={{ padding: "0.75rem" }}>EXPIRES</th>
                      <th style={{ padding: "0.75rem", textAlign: "right" }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discounts.map((d) => (
                      <tr key={d.id || d._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                        <td style={{ padding: "0.75rem", fontWeight: 800, color: "var(--accent-gold)", letterSpacing: "0.05em" }}>{d.code}</td>
                        <td style={{ padding: "0.75rem" }}>{d.type}</td>
                        <td style={{ padding: "0.75rem", fontWeight: 700 }}>{d.type === "Percentage" ? `${d.value}% OFF` : `$${d.value}`}</td>
                        <td style={{ padding: "0.75rem" }}>{d.usage || "0 / 100"}</td>
                        <td style={{ padding: "0.75rem", color: "var(--text-muted)" }}>{d.expires || "Dec 31, 2026"}</td>
                        <td style={{ padding: "0.75rem", textAlign: "right" }}>
                          <button onClick={() => handleDeleteDiscount(d.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: REVIEWS */}
          {activeTab === "reviews" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Customer Reviews Moderation</h3>
              <div className="glass-panel" style={{ padding: "1.5rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                      <th style={{ padding: "0.75rem" }}>AUTHOR</th>
                      <th style={{ padding: "0.75rem" }}>PRODUCT</th>
                      <th style={{ padding: "0.75rem" }}>RATING</th>
                      <th style={{ padding: "0.75rem" }}>COMMENT</th>
                      <th style={{ padding: "0.75rem" }}>STATUS</th>
                      <th style={{ padding: "0.75rem", textAlign: "right" }}>MODERATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((r) => (
                      <tr key={r.id || r._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                        <td style={{ padding: "0.75rem", fontWeight: 600 }}>{r.author}</td>
                        <td style={{ padding: "0.75rem" }}>{r.product}</td>
                        <td style={{ padding: "0.75rem", color: "var(--accent-gold)" }}>{"★".repeat(r.rating || 5)}</td>
                        <td style={{ padding: "0.75rem", fontStyle: "italic" }}>"{r.comment}"</td>
                        <td style={{ padding: "0.75rem" }}>
                          <span className={`badge-status ${r.status === "APPROVED" ? "badge-approved" : "badge-rejected"}`}>{r.status}</span>
                        </td>
                        <td style={{ padding: "0.75rem", textAlign: "right" }}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                            <button
                              onClick={() => handleToggleReviewStatus(r.id, r.status)}
                              className="btn-secondary"
                              style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                            >
                              Toggle
                            </button>
                            <button onClick={() => handleDeleteReview(r.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: AUDIT & SECURITY LOGS */}
          {activeTab === "security" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Security & System Audit Logs</h3>
                <button onClick={clearAuditLogs} className="btn-secondary" style={{ color: "#ef4444" }}>
                  Clear Logs
                </button>
              </div>

              <div className="glass-panel" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      style={{
                        padding: "0.85rem 1rem",
                        borderRadius: "0.5rem",
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span
                          className={`badge-status ${
                            log.severity === "CRITICAL"
                              ? "badge-rejected"
                              : log.severity === "WARN"
                              ? "badge-pending"
                              : "badge-approved"
                          }`}
                        >
                          {log.severity}
                        </span>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{log.event}</p>
                          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{log.details}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Category Modal */}
      {isAddCategoryModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div className="glass-panel" style={{ maxWidth: "500px", width: "100%", padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>{editingCategory ? "Edit Category" : "Add New Category"}</h3>
              <button onClick={() => setIsAddCategoryModalOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveCategory} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>CATEGORY NAME</label>
                <input type="text" className="admin-input" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>DESCRIPTION</label>
                <textarea className="admin-input" rows={3} value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} placeholder="Collection details..." />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>COVER IMAGE URL</label>
                <input type="text" className="admin-input" value={categoryForm.image} onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })} placeholder="https://..." />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>STATUS</label>
                  <select className="admin-input" value={categoryForm.status} onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.value })}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
                  <input
                    type="checkbox"
                    id="isFeaturedCat"
                    checked={categoryForm.isFeatured}
                    onChange={(e) => setCategoryForm({ ...categoryForm, isFeatured: e.target.checked })}
                    style={{ width: "18px", height: "18px", accentColor: "var(--accent-gold)" }}
                  />
                  <label htmlFor="isFeaturedCat" style={{ fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
                    Featured Collection
                  </label>
                </div>
              </div>
              <button type="submit" className="btn-gold" style={{ marginTop: "1rem", justifyContent: "center" }}>
                SAVE CATEGORY TO MONGODB
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Product SKU Modal */}
      {isAddProductModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div className="glass-panel" style={{ maxWidth: "540px", width: "100%", padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>{editingProduct ? "Edit Product SKU" : "Add New Product SKU"}</h3>
              <button onClick={() => setIsAddProductModalOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>TITLE</label>
                <input type="text" className="admin-input" value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>CATEGORY</label>
                  <select className="admin-input" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}>
                    {categories.map((c) => (
                      <option key={c.id || c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>SKU CODE</label>
                  <input type="text" className="admin-input" value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} placeholder="NYR-8890" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>PRICE ($)</label>
                  <input type="number" step="0.01" className="admin-input" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>STOCK COUNT</label>
                  <input type="number" className="admin-input" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} required />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>IMAGE URL</label>
                <input type="text" className="admin-input" value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} placeholder="https://..." />
              </div>
              <button type="submit" className="btn-gold" style={{ marginTop: "1rem", justifyContent: "center" }}>
                SAVE SKU TO MONGODB
              </button>
            </form>
          </div>
        </div>
      )}

      {/* User Account Modal */}
      {isAddUserModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div className="glass-panel" style={{ maxWidth: "460px", width: "100%", padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Add User Account</h3>
              <button onClick={() => setIsAddUserModalOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>FULL NAME</label>
                <input type="text" className="admin-input" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>EMAIL ADDRESS</label>
                <input type="email" className="admin-input" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>PASSWORD</label>
                <input type="password" className="admin-input" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} placeholder="••••••••" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>ROLE</label>
                  <select className="admin-input" value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                    <option value="member">member</option>
                    <option value="admin">admin</option>
                    <option value="vip">vip</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>PHONE</label>
                  <input type="text" className="admin-input" value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <button type="submit" className="btn-gold" style={{ marginTop: "1rem", justifyContent: "center" }}>
                CREATE MONGODB USER
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Discount Voucher Modal */}
      {isAddDiscountModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div className="glass-panel" style={{ maxWidth: "460px", width: "100%", padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Create Promo Voucher</h3>
              <button onClick={() => setIsAddDiscountModalOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateDiscount} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>PROMO CODE</label>
                <input type="text" className="admin-input" value={discountForm.code} onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value.toUpperCase() })} placeholder="SUMMER25" required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>TYPE</label>
                  <select className="admin-input" value={discountForm.type} onChange={(e) => setDiscountForm({ ...discountForm, type: e.target.value })}>
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed Amount">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>VALUE</label>
                  <input type="number" className="admin-input" value={discountForm.value} onChange={(e) => setDiscountForm({ ...discountForm, value: e.target.value })} required />
                </div>
              </div>
              <button type="submit" className="btn-gold" style={{ marginTop: "1rem", justifyContent: "center" }}>
                GENERATE PROMO VOUCHER
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change PIN Modal */}
      {isPinModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div className="glass-panel" style={{ maxWidth: "420px", width: "100%", padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Change Security PIN</h3>
              <button onClick={() => setIsPinModalOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handlePinSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>CURRENT PIN</label>
                <input type="password" className="admin-input" maxLength={6} value={pinForm.currentPin} onChange={(e) => setPinForm({ ...pinForm, currentPin: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>NEW PIN (4-6 DIGITS)</label>
                <input type="password" className="admin-input" maxLength={6} value={pinForm.newPin} onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value })} required />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>CONFIRM NEW PIN</label>
                <input type="password" className="admin-input" maxLength={6} value={pinForm.confirmPin} onChange={(e) => setPinForm({ ...pinForm, confirmPin: e.target.value })} required />
              </div>
              <button type="submit" className="btn-gold" style={{ marginTop: "1rem", justifyContent: "center" }}>
                UPDATE MASTER PIN
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
