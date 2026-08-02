import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { AdminAuthGate } from "../components/AdminAuthGate";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  MessageSquare,
  Settings,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Shield,
  ShieldCheck,
  Lock,
  KeyRound,
  Sun,
  Moon,
  Eye,
  Trash2,
  Check,
  X,
  Edit,
  RefreshCw,
  SlidersHorizontal,
  Mail,
  Truck,
  CreditCard,
  Building,
  UserCheck,
  ChevronRight,
  FileText,
  Download,
  Filter,
  UserPlus,
  Printer,
  Sparkles,
  Send,
  MoreVertical,
  CheckSquare,
  Square
} from "lucide-react";

export const AdminView = () => {
  const {
    setView,
    showToast,
    formatPrice,
    isAdminAuthenticated,
    adminSession,
    lockAdminSession,
    auditLogs,
    updateAdminPinCode,
    logSecurityEvent,
    theme,
    toggleTheme
  } = useApp();

  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, inventory, orders, customers, discounts, reviews, settings, security
  const [searchQuery, setSearchQuery] = useState("");

  // Filter States
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState("All");
  const [inventoryStockFilter, setInventoryStockFilter] = useState("All");
  const [ordersStatusFilter, setOrdersStatusFilter] = useState("All");
  const [customersSegmentFilter, setCustomersSegmentFilter] = useState("All");
  const [reviewsRatingFilter, setReviewsRatingFilter] = useState("All");
  const [securityFilter, setSecurityFilter] = useState("All");

  // Selection States for Batch Actions
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  // Change PIN modal state
  const [isChangePinModalOpen, setIsChangePinModalOpen] = useState(false);
  const [pinChangeForm, setPinChangeForm] = useState({ currentPin: "", newPin: "", confirmPin: "" });

  // --- STATE FOR OPERATIONAL MODULES ---

  // Inventory State
  const [productsList, setProductsList] = useState([
    {
      id: "SKU-9012",
      title: "Merino Wool Wrap Coat",
      category: "Outerwear",
      sku: "MWW-COAT-001",
      stock: 42,
      price: 540,
      status: "In Stock",
      image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: "SKU-9013",
      title: "Technical Archetype Trench",
      category: "Outerwear",
      sku: "TAT-TRNC-002",
      stock: 8,
      price: 680,
      status: "Low Stock",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: "SKU-9014",
      title: "Ribbed Architectural Knit",
      category: "Essentials",
      sku: "RAK-KNIT-003",
      stock: 115,
      price: 240,
      status: "In Stock",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: "SKU-9015",
      title: "Sculptural Wool Trouser",
      category: "Tailoring",
      sku: "SWT-TRSR-004",
      stock: 0,
      price: 320,
      status: "Out of Stock",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: "SKU-9016",
      title: "Monolith Leather Tote",
      category: "Objects",
      sku: "MLT-TOTE-005",
      stock: 24,
      price: 490,
      status: "In Stock",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=300&auto=format&fit=crop"
    },
    {
      id: "SKU-9017",
      title: "Atmosphere Minimalist Sneaker",
      category: "Footwear",
      sku: "AMS-SNKR-006",
      stock: 19,
      price: 360,
      status: "In Stock",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=300&auto=format&fit=crop"
    }
  ]);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProductForm, setNewProductForm] = useState({
    title: "",
    category: "Outerwear",
    sku: "",
    price: "",
    stock: "",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=300&auto=format&fit=crop"
  });

  // Orders State
  const [ordersList, setOrdersList] = useState([
    {
      id: "#ORD-88219",
      date: "Today, 14:32",
      customer: "Soren Kjaer",
      email: "soren@designlab.dk",
      total: 1220.00,
      paymentStatus: "PAID",
      fulfillmentStatus: "UNFULFILLED",
      itemsCount: 2,
      trackingNumber: "AE-8891024-DK",
      shippingAddress: "Bredgade 42, Copenhagen, Denmark",
      items: [
        { name: "Technical Archetype Trench", qty: 1, price: 680 },
        { name: "Merino Wool Wrap Coat", qty: 1, price: 540 }
      ]
    },
    {
      id: "#ORD-88218",
      date: "Today, 11:15",
      customer: "Amara Vance",
      email: "amara@vance.co",
      total: 540.00,
      paymentStatus: "PAID",
      fulfillmentStatus: "SHIPPED",
      trackingNumber: "AE-9921041-US",
      shippingAddress: "148 Mercer St, New York, NY 10012",
      items: [
        { name: "Merino Wool Wrap Coat", qty: 1, price: 540 }
      ]
    },
    {
      id: "#ORD-88217",
      date: "Yesterday, 19:40",
      customer: "Kenji Sato",
      email: "kenji@sato.jp",
      total: 810.00,
      paymentStatus: "PAID",
      fulfillmentStatus: "DELIVERED",
      trackingNumber: "AE-7719023-JP",
      shippingAddress: "Minami-Aoyama 5-7, Tokyo, Japan",
      items: [
        { name: "Monolith Leather Tote", qty: 1, price: 490 },
        { name: "Sculptural Wool Trouser", qty: 1, price: 320 }
      ]
    },
    {
      id: "#ORD-88216",
      date: "Yesterday, 16:05",
      customer: "Elena Rostova",
      email: "elena@artelier.fr",
      total: 320.00,
      paymentStatus: "REFUNDED",
      fulfillmentStatus: "CANCELLED",
      trackingNumber: "N/A",
      shippingAddress: "Rue Saint-Honoré 213, Paris, France",
      items: [
        { name: "Sculptural Wool Trouser", qty: 1, price: 320 }
      ]
    }
  ]);
  const [selectedOrderDrawer, setSelectedOrderDrawer] = useState(null);

  // Customers State
  const [customersList, setCustomersList] = useState([
    {
      id: "CUST-101",
      name: "Soren Kjaer",
      email: "soren@designlab.dk",
      phone: "+45 31 90 22 11",
      segment: "VIP Client",
      ordersCount: 14,
      totalSpend: 14850.00,
      joined: "Jan 2024",
      notes: "Prefers minimalist gift wrap and express DHL shipping.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: "CUST-102",
      name: "Amara Vance",
      email: "amara@vance.co",
      phone: "+1 (555) 902-1188",
      segment: "VIP Client",
      ordersCount: 9,
      totalSpend: 8240.00,
      joined: "Mar 2024",
      notes: "Architect based in SoHo. Buys black/graphite monochrome pieces.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: "CUST-103",
      name: "Kenji Sato",
      email: "kenji@sato.jp",
      phone: "+81 3 5555 0192",
      segment: "Collector",
      ordersCount: 6,
      totalSpend: 5410.00,
      joined: "Nov 2024",
      notes: "Tokyo interior designer. Interested in Objects category.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
    },
    {
      id: "CUST-104",
      name: "Camille Laurent",
      email: "camille@studio.fr",
      phone: "+33 1 42 68 55 00",
      segment: "New Client",
      ordersCount: 2,
      totalSpend: 1160.00,
      joined: "Jan 2026",
      notes: "Parisian stylist.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
    }
  ]);
  const [selectedCustomerDrawer, setSelectedCustomerDrawer] = useState(null);

  // Discounts State
  const [discountsList, setDiscountsList] = useState([
    {
      id: "DISC-1",
      code: "SUMMER24",
      type: "Percentage",
      value: "20% OFF",
      usage: "142 / 200",
      status: "ACTIVE",
      expires: "Aug 31, 2026"
    },
    {
      id: "DISC-2",
      code: "WELCOME10",
      type: "Percentage",
      value: "10% OFF",
      usage: "894 / Unlimited",
      status: "ACTIVE",
      expires: "No Expiry"
    },
    {
      id: "DISC-3",
      code: "FREESHIP",
      type: "Free Shipping",
      value: "100% OFF Shipping",
      usage: "312 / 500",
      status: "ACTIVE",
      expires: "Dec 31, 2026"
    },
    {
      id: "DISC-4",
      code: "ARCHIVE30",
      type: "Fixed Amount",
      value: "$300 OFF",
      usage: "50 / 50",
      status: "EXPIRED",
      expires: "Jul 15, 2026"
    }
  ]);
  const [isAddDiscountModalOpen, setIsAddDiscountModalOpen] = useState(false);
  const [newDiscountForm, setNewDiscountForm] = useState({
    code: "",
    type: "Percentage",
    value: "",
    usageCap: "100"
  });

  // Reviews Moderation State
  const [reviewsList, setReviewsList] = useState([
    {
      id: "REV-901",
      author: "Julian H.",
      product: "Merino Wool Wrap Coat",
      rating: 5,
      date: "2 days ago",
      comment: "Exceptional weight and drape. The wool texture is unmatched. Worth every cent for timeless aesthetic.",
      status: "PENDING"
    },
    {
      id: "REV-902",
      author: "Sophie M.",
      product: "Technical Archetype Trench",
      rating: 5,
      date: "3 days ago",
      comment: "Subtle magnetic buttons are pure genius. Rain beads off effortlessly during downpours in Copenhagen.",
      status: "APPROVED"
    },
    {
      id: "REV-903",
      author: "Marcus T.",
      product: "Sculptural Wool Trouser",
      rating: 2,
      date: "5 days ago",
      comment: "Leg length is slightly longer than expected. Required tailoring at hem.",
      status: "PENDING"
    },
    {
      id: "REV-904",
      author: "SpamBot_99",
      product: "Ribbed Architectural Knit",
      rating: 1,
      date: "1 week ago",
      comment: "Cheap knockoff discount available at http://spam-link.xyz buy now!",
      status: "FLAGGED"
    }
  ]);

  // Store Settings & Team Permissions State
  const [settingsForm, setSettingsForm] = useState({
    storeName: "NIYARA Archive",
    supportEmail: "concierge@NIYARA.com",
    currency: "USD ($)",
    timezone: "UTC-5 (EST - New York)",
    taxRate: "8.875%",
    freeShippingThreshold: "$200.00",
    domesticExpressPrice: "$15.00",
    internationalShippingPrice: "$35.00",
    stripeConnected: true,
    paypalConnected: true,
    applePayConnected: true
  });

  const [teamMembers, setTeamMembers] = useState([
    { name: "Julian Vanderveld", email: "julian.v@NIYARA.com", role: "Super Admin", access: "Full Control", avatar: "JV" },
    { name: "Elena Rostova", email: "elena.r@NIYARA.com", role: "Senior Manager", access: "Orders & Inventory", avatar: "ER" },
    { name: "Marcus Vance", email: "marcus.v@NIYARA.com", role: "Inventory Lead", access: "Catalog & Restock", avatar: "MV" }
  ]);
  const [isInviteTeamModalOpen, setIsInviteTeamModalOpen] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({ name: "", email: "", role: "Senior Manager" });

  if (!isAdminAuthenticated) {
    return <AdminAuthGate />;
  }

  // --- FILTERED DATA LOGIC ---

  const filteredProducts = productsList.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = inventoryCategoryFilter === "All" || p.category === inventoryCategoryFilter;
    const matchesStock = inventoryStockFilter === "All" || p.status === inventoryStockFilter;
    return matchesSearch && matchesCategory && matchesStock;
  });

  const filteredOrders = ordersList.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.customer.toLowerCase().includes(searchQuery.toLowerCase()) || o.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = ordersStatusFilter === "All" || o.fulfillmentStatus === ordersStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCustomers = customersList.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSegment = customersSegmentFilter === "All" || c.segment === customersSegmentFilter;
    return matchesSearch && matchesSegment;
  });

  const filteredReviews = reviewsList.filter((r) => {
    const matchesSearch = r.product.toLowerCase().includes(searchQuery.toLowerCase()) || r.author.toLowerCase().includes(searchQuery.toLowerCase()) || r.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = reviewsRatingFilter === "All" || r.rating === parseInt(reviewsRatingFilter);
    return matchesSearch && matchesRating;
  });

  // --- HANDLERS ---

  const handleRestockProduct = (id) => {
    setProductsList((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStock = p.stock + 10;
          return {
            ...p,
            stock: newStock,
            status: newStock > 10 ? "In Stock" : newStock > 0 ? "Low Stock" : "Out of Stock"
          };
        }
        return p;
      })
    );
    showToast("Added +10 units to SKU stock level");
  };

  const handleBatchRestock = () => {
    if (selectedProductIds.length === 0) return;
    setProductsList((prev) =>
      prev.map((p) => {
        if (selectedProductIds.includes(p.id)) {
          const newStock = p.stock + 20;
          return {
            ...p,
            stock: newStock,
            status: newStock > 10 ? "In Stock" : newStock > 0 ? "Low Stock" : "Out of Stock"
          };
        }
        return p;
      })
    );
    showToast(`Batch restocked +20 units for ${selectedProductIds.length} items`);
    setSelectedProductIds([]);
  };

  const handleDeleteProduct = (id) => {
    setProductsList((prev) => prev.filter((p) => p.id !== id));
    showToast("Product deleted from catalog");
  };

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProductForm.title || !newProductForm.price || !newProductForm.stock) {
      showToast("Please fill in required fields");
      return;
    }
    const newProd = {
      id: editingProduct ? editingProduct.id : `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newProductForm.title,
      category: newProductForm.category,
      sku: newProductForm.sku || `NYR-${Math.floor(1000 + Math.random() * 9000)}`,
      price: parseFloat(newProductForm.price),
      stock: parseInt(newProductForm.stock),
      status: parseInt(newProductForm.stock) > 10 ? "In Stock" : parseInt(newProductForm.stock) > 0 ? "Low Stock" : "Out of Stock",
      image: newProductForm.image
    };

    if (editingProduct) {
      setProductsList((prev) => prev.map((p) => (p.id === editingProduct.id ? newProd : p)));
      showToast(`Updated SKU ${newProd.sku}`);
      setEditingProduct(null);
    } else {
      setProductsList([newProd, ...productsList]);
      showToast(`Added ${newProd.title} to Catalog`);
    }

    setIsAddProductModalOpen(false);
    setNewProductForm({ title: "", category: "Outerwear", sku: "", price: "", stock: "", image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=300&auto=format&fit=crop" });
  };

  const openEditProductModal = (prod) => {
    setEditingProduct(prod);
    setNewProductForm({
      title: prod.title,
      category: prod.category,
      sku: prod.sku,
      price: prod.price.toString(),
      stock: prod.stock.toString(),
      image: prod.image
    });
    setIsAddProductModalOpen(true);
  };

  const handleFulfillOrder = (orderId) => {
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, fulfillmentStatus: "SHIPPED", trackingNumber: `AE-${Math.floor(1000000 + Math.random() * 9000000)}-EX` } : o))
    );
    showToast(`Marked ${orderId} as SHIPPED`);
  };

  const handleRefundOrder = (orderId) => {
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: "REFUNDED", fulfillmentStatus: "CANCELLED" } : o))
    );
    showToast(`Processed refund for ${orderId}`);
  };

  const handleAddDiscountSubmit = (e) => {
    e.preventDefault();
    if (!newDiscountForm.code || !newDiscountForm.value) {
      showToast("Please enter promo code and value");
      return;
    }
    const newDisc = {
      id: `DISC-${Date.now()}`,
      code: newDiscountForm.code.toUpperCase(),
      type: newDiscountForm.type,
      value: newDiscountForm.value,
      usage: `0 / ${newDiscountForm.usageCap}`,
      status: "ACTIVE",
      expires: "Dec 31, 2026"
    };
    setDiscountsList([newDisc, ...discountsList]);
    setIsAddDiscountModalOpen(false);
    setNewDiscountForm({ code: "", type: "Percentage", value: "", usageCap: "100" });
    showToast(`Published promo voucher ${newDisc.code}`);
  };

  const handleToggleDiscountStatus = (id) => {
    setDiscountsList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: d.status === "ACTIVE" ? "PAUSED" : "ACTIVE" } : d))
    );
    showToast("Updated promo voucher status");
  };

  const handleModerateReview = (reviewId, newStatus) => {
    setReviewsList((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r))
    );
    showToast(`Review marked as ${newStatus}`);
  };

  const handleDeleteReview = (reviewId) => {
    setReviewsList((prev) => prev.filter((r) => r.id !== reviewId));
    showToast("Review deleted");
  };

  const handleInviteTeamSubmit = (e) => {
    e.preventDefault();
    if (!newTeamMember.name || !newTeamMember.email) return;
    const initials = newTeamMember.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    const member = {
      name: newTeamMember.name,
      email: newTeamMember.email,
      role: newTeamMember.role,
      access: newTeamMember.role === "Super Admin" ? "Full Control" : "Orders & Inventory",
      avatar: initials
    };
    setTeamMembers([...teamMembers, member]);
    setIsInviteTeamModalOpen(false);
    setNewTeamMember({ name: "", email: "", role: "Senior Manager" });
    showToast(`Invited ${member.name} to Admin Team`);
  };

  const handleExportCSV = (tableName) => {
    showToast(`Exported ${tableName} data report (CSV)`);
  };

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}>
      
      {/* TOP ADMIN SYSTEM BAR */}
      <div
        style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-light)",
          padding: "0.75rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px #10b981" }} />
            <span style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "var(--accent-camel)" }}>
              NIYARA OPERATIONAL TERMINAL v3.4
            </span>
          </div>
          <span style={{ color: "var(--border-light)" }}>|</span>
          <div style={{ position: "relative", width: "320px" }}>
            <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Global Search (SKUs, Orders, Clients)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                background: "var(--bg-primary)",
                border: "1px solid var(--border-light)",
                borderRadius: "4px",
                padding: "0.4rem 0.75rem 0.4rem 2rem",
                fontSize: "0.75rem",
                color: "var(--text-primary)",
                outline: "none"
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border-light)",
              color: "var(--text-primary)",
              padding: "0.4rem 0.75rem",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>

          {/* Change Security PIN */}
          <button
            onClick={() => setIsChangePinModalOpen(true)}
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border-light)",
              color: "var(--text-primary)",
              padding: "0.4rem 0.75rem",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <KeyRound size={14} />
            <span>Change PIN</span>
          </button>

          {/* Lock Session Button */}
          <button
            onClick={lockAdminSession}
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid #ef4444",
              color: "#ef4444",
              padding: "0.4rem 0.75rem",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <Lock size={14} />
            <span>Lock Session</span>
          </button>

          {/* Operator Identity Pill */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--accent-camel)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.7rem" }}>
              {adminSession.user ? adminSession.user.split(" ").map(n => n[0]).join("") : "AD"}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, lineHeight: 1 }}>{adminSession.user}</span>
              <span style={{ fontSize: "0.6rem", color: "var(--accent-camel)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>{adminSession.role}</span>
            </div>
          </div>

          <button
            onClick={() => setView("home")}
            style={{
              background: "var(--accent-camel)",
              border: "none",
              color: "#ffffff",
              padding: "0.45rem 1rem",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              transition: "opacity 0.2s"
            }}
          >
            <span>Storefront</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT: SIDEBAR + CONTENT AREA */}
      <div style={{ display: "flex", minHeight: "calc(100vh - 53px)" }}>
        
        {/* SIDEBAR NAVIGATION */}
        <aside
          style={{
            width: "260px",
            background: "var(--bg-surface)",
            borderRight: "1px solid var(--border-light)",
            padding: "1.5rem 1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            flexShrink: 0
          }}
        >
          <div style={{ padding: "0 0.5rem 1rem 0.5rem", borderBottom: "1px solid var(--border-light)", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>
              Management Suite
            </span>
          </div>

          {[
            { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard, badge: null },
            { id: "inventory", label: "Inventory Catalog", icon: Package, badge: productsList.filter(p => p.stock < 10).length || null },
            { id: "orders", label: "Orders & Fulfillment", icon: ShoppingBag, badge: ordersList.filter(o => o.fulfillmentStatus === "UNFULFILLED").length || null },
            { id: "customers", label: "Customer Registry", icon: Users, badge: customersList.length },
            { id: "discounts", label: "Discounts & Marketing", icon: Tag, badge: discountsList.filter(d => d.status === "ACTIVE").length },
            { id: "reviews", label: "Reviews Moderation", icon: MessageSquare, badge: reviewsList.filter(r => r.status === "PENDING").length || null },
            { id: "security", label: "Security & Audit Logs", icon: ShieldCheck, badge: auditLogs.length },
            { id: "settings", label: "Store Settings", icon: Settings, badge: null }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 1rem",
                  borderRadius: "6px",
                  border: "none",
                  background: isActive ? "var(--bg-primary)" : "transparent",
                  color: isActive ? "var(--accent-camel)" : "var(--text-primary)",
                  cursor: "pointer",
                  fontSize: "0.8125rem",
                  fontWeight: isActive ? 600 : 400,
                  transition: "all 0.15s ease",
                  textAlign: "left"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Icon size={17} style={{ opacity: isActive ? 1 : 0.7 }} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== null && (
                  <span
                    style={{
                      fontSize: "0.65rem",
                      background: isActive ? "var(--accent-camel)" : "var(--border-light)",
                      color: isActive ? "#ffffff" : "var(--text-primary)",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "10px",
                      fontWeight: 700
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* CONTENT DISPLAY PANELS */}
        <main style={{ flex: 1, padding: "2rem 2.5rem", background: "var(--bg-primary)", overflowY: "auto" }}>
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 400, margin: 0 }}>Executive Overview</h1>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Real-time performance summary and business metrics.</p>
                </div>
                <button
                  onClick={() => handleExportCSV("Executive Dashboard")}
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-primary)",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}
                >
                  <Download size={14} />
                  <span>Export Report</span>
                </button>
              </div>

              {/* KPI Metric Cards Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
                {[
                  { title: "Total Revenue", val: "$128,430.00", change: "+14.2%", positive: true, sub: "vs $112.4k last month", icon: DollarSign },
                  { title: "Today's Orders", val: "142", change: "+8.5%", positive: true, sub: "38 orders pending ship", icon: ShoppingBag },
                  { title: "Avg Order Value", val: "$284.50", change: "+3.1%", positive: true, sub: "High tier cart items", icon: TrendingUp },
                  { title: "Conversion Rate", val: "3.82%", change: "-0.2%", positive: false, sub: "48,290 store sessions", icon: Users }
                ].map((kpi, idx) => {
                  const IconComponent = kpi.icon;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-light)",
                        borderRadius: "8px",
                        padding: "1.25rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.08em", fontWeight: 600 }}>{kpi.title}</span>
                        <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-camel)" }}>
                          <IconComponent size={16} />
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: "1.6rem", fontWeight: 600, fontFamily: "var(--font-serif)" }}>{kpi.val}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem" }}>
                        <span style={{ color: kpi.positive ? "#10b981" : "#ef4444", fontWeight: 600, display: "flex", alignItems: "center" }}>
                          {kpi.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {kpi.change}
                        </span>
                        <span style={{ color: "var(--text-muted)" }}>• {kpi.sub}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* REVENUE VISUAL CHART & RECENT ACTIVITY */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
                
                {/* Visual Revenue Trajectory */}
                <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                    <div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>Revenue & Trajectory Visual</h3>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Monthly revenue growth in USD</span>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button style={{ padding: "0.35rem 0.85rem", fontSize: "0.7rem", background: "var(--accent-camel)", color: "#fff", border: "none", borderRadius: "4px", fontWeight: 600, cursor: "pointer" }}>Monthly</button>
                      <button style={{ padding: "0.35rem 0.85rem", fontSize: "0.7rem", background: "var(--bg-primary)", color: "var(--text-muted)", border: "1px solid var(--border-light)", borderRadius: "4px", cursor: "pointer" }}>Weekly</button>
                    </div>
                  </div>

                  {/* Bar Visual Representation */}
                  <div style={{ height: "220px", display: "flex", alignItems: "flex-end", gap: "1.2rem", paddingBottom: "1rem", paddingTop: "1.5rem", borderBottom: "1px solid var(--border-light)" }}>
                    {[
                      { month: "Jan", val: 65, revenue: "$65,000" },
                      { month: "Feb", val: 78, revenue: "$78,000" },
                      { month: "Mar", val: 82, revenue: "$82,000" },
                      { month: "Apr", val: 71, revenue: "$71,000" },
                      { month: "May", val: 95, revenue: "$95,000" },
                      { month: "Jun", val: 112, revenue: "$112,000" },
                      { month: "Jul", val: 128, revenue: "$128,430" }
                    ].map((item, idx) => {
                      const barHeight = Math.round((item.val / 130) * 115);
                      return (
                        <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
                          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: idx === 6 ? 600 : 400, whiteSpace: "nowrap" }}>{item.revenue}</span>
                          <div
                            style={{
                              width: "100%",
                              height: `${barHeight}px`,
                              background: idx === 6 ? "var(--accent-camel)" : "var(--border-light)",
                              borderRadius: "4px 4px 0 0",
                              transition: "all 0.3s ease"
                            }}
                            title={`${item.month}: ${item.revenue}`}
                          />
                          <span style={{ fontSize: "0.75rem", color: "var(--text-primary)", fontWeight: idx === 6 ? 700 : 400 }}>{item.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Selling Products Feed */}
                <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "1.5rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 1rem 0" }}>Top Selling Items</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {productsList.slice(0, 4).map((item, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <img src={item.image} alt={item.title} style={{ width: "40px", height: "40px", borderRadius: "4px", objectFit: "cover" }} />
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{item.title}</span>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{item.category} • {item.sku}</span>
                          </div>
                        </div>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--accent-camel)" }}>{formatPrice(item.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY MANAGEMENT */}
          {activeTab === "inventory" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 400, margin: 0 }}>Inventory Catalog</h1>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Manage SKU stock levels, product catalog, and pricing.</p>
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => handleExportCSV("Inventory Catalog")}
                    style={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-light)",
                      color: "var(--text-primary)",
                      padding: "0.6rem 1rem",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem"
                    }}
                  >
                    <Download size={14} />
                    <span>CSV</span>
                  </button>
                  {selectedProductIds.length > 0 && (
                    <button
                      onClick={handleBatchRestock}
                      style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--accent-camel)",
                        color: "var(--accent-camel)",
                        padding: "0.6rem 1rem",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      Restock Selected ({selectedProductIds.length})
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setNewProductForm({ title: "", category: "Outerwear", sku: "", price: "", stock: "", image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=300&auto=format&fit=crop" });
                      setIsAddProductModalOpen(true);
                    }}
                    style={{
                      background: "var(--accent-camel)",
                      color: "#ffffff",
                      border: "none",
                      padding: "0.6rem 1.25rem",
                      borderRadius: "4px",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <Plus size={16} />
                    <span>Add New SKU</span>
                  </button>
                </div>
              </div>

              {/* Sub-Filters Bar */}
              <div style={{ display: "flex", gap: "1rem", background: "var(--bg-surface)", padding: "0.75rem 1rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Filter size={14} style={{ color: "var(--text-muted)" }} />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Category:</span>
                  {["All", "Outerwear", "Essentials", "Tailoring", "Objects", "Footwear"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setInventoryCategoryFilter(cat)}
                      style={{
                        background: inventoryCategoryFilter === cat ? "var(--accent-camel)" : "transparent",
                        color: inventoryCategoryFilter === cat ? "#fff" : "var(--text-primary)",
                        border: "none",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        cursor: "pointer"
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Stock:</span>
                  {["All", "In Stock", "Low Stock", "Out of Stock"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setInventoryStockFilter(st)}
                      style={{
                        background: inventoryStockFilter === st ? "var(--accent-camel)" : "transparent",
                        color: inventoryStockFilter === st ? "#fff" : "var(--text-primary)",
                        border: "none",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        cursor: "pointer"
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Table */}
              <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "8px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8125rem" }}>
                  <thead>
                    <tr style={{ background: "var(--bg-primary)", borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      <th style={{ padding: "1rem", width: "40px" }}>
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) setSelectedProductIds(filteredProducts.map(p => p.id));
                            else setSelectedProductIds([]);
                          }}
                        />
                      </th>
                      <th style={{ padding: "1rem" }}>Product</th>
                      <th style={{ padding: "1rem" }}>SKU</th>
                      <th style={{ padding: "1rem" }}>Category</th>
                      <th style={{ padding: "1rem" }}>Price</th>
                      <th style={{ padding: "1rem" }}>Stock Level</th>
                      <th style={{ padding: "1rem" }}>Status</th>
                      <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                        <td style={{ padding: "1rem" }}>
                          <input
                            type="checkbox"
                            checked={selectedProductIds.includes(prod.id)}
                            onChange={() => {
                              setSelectedProductIds(prev =>
                                prev.includes(prod.id) ? prev.filter(id => id !== prod.id) : [...prev, prod.id]
                              );
                            }}
                          />
                        </td>
                        <td style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <img src={prod.image} alt={prod.title} style={{ width: "42px", height: "42px", borderRadius: "4px", objectFit: "cover" }} />
                          <span style={{ fontWeight: 600 }}>{prod.title}</span>
                        </td>
                        <td style={{ padding: "1rem", color: "var(--text-muted)", fontFamily: "monospace" }}>{prod.sku}</td>
                        <td style={{ padding: "1rem" }}>{prod.category}</td>
                        <td style={{ padding: "1rem", fontWeight: 600 }}>{formatPrice(prod.price)}</td>
                        <td style={{ padding: "1rem" }}>
                          <span style={{ fontWeight: 700 }}>{prod.stock} units</span>
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <span
                            style={{
                              padding: "0.25rem 0.6rem",
                              borderRadius: "12px",
                              fontSize: "0.6875rem",
                              fontWeight: 700,
                              background: prod.stock > 10 ? "rgba(16, 185, 129, 0.15)" : prod.stock > 0 ? "rgba(245, 158, 11, 0.15)" : "rgba(239, 68, 68, 0.15)",
                              color: prod.stock > 10 ? "#10b981" : prod.stock > 0 ? "#f59e0b" : "#ef4444"
                            }}
                          >
                            {prod.status}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "0.3rem", justifyContent: "flex-end" }}>
                            <button
                              onClick={() => handleRestockProduct(prod.id)}
                              style={{
                                background: "var(--bg-primary)",
                                border: "1px solid var(--border-light)",
                                color: "var(--text-primary)",
                                padding: "0.35rem 0.6rem",
                                borderRadius: "4px",
                                fontSize: "0.7rem",
                                cursor: "pointer"
                              }}
                              title="Restock +10"
                            >
                              <RefreshCw size={12} />
                            </button>
                            <button
                              onClick={() => openEditProductModal(prod)}
                              style={{
                                background: "var(--bg-primary)",
                                border: "1px solid var(--border-light)",
                                color: "var(--text-primary)",
                                padding: "0.35rem 0.6rem",
                                borderRadius: "4px",
                                fontSize: "0.7rem",
                                cursor: "pointer"
                              }}
                              title="Edit SKU"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              style={{
                                background: "rgba(239, 68, 68, 0.15)",
                                border: "none",
                                color: "#ef4444",
                                padding: "0.35rem 0.6rem",
                                borderRadius: "4px",
                                fontSize: "0.7rem",
                                cursor: "pointer"
                              }}
                              title="Delete SKU"
                            >
                              <Trash2 size={12} />
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

          {/* TAB 3: ORDERS & FULFILLMENT */}
          {activeTab === "orders" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 400, margin: 0 }}>Orders & Fulfillment</h1>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Process store transactions, trigger shipment, and manage refunds.</p>
                </div>
                <button
                  onClick={() => handleExportCSV("Orders & Fulfillment")}
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-primary)",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}
                >
                  <Download size={14} />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Status Filter Tabs */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {["All", "UNFULFILLED", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrdersStatusFilter(st)}
                    style={{
                      padding: "0.4rem 0.85rem",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      border: "1px solid var(--border-light)",
                      background: ordersStatusFilter === st ? "var(--accent-camel)" : "var(--bg-surface)",
                      color: ordersStatusFilter === st ? "#fff" : "var(--text-primary)",
                      cursor: "pointer"
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Data Table */}
              <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "8px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8125rem" }}>
                  <thead>
                    <tr style={{ background: "var(--bg-primary)", borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      <th style={{ padding: "1rem" }}>Order ID</th>
                      <th style={{ padding: "1rem" }}>Date</th>
                      <th style={{ padding: "1rem" }}>Customer</th>
                      <th style={{ padding: "1rem" }}>Total</th>
                      <th style={{ padding: "1rem" }}>Payment</th>
                      <th style={{ padding: "1rem" }}>Fulfillment</th>
                      <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                        <td style={{ padding: "1rem", fontWeight: 700, fontFamily: "monospace" }}>{ord.id}</td>
                        <td style={{ padding: "1rem", color: "var(--text-muted)" }}>{ord.date}</td>
                        <td style={{ padding: "1rem" }}>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontWeight: 600 }}>{ord.customer}</span>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{ord.email}</span>
                          </div>
                        </td>
                        <td style={{ padding: "1rem", fontWeight: 600 }}>${ord.total.toFixed(2)}</td>
                        <td style={{ padding: "1rem" }}>
                          <span
                            style={{
                              padding: "0.2rem 0.5rem",
                              borderRadius: "4px",
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              background: ord.paymentStatus === "PAID" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                              color: ord.paymentStatus === "PAID" ? "#10b981" : "#ef4444"
                            }}
                          >
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <span
                            style={{
                              padding: "0.2rem 0.5rem",
                              borderRadius: "4px",
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              background: ord.fulfillmentStatus === "DELIVERED" ? "rgba(16, 185, 129, 0.15)" : ord.fulfillmentStatus === "SHIPPED" ? "rgba(59, 130, 246, 0.15)" : "rgba(245, 158, 11, 0.15)",
                              color: ord.fulfillmentStatus === "DELIVERED" ? "#10b981" : ord.fulfillmentStatus === "SHIPPED" ? "#3b82f6" : "#f59e0b"
                            }}
                          >
                            {ord.fulfillmentStatus}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                            {ord.fulfillmentStatus === "UNFULFILLED" && (
                              <button
                                onClick={() => handleFulfillOrder(ord.id)}
                                style={{
                                  background: "#10b981",
                                  color: "#fff",
                                  border: "none",
                                  padding: "0.3rem 0.6rem",
                                  borderRadius: "4px",
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                  cursor: "pointer"
                                }}
                              >
                                Ship Order
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedOrderDrawer(ord)}
                              style={{
                                background: "var(--bg-primary)",
                                border: "1px solid var(--border-light)",
                                color: "var(--text-primary)",
                                padding: "0.3rem 0.6rem",
                                borderRadius: "4px",
                                fontSize: "0.7rem",
                                cursor: "pointer"
                              }}
                            >
                              Invoice
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

          {/* TAB 4: CUSTOMER REGISTRY */}
          {activeTab === "customers" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 400, margin: 0 }}>Customer Registry</h1>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>VIP tier profiles, order counts, and lifetime value analytics.</p>
                </div>
                <button
                  onClick={() => handleExportCSV("Customer Registry")}
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-primary)",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}
                >
                  <Download size={14} />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Customer Segment Filters */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {["All", "VIP Client", "Collector", "New Client"].map((seg) => (
                  <button
                    key={seg}
                    onClick={() => setCustomersSegmentFilter(seg)}
                    style={{
                      padding: "0.4rem 0.85rem",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      border: "1px solid var(--border-light)",
                      background: customersSegmentFilter === seg ? "var(--accent-camel)" : "var(--bg-surface)",
                      color: customersSegmentFilter === seg ? "#fff" : "var(--text-primary)",
                      cursor: "pointer"
                    }}
                  >
                    {seg}
                  </button>
                ))}
              </div>

              {/* Customer Table */}
              <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "8px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8125rem" }}>
                  <thead>
                    <tr style={{ background: "var(--bg-primary)", borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      <th style={{ padding: "1rem" }}>Client</th>
                      <th style={{ padding: "1rem" }}>Segment Tag</th>
                      <th style={{ padding: "1rem" }}>Total Orders</th>
                      <th style={{ padding: "1rem" }}>Lifetime Value (LTV)</th>
                      <th style={{ padding: "1rem" }}>Member Since</th>
                      <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((c) => (
                      <tr key={c.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                        <td style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <img src={c.avatar} alt={c.name} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontWeight: 600 }}>{c.name}</span>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{c.email}</span>
                          </div>
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <span style={{ padding: "0.2rem 0.5rem", borderRadius: "10px", fontSize: "0.65rem", fontWeight: 700, background: "rgba(197, 160, 114, 0.2)", color: "var(--accent-camel)" }}>
                            {c.segment}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", fontWeight: 600 }}>{c.ordersCount} orders</td>
                        <td style={{ padding: "1rem", fontWeight: 700, color: "#10b981" }}>${c.totalSpend.toLocaleString()}</td>
                        <td style={{ padding: "1rem", color: "var(--text-muted)" }}>{c.joined}</td>
                        <td style={{ padding: "1rem", textAlign: "right" }}>
                          <button
                            onClick={() => setSelectedCustomerDrawer(c)}
                            style={{
                              background: "var(--bg-primary)",
                              border: "1px solid var(--border-light)",
                              color: "var(--text-primary)",
                              padding: "0.3rem 0.65rem",
                              borderRadius: "4px",
                              fontSize: "0.7rem",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem"
                            }}
                          >
                            <Eye size={12} />
                            <span>Profile</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: DISCOUNTS & MARKETING */}
          {activeTab === "discounts" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 400, margin: 0 }}>Discounts & Marketing</h1>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Promotional codes, campaign vouchers, and redemptions.</p>
                </div>
                <button
                  onClick={() => setIsAddDiscountModalOpen(true)}
                  style={{
                    background: "var(--accent-camel)",
                    color: "#ffffff",
                    border: "none",
                    padding: "0.6rem 1.25rem",
                    borderRadius: "4px",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <Plus size={16} />
                  <span>Create Promo Code</span>
                </button>
              </div>

              {/* Discounts Table */}
              <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "8px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8125rem" }}>
                  <thead>
                    <tr style={{ background: "var(--bg-primary)", borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      <th style={{ padding: "1rem" }}>Code</th>
                      <th style={{ padding: "1rem" }}>Type</th>
                      <th style={{ padding: "1rem" }}>Value</th>
                      <th style={{ padding: "1rem" }}>Redemptions</th>
                      <th style={{ padding: "1rem" }}>Expiration</th>
                      <th style={{ padding: "1rem" }}>Status</th>
                      <th style={{ padding: "1rem", textAlign: "right" }}>Toggle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discountsList.map((d) => (
                      <tr key={d.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                        <td style={{ padding: "1rem", fontWeight: 700, fontFamily: "monospace", color: "var(--accent-camel)" }}>{d.code}</td>
                        <td style={{ padding: "1rem" }}>{d.type}</td>
                        <td style={{ padding: "1rem", fontWeight: 600 }}>{d.value}</td>
                        <td style={{ padding: "1rem", color: "var(--text-muted)" }}>{d.usage}</td>
                        <td style={{ padding: "1rem", color: "var(--text-muted)" }}>{d.expires}</td>
                        <td style={{ padding: "1rem" }}>
                          <span
                            style={{
                              padding: "0.2rem 0.5rem",
                              borderRadius: "4px",
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              background: d.status === "ACTIVE" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                              color: d.status === "ACTIVE" ? "#10b981" : "#ef4444"
                            }}
                          >
                            {d.status}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", textAlign: "right" }}>
                          <button
                            onClick={() => handleToggleDiscountStatus(d.id)}
                            style={{
                              background: "var(--bg-primary)",
                              border: "1px solid var(--border-light)",
                              color: "var(--text-primary)",
                              padding: "0.3rem 0.6rem",
                              borderRadius: "4px",
                              fontSize: "0.7rem",
                              cursor: "pointer"
                            }}
                          >
                            {d.status === "ACTIVE" ? "Pause" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: REVIEWS MODERATION */}
          {activeTab === "reviews" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 400, margin: 0 }}>Reviews Moderation</h1>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Moderate client feedback, approve ratings, and flag spam.</p>
                </div>
                {/* Rating Filter Pills */}
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  {["All", "5", "4", "3", "2", "1"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setReviewsRatingFilter(r)}
                      style={{
                        padding: "0.3rem 0.6rem",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        border: "1px solid var(--border-light)",
                        background: reviewsRatingFilter === r ? "var(--accent-camel)" : "var(--bg-surface)",
                        color: reviewsRatingFilter === r ? "#fff" : "var(--text-primary)",
                        cursor: "pointer"
                      }}
                    >
                      {r === "All" ? "All Ratings" : `${r}★`}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    style={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-light)",
                      borderRadius: "8px",
                      padding: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{rev.author}</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>on <strong>{rev.product}</strong></span>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>• {rev.date}</span>
                      </div>
                      <span
                        style={{
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          background: rev.status === "APPROVED" ? "rgba(16, 185, 129, 0.15)" : rev.status === "PENDING" ? "rgba(245, 158, 11, 0.15)" : "rgba(239, 68, 68, 0.15)",
                          color: rev.status === "APPROVED" ? "#10b981" : rev.status === "PENDING" ? "#f59e0b" : "#ef4444"
                        }}
                      >
                        {rev.status}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "0.25rem", color: "#f59e0b", fontSize: "0.8rem" }}>
                      {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                    </div>

                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: 1.5 }}>
                      "{rev.comment}"
                    </p>

                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                      {rev.status !== "APPROVED" && (
                        <button
                          onClick={() => handleModerateReview(rev.id, "APPROVED")}
                          style={{
                            background: "#10b981",
                            color: "#fff",
                            border: "none",
                            padding: "0.3rem 0.75rem",
                            borderRadius: "4px",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.3rem"
                          }}
                        >
                          <Check size={12} />
                          <span>Approve</span>
                        </button>
                      )}
                      {rev.status !== "FLAGGED" && (
                        <button
                          onClick={() => handleModerateReview(rev.id, "FLAGGED")}
                          style={{
                            background: "rgba(245, 158, 11, 0.2)",
                            color: "#f59e0b",
                            border: "none",
                            padding: "0.3rem 0.75rem",
                            borderRadius: "4px",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.3rem"
                          }}
                        >
                          <AlertTriangle size={12} />
                          <span>Flag</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        style={{
                          background: "rgba(239, 68, 68, 0.15)",
                          color: "#ef4444",
                          border: "none",
                          padding: "0.3rem 0.75rem",
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem"
                        }}
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: STORE SETTINGS & TEAM PERMISSIONS */}
          {activeTab === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 400, margin: 0 }}>Store & Team Configuration</h1>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Payment gateways, shipping profiles, tax rules, and team permissions.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                {/* General Settings */}
                <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Building size={16} /> General Store Details
                  </h3>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Store Title</label>
                    <input type="text" value={settingsForm.storeName} onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: "var(--bg-primary)", border: "1px solid var(--border-light)", color: "var(--text-primary)", borderRadius: "4px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Concierge Support Email</label>
                    <input type="email" value={settingsForm.supportEmail} onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: "var(--bg-primary)", border: "1px solid var(--border-light)", color: "var(--text-primary)", borderRadius: "4px" }} />
                  </div>
                </div>

                {/* Shipping & Tax */}
                <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Truck size={16} /> Shipping & Tax Rules
                  </h3>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Free Shipping Threshold</label>
                    <input type="text" value={settingsForm.freeShippingThreshold} onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: "var(--bg-primary)", border: "1px solid var(--border-light)", color: "var(--text-primary)", borderRadius: "4px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Automated Regional Tax Rate</label>
                    <input type="text" value={settingsForm.taxRate} onChange={(e) => setSettingsForm({ ...settingsForm, taxRate: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: "var(--bg-primary)", border: "1px solid var(--border-light)", color: "var(--text-primary)", borderRadius: "4px" }} />
                  </div>
                </div>

                {/* Team Members & Roles */}
                <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "1.5rem", gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <UserCheck size={16} /> Admin Team & Roles ({teamMembers.length})
                    </h3>
                    <button
                      onClick={() => setIsInviteTeamModalOpen(true)}
                      style={{
                        background: "var(--accent-camel)",
                        color: "#fff",
                        border: "none",
                        padding: "0.4rem 0.85rem",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem"
                      }}
                    >
                      <UserPlus size={14} />
                      <span>Invite Team Member</span>
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                    {teamMembers.map((member, idx) => (
                      <div key={idx} style={{ padding: "1rem", background: "var(--bg-primary)", border: "1px solid var(--border-light)", borderRadius: "6px", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--accent-camel)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.75rem" }}>
                          {member.avatar}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{member.name}</span>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{member.role} • {member.access}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => showToast("Store settings saved successfully")}
                    style={{
                      marginTop: "0.5rem",
                      alignSelf: "flex-end",
                      background: "var(--accent-camel)",
                      color: "#fff",
                      border: "none",
                      padding: "0.6rem 1.25rem",
                      borderRadius: "4px",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Save All Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SECURITY & AUDIT TRAIL */}
          {activeTab === "security" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 400, margin: 0 }}>Security Audit Trail</h1>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Real-time immutable log of admin operations, authentication events, and system mutations.</p>
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => handleExportCSV("Security Audit Trail")}
                    style={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-light)",
                      color: "var(--text-primary)",
                      padding: "0.5rem 1rem",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem"
                    }}
                  >
                    <Download size={14} />
                    <span>Export Audit Log (CSV)</span>
                  </button>
                </div>
              </div>

              {/* Security Health Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
                <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "1.25rem" }}>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>Active Role</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--accent-camel)", marginTop: "0.25rem" }}>{adminSession.role}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>AES-256 TLS 1.3 Encrypted</div>
                </div>

                <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "1.25rem" }}>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>Session IP</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 600, fontFamily: "monospace", marginTop: "0.25rem" }}>{adminSession.ip}</div>
                  <div style={{ fontSize: "0.7rem", color: "#10b981", marginTop: "0.25rem" }}>Verified TLS Connection</div>
                </div>

                <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "8px", padding: "1.25rem" }}>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>Recorded Events</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: "0.25rem" }}>{auditLogs.length} Events</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Real-time event tracing active</div>
                </div>
              </div>

              {/* Security Filter Bar */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {["All", "INFO", "WARN", "CRITICAL"].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSecurityFilter(sev)}
                    style={{
                      background: securityFilter === sev ? "var(--accent-camel)" : "var(--bg-surface)",
                      color: securityFilter === sev ? "#fff" : "var(--text-primary)",
                      border: "1px solid var(--border-light)",
                      padding: "0.4rem 0.85rem",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    {sev === "All" ? "All Severity Levels" : sev}
                  </button>
                ))}
              </div>

              {/* Audit Trail Table */}
              <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "8px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "var(--bg-primary)", borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.08em" }}>
                      <th style={{ padding: "1rem" }}>Log ID</th>
                      <th style={{ padding: "1rem" }}>Timestamp</th>
                      <th style={{ padding: "1rem" }}>Operator</th>
                      <th style={{ padding: "1rem" }}>Event Action</th>
                      <th style={{ padding: "1rem" }}>Severity</th>
                      <th style={{ padding: "1rem" }}>IP Address</th>
                      <th style={{ padding: "1rem" }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs
                      .filter((log) => securityFilter === "All" || log.severity === securityFilter)
                      .map((log) => (
                        <tr key={log.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                          <td style={{ padding: "1rem", fontFamily: "monospace", fontWeight: 600 }}>{log.id}</td>
                          <td style={{ padding: "1rem", color: "var(--text-muted)" }}>{log.timestamp}</td>
                          <td style={{ padding: "1rem" }}>
                            <span style={{ fontWeight: 600 }}>{log.actor}</span>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>{log.role}</span>
                          </td>
                          <td style={{ padding: "1rem", fontFamily: "monospace", fontWeight: 700, color: "var(--accent-camel)" }}>{log.action}</td>
                          <td style={{ padding: "1rem" }}>
                            <span
                              style={{
                                padding: "0.2rem 0.6rem",
                                borderRadius: "10px",
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                background: log.severity === "CRITICAL" ? "rgba(239, 68, 68, 0.15)" : log.severity === "WARN" ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
                                color: log.severity === "CRITICAL" ? "#ef4444" : log.severity === "WARN" ? "#f59e0b" : "#10b981"
                              }}
                            >
                              {log.severity}
                            </span>
                          </td>
                          <td style={{ padding: "1rem", fontFamily: "monospace", color: "var(--text-muted)" }}>{log.ip}</td>
                          <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>{log.details}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isAddProductModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", width: "480px", borderRadius: "8px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.25rem", fontFamily: "var(--font-serif)", margin: 0 }}>{editingProduct ? "Edit SKU Listing" : "Add New SKU"}</h2>
              <button onClick={() => setIsAddProductModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddProductSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Product Title</label>
                <input type="text" required value={newProductForm.title} onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: "var(--bg-primary)", border: "1px solid var(--border-light)", color: "var(--text-primary)", borderRadius: "4px" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Category</label>
                  <select value={newProductForm.category} onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: "var(--bg-primary)", border: "1px solid var(--border-light)", color: "var(--text-primary)", borderRadius: "4px" }}>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Essentials">Essentials</option>
                    <option value="Tailoring">Tailoring</option>
                    <option value="Objects">Objects</option>
                    <option value="Footwear">Footwear</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>SKU Code</label>
                  <input type="text" placeholder="NYR-882" value={newProductForm.sku} onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: "var(--bg-primary)", border: "1px solid var(--border-light)", color: "var(--text-primary)", borderRadius: "4px" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Price ($)</label>
                  <input type="number" required value={newProductForm.price} onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: "var(--bg-primary)", border: "1px solid var(--border-light)", color: "var(--text-primary)", borderRadius: "4px" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Initial Stock</label>
                  <input type="number" required value={newProductForm.stock} onChange={(e) => setNewProductForm({ ...newProductForm, stock: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: "var(--bg-primary)", border: "1px solid var(--border-light)", color: "var(--text-primary)", borderRadius: "4px" }} />
                </div>
              </div>
              <button type="submit" style={{ marginTop: "0.5rem", background: "var(--accent-camel)", color: "#fff", border: "none", padding: "0.75rem", borderRadius: "4px", fontWeight: 600, cursor: "pointer" }}>
                {editingProduct ? "Save Product Changes" : "Create Product Listing"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE DISCOUNT MODAL */}
      {isAddDiscountModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", width: "420px", borderRadius: "8px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.25rem", fontFamily: "var(--font-serif)", margin: 0 }}>Create Promotional Code</h2>
              <button onClick={() => setIsAddDiscountModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddDiscountSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Promo Code</label>
                <input type="text" required placeholder="e.g. WINTER25" value={newDiscountForm.code} onChange={(e) => setNewDiscountForm({ ...newDiscountForm, code: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: "var(--bg-primary)", border: "1px solid var(--border-light)", color: "var(--text-primary)", borderRadius: "4px", textTransform: "uppercase" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Discount Type</label>
                  <select value={newDiscountForm.type} onChange={(e) => setNewDiscountForm({ ...newDiscountForm, type: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: "var(--bg-primary)", border: "1px solid var(--border-light)", color: "var(--text-primary)", borderRadius: "4px" }}>
                    <option value="Percentage">Percentage</option>
                    <option value="Fixed Amount">Fixed Amount</option>
                    <option value="Free Shipping">Free Shipping</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Value Label</label>
                  <input type="text" required placeholder="e.g. 15% OFF" value={newDiscountForm.value} onChange={(e) => setNewDiscountForm({ ...newDiscountForm, value: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: "var(--bg-primary)", border: "1px solid var(--border-light)", color: "var(--text-primary)", borderRadius: "4px" }} />
                </div>
              </div>
              <button type="submit" style={{ marginTop: "0.5rem", background: "var(--accent-camel)", color: "#fff", border: "none", padding: "0.75rem", borderRadius: "4px", fontWeight: 600, cursor: "pointer" }}>
                Publish Discount Voucher
              </button>
            </form>
          </div>
        </div>
      )}

      {/* INVITE TEAM MEMBER MODAL */}
      {isInviteTeamModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", width: "420px", borderRadius: "8px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.25rem", fontFamily: "var(--font-serif)", margin: 0 }}>Invite Team Member</h2>
              <button onClick={() => setIsInviteTeamModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <form onSubmit={handleInviteTeamSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Full Name</label>
                <input type="text" required placeholder="e.g. Claire Vance" value={newTeamMember.name} onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: "var(--bg-primary)", border: "1px solid var(--border-light)", color: "var(--text-primary)", borderRadius: "4px" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Email Address</label>
                <input type="email" required placeholder="claire.v@NIYARA.com" value={newTeamMember.email} onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: "var(--bg-primary)", border: "1px solid var(--border-light)", color: "var(--text-primary)", borderRadius: "4px" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>Admin Role</label>
                <select value={newTeamMember.role} onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })} style={{ width: "100%", padding: "0.5rem", background: "var(--bg-primary)", border: "1px solid var(--border-light)", color: "var(--text-primary)", borderRadius: "4px" }}>
                  <option value="Senior Manager">Senior Manager</option>
                  <option value="Inventory Lead">Inventory Lead</option>
                  <option value="Concierge Lead">Concierge Lead</option>
                </select>
              </div>
              <button type="submit" style={{ marginTop: "0.5rem", background: "var(--accent-camel)", color: "#fff", border: "none", padding: "0.75rem", borderRadius: "4px", fontWeight: 600, cursor: "pointer" }}>
                Send Invitation Link
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ORDER INVOICE DRAWER */}
      {selectedOrderDrawer && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "flex-end", zIndex: 1000 }}>
          <div style={{ background: "var(--bg-surface)", borderLeft: "1px solid var(--border-light)", width: "480px", height: "100%", padding: "2rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.25rem", fontFamily: "var(--font-serif)", margin: 0 }}>Invoice Details</h2>
              <button onClick={() => setSelectedOrderDrawer(null)} style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}><X size={20} /></button>
            </div>

            <div style={{ padding: "1rem", background: "var(--bg-primary)", borderRadius: "6px", border: "1px solid var(--border-light)", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Order Reference</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, fontFamily: "monospace" }}>{selectedOrderDrawer.id}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Client Name</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{selectedOrderDrawer.customer}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Tracking Number</span>
                <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--accent-camel)" }}>{selectedOrderDrawer.trackingNumber}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Shipping Address</span>
                <span style={{ fontSize: "0.75rem", textAlign: "right" }}>{selectedOrderDrawer.shippingAddress}</span>
              </div>
            </div>

            {/* Itemized Line Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Purchased Items</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {selectedOrderDrawer.items && selectedOrderDrawer.items.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "0.5rem 0", borderBottom: "1px solid var(--border-light)" }}>
                    <span>{item.qty}x {item.name}</span>
                    <span style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Total Paid</span>
              <span style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--accent-camel)" }}>${selectedOrderDrawer.total.toFixed(2)}</span>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => {
                  handleRefundOrder(selectedOrderDrawer.id);
                  setSelectedOrderDrawer(null);
                }}
                style={{ flex: 1, background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "none", padding: "0.75rem", borderRadius: "4px", fontWeight: 600, cursor: "pointer" }}
              >
                Refund Order
              </button>
              <button
                onClick={() => {
                  showToast("Downloading invoice PDF...");
                  setSelectedOrderDrawer(null);
                }}
                style={{ flex: 1, background: "var(--accent-camel)", color: "#fff", border: "none", padding: "0.75rem", borderRadius: "4px", fontWeight: 600, cursor: "pointer" }}
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER PROFILE DRAWER */}
      {selectedCustomerDrawer && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "flex-end", zIndex: 1000 }}>
          <div style={{ background: "var(--bg-surface)", borderLeft: "1px solid var(--border-light)", width: "450px", height: "100%", padding: "2rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.25rem", fontFamily: "var(--font-serif)", margin: 0 }}>Client Profile</h2>
              <button onClick={() => setSelectedCustomerDrawer(null)} style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}><X size={20} /></button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <img src={selectedCustomerDrawer.avatar} alt={selectedCustomerDrawer.name} style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>{selectedCustomerDrawer.name}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{selectedCustomerDrawer.email}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{selectedCustomerDrawer.phone}</span>
              </div>
            </div>

            <div style={{ padding: "1rem", background: "var(--bg-primary)", borderRadius: "6px", border: "1px solid var(--border-light)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Client Status</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-camel)" }}>{selectedCustomerDrawer.segment}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Lifetime Spend</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#10b981" }}>${selectedCustomerDrawer.totalSpend.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Completed Orders</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{selectedCustomerDrawer.ordersCount}</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Concierge Notes</span>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5, background: "var(--bg-primary)", padding: "0.75rem", borderRadius: "4px", border: "1px solid var(--border-light)", margin: 0 }}>
                {selectedCustomerDrawer.notes}
              </p>
            </div>

            <button
              onClick={() => {
                showToast(`Sent direct message to ${selectedCustomerDrawer.email}`);
                setSelectedCustomerDrawer(null);
              }}
              style={{ background: "var(--accent-camel)", color: "#fff", border: "none", padding: "0.75rem", borderRadius: "4px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              <Send size={14} />
              <span>Send Private Message</span>
            </button>
          </div>
        </div>
      )}

      {/* CHANGE SECURITY PIN MODAL */}
      {isChangePinModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "8px", width: "400px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontFamily: "var(--font-serif)" }}>Update Master Security PIN</h3>
              <button onClick={() => setIsChangePinModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}><X size={18} /></button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (pinChangeForm.newPin !== pinChangeForm.confirmPin) {
                  showToast("New PIN and confirmation do not match");
                  return;
                }
                const success = updateAdminPinCode(pinChangeForm.currentPin, pinChangeForm.newPin);
                if (success) {
                  setIsChangePinModalOpen(false);
                  setPinChangeForm({ currentPin: "", newPin: "", confirmPin: "" });
                }
              }}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.35rem" }}>Current Security PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  value={pinChangeForm.currentPin}
                  onChange={(e) => setPinChangeForm({ ...pinChangeForm, currentPin: e.target.value })}
                  placeholder="Default: 8890"
                  required
                  style={{ width: "100%", background: "var(--bg-primary)", border: "1px solid var(--border-light)", padding: "0.6rem", borderRadius: "4px", color: "var(--text-primary)", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.35rem" }}>New 4-6 Digit Security PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  value={pinChangeForm.newPin}
                  onChange={(e) => setPinChangeForm({ ...pinChangeForm, newPin: e.target.value })}
                  placeholder="Enter new PIN"
                  required
                  style={{ width: "100%", background: "var(--bg-primary)", border: "1px solid var(--border-light)", padding: "0.6rem", borderRadius: "4px", color: "var(--text-primary)", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.35rem" }}>Confirm New PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  value={pinChangeForm.confirmPin}
                  onChange={(e) => setPinChangeForm({ ...pinChangeForm, confirmPin: e.target.value })}
                  placeholder="Re-enter new PIN"
                  required
                  style={{ width: "100%", background: "var(--bg-primary)", border: "1px solid var(--border-light)", padding: "0.6rem", borderRadius: "4px", color: "var(--text-primary)", outline: "none" }}
                />
              </div>

              <button
                type="submit"
                style={{ background: "var(--accent-camel)", color: "#fff", border: "none", padding: "0.75rem", borderRadius: "4px", fontWeight: 700, cursor: "pointer", marginTop: "0.5rem" }}
              >
                Save New PIN
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
