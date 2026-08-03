import React from "react";
import { useApp } from "../context/AppContext";
import { ArrowRight, Heart, ShoppingBag, Sparkles } from "lucide-react";

export const HomeView = () => {
  const { setView, setActiveCategory, openPDP, addToCart, toggleWishlist, wishlist, formatPrice, products } = useApp();

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Hero Banner Section */}
      <section style={{ position: "relative", minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 2rem", overflow: "hidden", background: "#050506" }}>
        {/* Background Image Overlay */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.45 }}>
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop"
            alt="SEASON 01 Minimal Hero"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, rgba(10,10,12,0.3) 0%, rgba(10,10,12,0.9) 100%)" }} />

        {/* Hero Content Box */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: "800px", textAlign: "center" }}>
          <span style={{ fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent-camel)", fontWeight: 600, display: "block", marginBottom: "1rem" }}>
            SEASON 01: THE NEW MINIMAL
          </span>
          <h1 style={{ fontSize: "3.75rem", lineHeight: 1.1, marginBottom: "1.5rem", color: "var(--text-primary)" }}>
            ARCHITECTURAL PERSPECTIVE.
          </h1>
          <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 2.5rem", fontWeight: 300, lineHeight: 1.7 }}>
            Discover a curation of timeless essentials crafted with archival quality and architectural precision. Designed in Stockholm.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.25rem", flexWrap: "wrap" }}>
            <button
              onClick={() => { setActiveCategory("Women"); setView("shop"); window.scrollTo(0, 0); }}
              className="btn-primary"
            >
              SHOP THE COLLECTION <ArrowRight size={16} />
            </button>
            <button
              onClick={() => { setView("journal"); window.scrollTo(0, 0); }}
              className="btn-secondary"
            >
              READ OUR JOURNAL
            </button>
          </div>
        </div>
      </section>

      {/* Brand Manifesto Strip */}
      <section style={{ borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)", background: "#0e0e11", padding: "3rem 2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-camel)" }}>OUR PHILOSOPHY</span>
          <h2 style={{ fontSize: "2rem", color: "var(--text-primary)", margin: "0.75rem 0" }}>
            "Every garment starts with a thread of intent."
          </h2>
          <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", maxWidth: "720px", margin: "0 auto", lineHeight: 1.8 }}>
            At AETHER, we believe that minimalism is not the absence of something, but the perfect amount of everything. We source from the finest mills in Italy and Japan to ensure every piece in your archive lasts for a lifetime of seasons.
          </p>
        </div>
      </section>

      {/* The Permanent Collection Showcase */}
      <section style={{ maxWidth: "1440px", margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-camel)" }}>THE PERMANENT COLLECTION</span>
            <h2 style={{ fontSize: "2.25rem", color: "var(--text-primary)", marginTop: "0.25rem" }}>
              Foundation pieces designed to be worn on repeat.
            </h2>
          </div>
          <button
            onClick={() => { setActiveCategory("All"); setView("shop"); window.scrollTo(0, 0); }}
            className="btn-secondary"
            style={{ padding: "0.75rem 1.25rem", fontSize: "0.7rem" }}
          >
            VIEW ALL PIECES (124)
          </button>
        </div>

        {/* Product Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
          {featuredProducts.map((product) => {
            const isSaved = wishlist.includes(product.id);
            return (
              <div
                key={product.id}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justify: "space-between"
                }}
              >
                {/* Image & Badges */}
                <div
                  className="image-zoom-container"
                  style={{ aspectRatio: "3/4", cursor: "pointer", position: "relative" }}
                  onClick={() => openPDP(product)}
                >
                  <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

                  {product.badge && (
                    <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
                      <span className="badge-camel">{product.badge}</span>
                    </div>
                  )}

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                    style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1rem",
                      background: "rgba(15,15,18,0.7)",
                      backdropFilter: "blur(4px)",
                      border: "none",
                      color: isSaved ? "var(--accent-camel)" : "var(--text-primary)",
                      padding: "0.5rem",
                      cursor: "pointer",
                      display: "flex"
                    }}
                  >
                    <Heart size={16} fill={isSaved ? "var(--accent-camel)" : "none"} />
                  </button>
                </div>

                {/* Info Container */}
                <div style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.35rem" }}>
                    <h3
                      onClick={() => openPDP(product)}
                      style={{ fontSize: "1.125rem", color: "var(--text-primary)", cursor: "pointer" }}
                    >
                      {product.name}
                    </h3>
                    <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>
                      {formatPrice(product.price, product.priceEur)}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                    {product.subtitle}
                  </p>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => openPDP(product)}
                      className="btn-secondary"
                      style={{ flex: 1, padding: "0.65rem", fontSize: "0.7rem" }}
                    >
                      VIEW DETAILS
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="btn-primary"
                      style={{ padding: "0.65rem", fontSize: "0.7rem" }}
                      title="Quick Add to Bag"
                    >
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
