import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ArrowRight, Check } from "lucide-react";

export const Footer = () => {
  const { setView, setActiveCategory, showToast } = useApp();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    showToast("Thank you for subscribing to NIYARI Archive.");
    setEmail("");
  };

  const instagramPosts = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop"
  ];

  return (
    <footer style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border-light)", color: "var(--text-secondary)", transition: "background-color 0.2s ease, color 0.2s ease" }}>
      {/* Archival Instagram Grid */}
      <div style={{ borderBottom: "1px solid var(--border-light)" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "3rem 2rem 2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-camel)", fontWeight: 600 }}>EDITORIAL FEED</span>
              <h3 style={{ fontSize: "1.35rem", color: "var(--text-primary)", marginTop: "0.35rem", fontWeight: 500, letterSpacing: "0.05em" }}>
                TAG US TO BE FEATURED #AETHERARCHIVE
              </h3>
            </div>
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.15em", color: "var(--text-muted)", fontWeight: 500 }}>@aether_archive</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
            {instagramPosts.map((img, idx) => (
              <div key={idx} className="image-zoom-container" style={{ aspectRatio: "4/5", background: "var(--bg-card)", border: "1px solid var(--border-light)" }}>
                <img
                  src={img}
                  alt="Aether Archive"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "4rem 2rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "3.5rem", marginBottom: "4rem" }}>
          {/* Brand Philosophy */}
          <div>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", letterSpacing: "0.2em", color: "var(--text-primary)", display: "block", marginBottom: "1rem" }}>
              NIYARI
            </span>
            <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              Elevated essentials for the modern architectural wardrobe. Grounded in Scandi-minimalism, designed in Stockholm.
            </p>
            <p style={{ fontSize: "0.78rem", fontStyle: "italic", color: "var(--accent-camel)", fontWeight: 500 }}>
              "Quality over everything." — THE AETHER MANIFESTO
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-primary)", marginBottom: "1.25rem", fontWeight: 700 }}>
              COLLECTIONS
            </h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.84rem" }}>
              <li>
                <button
                  onClick={() => { setActiveCategory("Women"); setView("shop"); window.scrollTo(0,0); }}
                  style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 0, textAlign: "left", transition: "color 0.2s ease" }}
                  onMouseEnter={(e) => e.target.style.color = "var(--accent-camel)"}
                  onMouseLeave={(e) => e.target.style.color = "var(--text-secondary)"}
                >
                  Women's Outerwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveCategory("Tailoring"); setView("shop"); window.scrollTo(0,0); }}
                  style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 0, textAlign: "left", transition: "color 0.2s ease" }}
                  onMouseEnter={(e) => e.target.style.color = "var(--accent-camel)"}
                  onMouseLeave={(e) => e.target.style.color = "var(--text-secondary)"}
                >
                  Archival Tailoring
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveCategory("Essentials"); setView("shop"); window.scrollTo(0,0); }}
                  style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 0, textAlign: "left", transition: "color 0.2s ease" }}
                  onMouseEnter={(e) => e.target.style.color = "var(--accent-camel)"}
                  onMouseLeave={(e) => e.target.style.color = "var(--text-secondary)"}
                >
                  Architectural Knits
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveCategory("Objects"); setView("shop"); window.scrollTo(0,0); }}
                  style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 0, textAlign: "left", transition: "color 0.2s ease" }}
                  onMouseEnter={(e) => e.target.style.color = "var(--accent-camel)"}
                  onMouseLeave={(e) => e.target.style.color = "var(--text-secondary)"}
                >
                  Living & Objects
                </button>
              </li>
            </ul>
          </div>

          {/* Assistance & Legal */}
          <div>
            <h4 style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-primary)", marginBottom: "1.25rem", fontWeight: 700 }}>
              CLIENT CARE
            </h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.84rem" }}>
              <li>
                <button
                  onClick={() => { setView("contact"); window.scrollTo(0,0); }}
                  style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 0, textAlign: "left", transition: "color 0.2s ease" }}
                  onMouseEnter={(e) => e.target.style.color = "var(--accent-camel)"}
                  onMouseLeave={(e) => e.target.style.color = "var(--text-secondary)"}
                >
                  Contact Concierge
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setView("account"); window.scrollTo(0,0); }}
                  style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 0, textAlign: "left", transition: "color 0.2s ease" }}
                  onMouseEnter={(e) => e.target.style.color = "var(--accent-camel)"}
                  onMouseLeave={(e) => e.target.style.color = "var(--text-secondary)"}
                >
                  Order Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setView("contact"); window.scrollTo(0,0); }}
                  style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 0, textAlign: "left", transition: "color 0.2s ease" }}
                  onMouseEnter={(e) => e.target.style.color = "var(--accent-camel)"}
                  onMouseLeave={(e) => e.target.style.color = "var(--text-secondary)"}
                >
                  Shipping & Returns
                </button>
              </li>
              <li><span style={{ color: "var(--text-secondary)" }}>Privacy Policy & Terms</span></li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h4 style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-primary)", marginBottom: "1.25rem", fontWeight: 700 }}>
              JOIN THE ARCHIVE
            </h4>
            <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginBottom: "1rem", lineHeight: 1.6 }}>
              Receive early access to new seasonal drops, private exhibitions, and editorial releases.
            </p>
            {subscribed ? (
              <div style={{ background: "rgba(197, 160, 114, 0.15)", border: "1px solid var(--accent-camel)", padding: "0.875rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-camel)", fontSize: "0.84rem" }}>
                <Check size={16} />
                <span>You are subscribed to the Archive.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} style={{ display: "flex" }}>
                <input
                  type="email"
                  placeholder="ENTER YOUR EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-minimal"
                  style={{ borderRight: "none" }}
                  required
                />
                <button type="submit" className="btn-camel" style={{ padding: "0.875rem 1.25rem", display: "flex", alignItems: "center" }}>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "2rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <p>© 2024 NIYARI STUDIO. ALL RIGHTS RESERVED.</p>
            {/* Discreet Secret Admin Lock Portal */}
            <button
              onClick={() => {
                setView("admin");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "0.2rem",
                opacity: 0.4,
                transition: "opacity 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.4")}
              title="Operator Portal (Ctrl+Shift+A)"
            >
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>• Portal</span>
            </button>
          </div>
          <div style={{ display: "flex", gap: "2rem", letterSpacing: "0.1em", fontWeight: 500 }}>
            <span>STOCKHOLM</span>
            <span>COPENHAGEN</span>
            <span>NEW YORK</span>
            <span>TOKYO</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
