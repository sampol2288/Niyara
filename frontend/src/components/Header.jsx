import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Search, ShoppingBag, Heart, User, Sun, Moon, Menu, X, Shield } from "lucide-react";

export const Header = () => {
  const {
    view,
    setView,
    setActiveCategory,
    cart,
    wishlist,
    theme,
    toggleTheme,
    setIsCartOpen,
    setIsSearchOpen,
    setIsAuthModalOpen,
    user
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleNavClick = (category, targetView = "shop") => {
    setActiveCategory(category);
    setView(targetView);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 1000, background: "var(--bg-primary)", borderBottom: "1px solid var(--border-light)" }}>
      {/* Top Announcement Bar */}
      <div
        style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-light)",
          color: "var(--text-secondary)",
          fontSize: "0.6875rem",
          letterSpacing: "0.15em",
          textAlign: "center",
          padding: "0.5rem 1rem",
          textTransform: "uppercase",
          fontWeight: 500
        }}
      >
        <span>FREE SHIPPING ON ORDERS OVER $200 • WORLDWIDE EXPRESS COURIER</span>
      </div>

      {/* Main Navigation Bar */}
      <div
        className="header-nav-container"
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        {/* Left Mobile Menu & Brand Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              display: "none",
              padding: 0
            }}
            className="mobile-toggle-btn"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div
            onClick={() => setView("home")}
            style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}
          >
            <span
              className="brand-logo-text"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.75rem",
                letterSpacing: "0.22em",
                fontWeight: 400,
                color: "var(--text-primary)",
                lineHeight: 1
              }}
            >
              NIYARA
            </span>
            <span
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.25em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginTop: "0.25rem"
              }}
            >
              ARCHIVE CLOTHING & INTERIORS
            </span>
          </div>
        </div>

        {/* Center Desktop Navigation */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem"
          }}
          className="desktop-nav desktop-nav-links"
        >
          <button
            onClick={() => handleNavClick("Women")}
            style={{
              background: "none",
              border: "none",
              color: view === "shop" ? "var(--accent-camel)" : "var(--text-primary)",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "color var(--transition-fast)"
            }}
          >
            Women
          </button>
          <button
            onClick={() => handleNavClick("New Arrivals")}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer"
            }}
          >
            New Arrivals
          </button>
          <button
            onClick={() => handleNavClick("Outerwear")}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer"
            }}
          >
            Collections
          </button>
          <button
            onClick={() => handleNavClick("Objects")}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer"
            }}
          >
            Objects
          </button>
          <button
            onClick={() => setView("journal")}
            style={{
              background: "none",
              border: "none",
              color: view === "journal" ? "var(--accent-camel)" : "var(--text-primary)",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer"
            }}
          >
            Journal
          </button>
          <button
            onClick={() => handleNavClick("Sale")}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-camel)",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            Sale
          </button>
        </nav>

        {/* Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center"
            }}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>


          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center"
            }}
            title="Search Products"
          >
            <Search size={18} />
          </button>

          {/* Account Trigger */}
          <button
            onClick={() => {
              if (user) {
                setView("account");
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            style={{
              background: "none",
              border: "none",
              color: view === "account" ? "var(--accent-camel)" : "var(--text-primary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.75rem",
              letterSpacing: "0.1em"
            }}
            title={user ? `Account (${user.name})` : "Sign In / Register"}
          >
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1px solid var(--accent-camel)"
                    }}
                  />
                ) : (
                  <User size={18} />
                )}
                <span className="desktop-only" style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase" }}>
                  {user.name.split(" ")[0]}
                </span>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <User size={18} />
                <span className="desktop-only" style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em" }}>
                  LOG IN
                </span>
              </div>
            )}
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={() => {
              setView("wishlist");
            }}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              position: "relative",
              display: "flex",
              alignItems: "center"
            }}
            title="Wishlist"
          >
            <Heart size={18} />
            {wishlist.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-8px",
                  background: "var(--accent-camel)",
                  color: "#ffffff",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Icon Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <ShoppingBag size={18} />
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.1em", fontWeight: 500 }}>
              ({totalCartCount})
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            padding: "1.5rem 2rem",
            background: "var(--bg-surface)",
            borderBottom: "1px solid var(--border-light)",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem"
          }}
        >
          <button onClick={() => handleNavClick("Women")} style={{ background: "none", border: "none", color: "var(--text-primary)", textAlign: "left", fontSize: "0.875rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Women</button>
          <button onClick={() => handleNavClick("New Arrivals")} style={{ background: "none", border: "none", color: "var(--text-primary)", textAlign: "left", fontSize: "0.875rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>New Arrivals</button>
          <button onClick={() => handleNavClick("Outerwear")} style={{ background: "none", border: "none", color: "var(--text-primary)", textAlign: "left", fontSize: "0.875rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Collections</button>
          <button onClick={() => handleNavClick("Objects")} style={{ background: "none", border: "none", color: "var(--text-primary)", textAlign: "left", fontSize: "0.875rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Objects</button>
          <button onClick={() => { setView("journal"); setMobileMenuOpen(false); }} style={{ background: "none", border: "none", color: "var(--text-primary)", textAlign: "left", fontSize: "0.875rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Journal</button>
          <button onClick={() => { setView("contact"); setMobileMenuOpen(false); }} style={{ background: "none", border: "none", color: "var(--text-primary)", textAlign: "left", fontSize: "0.875rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Contact & Concierge</button>
        </div>
      )}
    </header>
  );
};
