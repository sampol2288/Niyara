import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { User, Package, MapPin, CreditCard, Heart, Check, Truck, ShieldCheck, ChevronRight, Lock, LogOut, Home, Building2, Store, Plus, Trash2, X } from "lucide-react";

export const AccountView = ({ defaultTab = "orders" }) => {
  const {
    user,
    setUser,
    logoutUser,
    updateUserProfile,
    orders,
    wishlist,
    toggleWishlist,
    addToCart,
    formatPrice,
    setView,
    showToast,
    setIsAuthModalOpen,
    setAuthMode,
    products
  } = useApp();

  const [activeTab, setActiveTab] = useState(defaultTab); // profile, orders, addresses, payments, wishlist

  const nameParts = (user?.name || "").split(" ");
  const [profileData, setProfileData] = useState({
    firstName: nameParts[0] || "",
    lastName: nameParts.slice(1).join(" ") || "",
    email: user ? user.email : "",
    phone: user ? (user.phone || "") : "",
    twoFactor: false,
    newsletter: true,
    smsUpdates: true
  });

  useEffect(() => {
    if (user) {
      const parts = user.name.split(" ");
      setProfileData((prev) => ({
        ...prev,
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        email: user.email,
        phone: user.phone || "+1 (555) 000-0000"
      }));
    }
  }, [user]);

  const [expandedOrderId, setExpandedOrderId] = useState("#AE-98234");

  // ─── ADDRESS MANAGEMENT ───────────────────────────────────────────────────
  const storageKey = `niyara_addresses_${user?.email || "guest"}`;
  const loadAddresses = () => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch { return []; }
  };
  const [addresses, setAddresses] = useState(loadAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const blankAddr = { type: "home", fullName: "", phone: "", line1: "", line2: "", city: "", state: "", zip: "", country: "" };
  const [newAddr, setNewAddr] = useState(blankAddr);

  const saveAddresses = (list) => {
    setAddresses(list);
    localStorage.setItem(storageKey, JSON.stringify(list));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.line1 || !newAddr.city || !newAddr.country) {
      showToast("Please fill in all required fields."); return;
    }
    const entry = { ...newAddr, id: Date.now() };
    saveAddresses([...addresses, entry]);
    setNewAddr(blankAddr);
    setShowAddForm(false);
    showToast("Address saved successfully!");
  };

  const handleDeleteAddress = (id) => {
    saveAddresses(addresses.filter(a => a.id !== id));
    showToast("Address removed.");
  };

  const addrTypeConfig = {
    home:   { label: "Home",   Icon: Home,      color: "#c5a072" },
    office: { label: "Office", Icon: Building2,  color: "#7c9ab5" },
    shop:   { label: "Shop",   Icon: Store,      color: "#8fbb8f" }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: `${profileData.firstName} ${profileData.lastName}`.trim(),
      email: profileData.email,
      phone: profileData.phone
    });
  };

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  if (!user) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto", padding: "6rem 2rem", textAlign: "center" }}>
        <div style={{ background: "rgba(197, 160, 114, 0.15)", width: "72px", height: "72px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", color: "var(--accent-camel)" }}>
          <Lock size={32} />
        </div>
        <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-camel)", fontWeight: 600 }}>AUTHENTICATION REQUIRED</span>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "3rem", color: "var(--text-primary)", margin: "0.5rem 0 1rem" }}>
          Sign In to Access Account.
        </h1>
        <p style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: "520px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
          Access your order dispatch history, manage saved architectural wishlists, update address details, and manage 2FA security protocols.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <button
            onClick={() => { setAuthMode("login"); setIsAuthModalOpen(true); }}
            className="btn-camel"
            style={{ padding: "1rem 2rem" }}
          >
            SIGN IN TO ACCOUNT
          </button>
          <button
            onClick={() => { setAuthMode("signup"); setIsAuthModalOpen(true); }}
            className="btn-secondary"
            style={{ padding: "1rem 2rem" }}
          >
            CREATE NEW ACCOUNT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in page-container">
      {/* Header */}
      <div style={{ marginBottom: "3rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-camel)", fontWeight: 600 }}>NIYARA ARCHIVE MEMBER</span>
          <h1 style={{ fontSize: "3rem", color: "var(--text-primary)", marginTop: "0.25rem" }}>
            Welcome back, {profileData.firstName || user.name.split(" ")[0]}.
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Manage your identity, track active dispatches, and access saved archival pieces across the NIYARA ecosystem.
          </p>
        </div>

        <button
          onClick={() => {
            logoutUser();
          }}
          className="btn-secondary"
          style={{ fontSize: "0.7rem", padding: "0.6rem 1rem" }}
        >
          <LogOut size={14} /> LOGOUT
        </button>
      </div>

      {/* Main Grid: Sidebar Navigation & Content */}
      <div className="account-dashboard-grid">
        {/* Sidebar Nav Tabs */}
        <div className="account-sidebar-nav">
          <button
            onClick={() => setActiveTab("orders")}
            className={`account-tab-btn ${activeTab === "orders" ? "active" : ""}`}
          >
            <Package size={16} /> ORDER HISTORY
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`account-tab-btn ${activeTab === "profile" ? "active" : ""}`}
          >
            <User size={16} /> PROFILE
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`account-tab-btn ${activeTab === "wishlist" ? "active" : ""}`}
          >
            <Heart size={16} /> WISHLIST ({wishlist.length})
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`account-tab-btn ${activeTab === "addresses" ? "active" : ""}`}
          >
            <MapPin size={16} /> ADDRESSES
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`account-tab-btn ${activeTab === "payments" ? "active" : ""}`}
          >
            <CreditCard size={16} /> PAYMENTS
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {/* TAB 1: ORDER HISTORY & LIVE TRACKING */}
          {activeTab === "orders" && (
            <div className="animate-fade-in">
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", marginBottom: "1.5rem" }}>Order History</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {orders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  return (
                    <div key={order.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)" }}>
                      {/* Order Header Summary Row */}
                      <div
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        style={{
                          padding: "1.5rem 2rem",
                          display: "flex",
                          justify: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "1.5rem",
                          cursor: "pointer",
                          borderBottom: isExpanded ? "1px solid var(--border-light)" : "none"
                        }}
                      >
                        <div style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
                          <div>
                            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>ORDER NUMBER</span>
                            <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap" }}>{order.id}</span>
                          </div>
                          <div>
                            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>ORDER DATE</span>
                            <span style={{ fontSize: "0.84rem", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{order.date}</span>
                          </div>
                          <div>
                            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>TOTAL</span>
                            <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap" }}>{formatPrice(order.total)}</span>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                          <span className={order.status === "IN TRANSIT" ? "badge-camel" : "badge-minimal"} style={{ whiteSpace: "nowrap" }}>
                            {order.status}
                          </span>
                          <button className="btn-secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.7rem", whiteSpace: "nowrap" }}>
                            {isExpanded ? "Hide Details" : "View Details & Track"}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Order Timeline & Details */}
                      {isExpanded && (
                        <div style={{ padding: "2rem", background: "var(--bg-surface)" }} className="animate-fade-in">
                          {/* Visual Step Tracker */}
                          <div style={{ marginBottom: "2.5rem", padding: "1.5rem", background: "var(--bg-card)", border: "1px solid var(--border-light)" }}>
                            <span style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "var(--accent-camel)", textTransform: "uppercase", display: "block", marginBottom: "1rem" }}>
                              REAL-TIME SHIPMENT STATUS
                            </span>

                             {/* 4-Step Progress Bar with Connecting Bar */}
                            <div style={{ position: "relative", marginBottom: "1.75rem", paddingTop: "0.5rem" }}>
                              {/* Background Connecting Line */}
                              <div style={{ position: "absolute", top: "20px", left: "12%", right: "12%", height: "2px", background: "var(--border-light)", zIndex: 0 }} />

                              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", position: "relative", zIndex: 1 }}>
                                {["Placed", "Packed", "Shipped", "Delivered"].map((stepLabel, idx) => {
                                  const stepNum = idx + 1;
                                  const isComplete = order.statusStep >= stepNum;
                                  return (
                                    <div key={idx} style={{ textAlign: "center" }}>
                                      <div
                                        style={{
                                          width: "32px",
                                          height: "32px",
                                          borderRadius: "50%",
                                          background: isComplete ? "var(--accent-camel)" : "var(--bg-primary)",
                                          color: isComplete ? "#ffffff" : "var(--text-muted)",
                                          border: isComplete ? "2px solid var(--accent-camel)" : "2px solid var(--border-light)",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          margin: "0 auto 0.5rem",
                                          fontSize: "0.8125rem",
                                          fontWeight: 600,
                                          boxShadow: isComplete ? "0 4px 12px rgba(197, 160, 114, 0.3)" : "none",
                                          transition: "all 0.3s ease"
                                        }}
                                      >
                                        {isComplete ? <Check size={16} strokeWidth={2.5} color="#ffffff" /> : stepNum}
                                      </div>
                                      <span style={{ fontSize: "0.8125rem", fontWeight: isComplete ? 600 : 400, color: isComplete ? "var(--text-primary)" : "var(--text-muted)" }}>
                                        {stepLabel}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Tracking Message Banner */}
                            <div style={{ background: "rgba(197, 160, 114, 0.08)", borderLeft: "3px solid var(--accent-camel)", padding: "1rem", fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                              <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                                Carrier: {order.carrier} • Tracking #: <span style={{ color: "var(--accent-camel)" }}>{order.trackingNumber}</span>
                              </p>
                              <p>{order.trackingMessage}</p>
                            </div>
                          </div>

                          {/* Items Purchased List */}
                          <h4 style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                            ITEMS IN SHIPMENT ({order.items.length})
                          </h4>
                          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                            {order.items.map((item, idx) => (
                              <div key={idx} style={{ display: "flex", gap: "1.25rem", alignItems: "center", padding: "1rem", background: "var(--bg-card)", border: "1px solid var(--border-light)" }}>
                                <img src={item.image} alt={item.name} style={{ width: "60px", height: "75px", objectFit: "cover" }} />
                                <div style={{ flex: 1 }}>
                                  <h5 style={{ fontSize: "0.9375rem", color: "var(--text-primary)" }}>{item.name}</h5>
                                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Color: {item.color} • Size: {item.size} • Qty: {item.qty}</span>
                                </div>
                                <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)" }}>{formatPrice(item.price * item.qty)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL PROFILE */}
          {activeTab === "profile" && (
            <div className="animate-fade-in" style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: "2.5rem" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", marginBottom: "0.5rem" }}>Personal Profile</h2>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "2rem" }}>
                Manage your identity across the Aether ecosystem. Your information is used to personalize your experience and streamline checkout.
              </p>

              {/* Photo Upload Section */}
              <div style={{ display: "flex", alignItems: "center", gap: "2rem", paddingBottom: "2rem", marginBottom: "2rem", borderBottom: "1px solid var(--border-light)" }}>
                <img src={user?.avatar || profileData.avatar} alt="Avatar" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--accent-camel)" }} />
                <div>
                  <button className="btn-secondary" style={{ fontSize: "0.7rem", padding: "0.6rem 1rem", marginBottom: "0.5rem" }}>
                    UPLOAD NEW PHOTO
                  </button>
                  <span style={{ display: "block", fontSize: "0.7rem", color: "var(--text-muted)" }}>SVG, PNG, JPG up to 10MB</span>
                </div>
              </div>

              {/* Identity Form */}
              <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>FIRST NAME</label>
                    <input type="text" value={profileData.firstName} onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })} className="input-minimal" required />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>LAST NAME</label>
                    <input type="text" value={profileData.lastName} onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })} className="input-minimal" required />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)" }}>EMAIL ADDRESS</label>
                      <span className="badge-minimal" style={{ fontSize: "0.55rem", color: "var(--accent-camel)" }}>VERIFIED</span>
                    </div>
                    <input type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} className="input-minimal" required />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>PHONE NUMBER</label>
                    <input type="text" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} className="input-minimal" />
                  </div>
                </div>

                {/* Security Settings */}
                <h3 style={{ fontSize: "0.875rem", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "1rem", color: "var(--text-primary)" }}>ACCOUNT SECURITY</h3>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem", background: "var(--bg-surface)", border: "1px solid var(--border-light)" }}>
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>Password</p>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Last changed 4 months ago</span>
                  </div>
                  <button type="button" onClick={() => showToast("Password reset link sent to your email.")} className="btn-secondary" style={{ fontSize: "0.7rem", padding: "0.5rem 1rem" }}>
                    CHANGE PASSWORD
                  </button>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem", background: "var(--bg-surface)", border: "1px solid var(--border-light)" }}>
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>Two-Factor Authentication</p>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Add an extra layer of security to your account.</span>
                  </div>
                  <input type="checkbox" checked={profileData.twoFactor} onChange={(e) => setProfileData({ ...profileData, twoFactor: e.target.checked })} style={{ width: "18px", height: "18px" }} />
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button type="submit" className="btn-primary">
                    SAVE CHANGES
                  </button>
                  <button type="button" onClick={() => showToast("Changes discarded.")} className="btn-secondary">
                    RESET CHANGES
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: SAVED WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="animate-fade-in">
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", marginBottom: "1.5rem" }}>
                Saved Wishlist ({wishlistProducts.length})
              </h2>

              {wishlistProducts.length === 0 ? (
                <div style={{ padding: "4rem 2rem", textAlign: "center", background: "var(--bg-card)", border: "1px solid var(--border-light)" }}>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>Your wishlist is empty.</p>
                  <button onClick={() => setView("shop")} className="btn-camel">EXPLORE COLLECTIONS</button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "2rem" }}>
                  {wishlistProducts.map((product) => (
                    <div key={product.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: "1rem" }}>
                      <img src={product.images[0]} alt={product.name} style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", marginBottom: "0.75rem" }} />
                      <h4 style={{ fontSize: "0.9375rem", color: "var(--text-primary)" }}>{product.name}</h4>
                      <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--accent-camel)", display: "block", marginBottom: "0.75rem" }}>{formatPrice(product.price)}</span>
                      <button onClick={() => addToCart(product)} className="btn-primary" style={{ width: "100%", fontSize: "0.7rem", padding: "0.6rem" }}>
                        MOVE TO BAG
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="animate-fade-in">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", margin: 0 }}>Delivery Addresses</h2>
                {!showAddForm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--accent-camel)", color: "#000", border: "none", padding: "0.6rem 1.25rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.1em", cursor: "pointer" }}
                  >
                    <Plus size={14} /> ADD ADDRESS
                  </button>
                )}
              </div>

              {/* ── ADD FORM ── */}
              {showAddForm && (
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--accent-camel)", padding: "1.75rem", marginBottom: "2rem", position: "relative" }}>
                  <button onClick={() => { setShowAddForm(false); setNewAddr(blankAddr); }} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={18} /></button>
                  <h4 style={{ fontSize: "0.875rem", letterSpacing: "0.12em", marginBottom: "1.25rem", color: "var(--text-primary)" }}>NEW DELIVERY ADDRESS</h4>

                  {/* Address Type Selector */}
                  <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    {Object.entries(addrTypeConfig).map(([key, { label, Icon, color }]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setNewAddr(p => ({ ...p, type: key }))}
                        style={{
                          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
                          padding: "0.85rem 0.5rem", border: `1.5px solid ${newAddr.type === key ? color : "var(--border-light)"}`,
                          background: newAddr.type === key ? `${color}14` : "transparent",
                          color: newAddr.type === key ? color : "var(--text-muted)",
                          cursor: "pointer", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", transition: "all 0.2s"
                        }}
                      >
                        <Icon size={20} />
                        {label.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleAddAddress}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem" }}>
                      {[
                        { field: "fullName",  label: "Full Name *",       col: "1 / -1" },
                        { field: "phone",     label: "Phone Number",      col: "" },
                        { field: "line1",     label: "Address Line 1 *",  col: "1 / -1" },
                        { field: "line2",     label: "Apartment / Suite", col: "1 / -1" },
                        { field: "city",      label: "City *",            col: "" },
                        { field: "state",     label: "State / Province",  col: "" },
                        { field: "zip",       label: "ZIP / Postal Code", col: "" },
                        { field: "country",   label: "Country *",         col: "" },
                      ].map(({ field, label, col }) => (
                        <div key={field} style={{ gridColumn: col || "auto", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                          <label style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "var(--text-muted)", fontWeight: 600 }}>{label}</label>
                          <input
                            type="text"
                            value={newAddr[field]}
                            onChange={e => setNewAddr(p => ({ ...p, [field]: e.target.value }))}
                            style={{ background: "var(--bg-primary)", border: "1px solid var(--border-light)", color: "var(--text-primary)", padding: "0.65rem 0.85rem", fontSize: "0.875rem", outline: "none", width: "100%", boxSizing: "border-box" }}
                          />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                      <button type="submit" className="btn-camel" style={{ padding: "0.75rem 2rem", fontSize: "0.75rem", letterSpacing: "0.1em" }}>SAVE ADDRESS</button>
                      <button type="button" onClick={() => { setShowAddForm(false); setNewAddr(blankAddr); }} style={{ padding: "0.75rem 1.5rem", background: "transparent", border: "1px solid var(--border-light)", color: "var(--text-secondary)", fontSize: "0.75rem", letterSpacing: "0.1em", cursor: "pointer" }}>CANCEL</button>
                    </div>
                  </form>
                </div>
              )}

              {/* ── SAVED ADDRESS CARDS ── */}
              {addresses.length === 0 && !showAddForm ? (
                <div style={{ textAlign: "center", padding: "4rem 2rem", border: "1px dashed var(--border-light)", color: "var(--text-muted)" }}>
                  <MapPin size={36} style={{ marginBottom: "1rem", opacity: 0.35 }} />
                  <p style={{ fontSize: "0.875rem", marginBottom: "1.5rem" }}>No saved addresses yet.</p>
                  <button onClick={() => setShowAddForm(true)} className="btn-camel" style={{ padding: "0.65rem 1.75rem", fontSize: "0.75rem", letterSpacing: "0.1em" }}>ADD YOUR FIRST ADDRESS</button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
                  {addresses.map((addr, idx) => {
                    const cfg = addrTypeConfig[addr.type] || addrTypeConfig.home;
                    return (
                      <div key={addr.id} style={{ background: "var(--bg-card)", border: `1px solid ${idx === 0 ? cfg.color : "var(--border-light)"}`, padding: "1.5rem", position: "relative", transition: "border-color 0.2s" }}>
                        {/* Type Badge */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.85rem" }}>
                          <cfg.Icon size={14} color={cfg.color} />
                          <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", color: cfg.color }}>{cfg.label.toUpperCase()}</span>
                          {idx === 0 && <span style={{ marginLeft: "auto", fontSize: "0.6rem", background: `${cfg.color}22`, color: cfg.color, padding: "0.15rem 0.5rem", fontWeight: 700, letterSpacing: "0.08em" }}>PRIMARY</span>}
                        </div>
                        <h4 style={{ fontSize: "0.9375rem", color: "var(--text-primary)", margin: "0 0 0.4rem" }}>{addr.fullName}</h4>
                        {addr.phone && <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 0.4rem" }}>{addr.phone}</p>}
                        <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
                          {addr.city}{addr.state ? `, ${addr.state}` : ""} {addr.zip}<br />
                          {addr.country}
                        </p>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.25rem", opacity: 0.6, transition: "opacity 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.opacity = 1}
                          onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
                          title="Remove address"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PAYMENT METHODS */}
          {activeTab === "payments" && (
            <div className="animate-fade-in">
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", marginBottom: "1.5rem" }}>Payment Methods</h2>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: "1.5rem", maxWidth: "400px" }}>
                <span className="badge-camel" style={{ marginBottom: "0.75rem", display: "inline-block" }}>DEFAULT</span>
                <h4 style={{ fontSize: "1rem", color: "var(--text-primary)" }}>Visa ending in 4242</h4>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Expires 08/26</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
