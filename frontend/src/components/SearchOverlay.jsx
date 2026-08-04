import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Search as SearchIcon, X, ArrowRight } from "lucide-react";

export const SearchOverlay = () => {
  const { isSearchOpen, setIsSearchOpen, openPDP, formatPrice, products } = useApp();
  const [query, setQuery] = useState("");

  if (!isSearchOpen) return null;

  const trendingSearches = ["Merino Wool Wrap Coat", "Technical Shell", "Selvedge Denim", "Cashmere Knit", "Atmosphere Sneaker"];
  const popularCategories = ["Women", "Outerwear", "Essentials", "Denim", "Objects"];

  const filteredProducts = query.trim() === ""
    ? []
    : products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
      );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", flexDirection: "column" }}>
      {/* Backdrop */}
      <div
        onClick={() => setIsSearchOpen(false)}
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--glass-modal-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)"
        }}
      />

      {/* Content Container */}
      <div
        className="animate-fade-in"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "840px",
          margin: "0 auto",
          padding: "5rem 2rem 3rem",
          zIndex: 10,
          color: "var(--text-primary)"
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsSearchOpen(false)}
          style={{
            position: "absolute",
            top: "2.5rem",
            right: "2rem",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-light)",
            color: "var(--text-primary)",
            cursor: "pointer",
            padding: "0.6rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%"
          }}
          title="Close search"
        >
          <X size={20} />
        </button>

        {/* Input Form */}
        <div style={{ position: "relative", marginBottom: "3.5rem" }}>
          <input
            type="text"
            placeholder="Search archival pieces, coats, knits, denim..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              borderBottom: "2px solid var(--accent-camel)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-serif)",
              fontSize: "2.25rem",
              padding: "1rem 3rem 1rem 0",
              outline: "none"
            }}
            autoFocus
          />
          <SearchIcon size={28} style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)", color: "var(--accent-camel)" }} />
        </div>

        {/* Live Search Results */}
        {query.trim() !== "" ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent-camel)", fontWeight: 700 }}>
                LIVE RESULTS ({filteredProducts.length})
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", padding: "2.5rem 0", textAlign: "center" }}>
                No architectural pieces found matching "<strong style={{ color: "var(--text-primary)" }}>{query}</strong>". Try searching for 'Merino' or 'Trench'.
              </p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem", maxHeight: "55vh", overflowY: "auto", paddingRight: "0.5rem" }}>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      openPDP(product);
                    }}
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-light)",
                      padding: "1rem",
                      cursor: "pointer",
                      transition: "all var(--transition-fast)"
                    }}
                    className="image-zoom-container"
                  >
                    <div style={{ aspectRatio: "3/4", marginBottom: "0.75rem", background: "var(--bg-surface)" }}>
                      <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <span style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--accent-camel)", textTransform: "uppercase", fontWeight: 600 }}>{product.category}</span>
                    <h4 style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--text-primary)", marginTop: "0.25rem" }}>{product.name}</h4>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", marginTop: "0.5rem", display: "block" }}>{formatPrice(product.price, product.priceEur)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Default State: Trending & Categories */
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
            <div>
              <h4 style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-camel)", marginBottom: "1.5rem", fontWeight: 700 }}>
                TRENDING SEARCHES
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {trendingSearches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(item)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--text-primary)",
                      textAlign: "left",
                      fontSize: "1rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.25rem 0",
                      transition: "color 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.color = "var(--accent-camel)"}
                    onMouseLeave={(e) => e.target.style.color = "var(--text-primary)"}
                  >
                    <ArrowRight size={16} style={{ color: "var(--accent-camel)", flexShrink: 0 }} />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-camel)", marginBottom: "1.5rem", fontWeight: 700 }}>
                POPULAR CATEGORIES
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {popularCategories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(cat)}
                    className="btn-secondary"
                    style={{ padding: "0.65rem 1.25rem", fontSize: "0.75rem", fontWeight: 600 }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
