import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { PRODUCTS } from "../data/products";
import { User, Package, MapPin, CreditCard, Heart, Check, Truck, ShieldCheck, ChevronRight, Lock, LogOut } from "lucide-react";

export const AccountView = ({ defaultTab = "orders" }) => {
  const { user, setUser, orders, wishlist, toggleWishlist, addToCart, formatPrice, setView, showToast, setIsAuthModalOpen } = useApp();

  const [activeTab, setActiveTab] = useState(defaultTab); // profile, orders, addresses, payments, wishlist

  // Profile Form States
  const [profileData, setProfileData] = useState({
    firstName: "Julian",
    lastName: "Vanderveld",
    email: user ? user.email : "julian.v@aether.com",
    phone: "+1 (555) 000-0000",
    twoFactor: true,
    newsletter: true,
    smsUpdates: true
  });

  const [expandedOrderId, setExpandedOrderId] = useState("#AE-98234");

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser({ ...user, name: `${profileData.firstName} ${profileData.lastName}`, email: profileData.email });
    showToast("Profile settings saved successfully.");
  };

  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="animate-fade-in" style={{ maxWidth: "1440px", margin: "0 auto", padding: "3rem 2rem 6rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "3rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-camel)" }}>AETHER MEMBER</span>
          <h1 style={{ fontSize: "3rem", color: "var(--text-primary)", marginTop: "0.25rem" }}>
            Welcome back, {profileData.firstName}.
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Manage your identity, track active dispatches, and access saved archival pieces across the Aether ecosystem.
          </p>
        </div>

        <button
          onClick={() => {
            setUser(null);
            setIsAuthModalOpen(true);
            showToast("Logged out of account.");
          }}
          className="btn-secondary"
          style={{ fontSize: "0.7rem", padding: "0.6rem 1rem" }}
        >
          <LogOut size={14} /> LOGOUT
        </button>
      </div>

      {/* Main Grid: Sidebar Navigation & Content */}
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "3.5rem" }}>
        {/* Sidebar Nav Tabs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button
            onClick={() => setActiveTab("orders")}
            style={{
              padding: "1rem 1.25rem",
              background: activeTab === "orders" ? "var(--bg-card)" : "transparent",
              border: "1px solid",
              borderColor: activeTab === "orders" ? "var(--accent-camel)" : "transparent",
              color: activeTab === "orders" ? "var(--accent-camel)" : "var(--text-secondary)",
              textAlign: "left",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem"
            }}
          >
            <Package size={16} /> ORDER HISTORY & TRACKING
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            style={{
              padding: "1rem 1.25rem",
              background: activeTab === "profile" ? "var(--bg-card)" : "transparent",
              border: "1px solid",
              borderColor: activeTab === "profile" ? "var(--accent-camel)" : "transparent",
              color: activeTab === "profile" ? "var(--accent-camel)" : "var(--text-secondary)",
              textAlign: "left",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem"
            }}
          >
            <User size={16} /> PERSONAL PROFILE
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            style={{
              padding: "1rem 1.25rem",
              background: activeTab === "wishlist" ? "var(--bg-card)" : "transparent",
              border: "1px solid",
              borderColor: activeTab === "wishlist" ? "var(--accent-camel)" : "transparent",
              color: activeTab === "wishlist" ? "var(--accent-camel)" : "var(--text-secondary)",
              textAlign: "left",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem"
            }}
          >
            <Heart size={16} /> WISHLIST ({wishlist.length})
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            style={{
              padding: "1rem 1.25rem",
              background: activeTab === "addresses" ? "var(--bg-card)" : "transparent",
              border: "1px solid",
              borderColor: activeTab === "addresses" ? "var(--accent-camel)" : "transparent",
              color: activeTab === "addresses" ? "var(--accent-camel)" : "var(--text-secondary)",
              textAlign: "left",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem"
            }}
          >
            <MapPin size={16} /> ADDRESSES
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            style={{
              padding: "1rem 1.25rem",
              background: activeTab === "payments" ? "var(--bg-card)" : "transparent",
              border: "1px solid",
              borderColor: activeTab === "payments" ? "var(--accent-camel)" : "transparent",
              color: activeTab === "payments" ? "var(--accent-camel)" : "var(--text-secondary)",
              textAlign: "left",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem"
            }}
          >
            <CreditCard size={16} /> PAYMENT METHODS
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
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", marginBottom: "1.5rem" }}>Saved Addresses</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--accent-camel)", padding: "1.5rem" }}>
                  <span className="badge-camel" style={{ marginBottom: "0.75rem", display: "inline-block" }}>PRIMARY SHIPPING</span>
                  <h4 style={{ fontSize: "1rem", color: "var(--text-primary)" }}>Julian Andersson</h4>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>Skeppsbron 44, 111 30</p>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>Stockholm, Sweden</p>
                </div>

                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: "1.5rem" }}>
                  <span className="badge-minimal" style={{ marginBottom: "0.75rem", display: "inline-block" }}>SECONDARY</span>
                  <h4 style={{ fontSize: "1rem", color: "var(--text-primary)" }}>Alexander Vane</h4>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>128 West 26th Street, Apt 4B</p>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>New York, NY 10001</p>
                </div>
              </div>
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
