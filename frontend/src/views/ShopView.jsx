import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Filter, SlidersHorizontal, Heart, ShoppingBag, X } from "lucide-react";

export const ShopView = () => {
  const { activeCategory, setActiveCategory, openPDP, addToCart, toggleWishlist, wishlist, formatPrice, products } = useApp();

  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const categories = ["All", "Outerwear", "Tailoring", "Essentials", "Denim", "Objects"];
  const sizes = ["All", "XS", "S", "M", "L", "XL"];
  const colors = ["All", "Camel", "Onyx", "Oatmeal", "Graphite", "Chocolate Brown"];

  // Filtering Logic
  let filtered = products.filter((p) => {
    if (activeCategory !== "All" && activeCategory !== "Women") {
      if (p.category !== activeCategory) return false;
    }
    if (activeCategory === "Women" && p.gender !== "Women" && p.gender !== "Unisex") return false;

    if (selectedSize !== "All" && p.sizes && !p.sizes.includes(selectedSize)) return false;
    if (selectedColor !== "All" && p.colors && !p.colors.some((c) => c.name.toLowerCase().includes(selectedColor.toLowerCase()))) return false;

    return true;
  });

  // Sorting Logic
  if (sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const clearAllFilters = () => {
    setSelectedSize("All");
    setSelectedColor("All");
    setActiveCategory("All");
  };

  return (
    <div className="animate-fade-in page-container">
      {/* Category Header */}
      <div style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
          <span>Home</span> / <span>Shop</span> / <span style={{ color: "var(--text-primary)" }}>{activeCategory}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", color: "var(--text-primary)" }}>
              {activeCategory === "All" ? "Archive Collection" : `${activeCategory}'s Collection`}
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              Explore our latest architectural cuts crafted for effortless wearability.
            </p>
          </div>
          <span style={{ fontSize: "0.875rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
            {filtered.length} {filtered.length === 1 ? "Result" : "Results"}
          </span>
        </div>
      </div>

      {/* Toolbar: Category Pills & Sort Selection */}
      <div
        style={{
          display: "flex",
          justify: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          padding: "1.25rem 0",
          borderTop: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)",
          marginBottom: "2.5rem"
        }}
      >
        {/* Category Filter Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? "var(--accent-camel)" : "var(--bg-card)",
                color: activeCategory === cat ? "#000" : "var(--text-secondary)",
                border: "1px solid var(--border-light)",
                padding: "0.5rem 1rem",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: activeCategory === cat ? 600 : 400,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all var(--transition-fast)"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Toggle & Sort Select */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer"
            }}
          >
            <SlidersHorizontal size={16} /> Filter & Sort
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
                color: "var(--text-primary)",
                padding: "0.4rem 0.75rem",
                fontSize: "0.75rem",
                outline: "none"
              }}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expandable Filter Box */}
      {showFilterDrawer && (
        <div
          className="animate-fade-in"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            padding: "2rem",
            marginBottom: "2.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem"
          }}
        >
          {/* Size Filter */}
          <div>
            <h4 style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent-camel)", marginBottom: "1rem" }}>
              SIZE
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  style={{
                    background: selectedSize === s ? "var(--text-primary)" : "var(--bg-surface)",
                    color: selectedSize === s ? "var(--bg-primary)" : "var(--text-secondary)",
                    border: "1px solid var(--border-light)",
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.75rem",
                    cursor: "pointer"
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div>
            <h4 style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent-camel)", marginBottom: "1rem" }}>
              COLOR
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  style={{
                    background: selectedColor === c ? "var(--text-primary)" : "var(--bg-surface)",
                    color: selectedColor === c ? "var(--bg-primary)" : "var(--text-secondary)",
                    border: "1px solid var(--border-light)",
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.75rem",
                    cursor: "pointer"
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button onClick={clearAllFilters} className="btn-secondary" style={{ width: "100%", fontSize: "0.7rem" }}>
              CLEAR ALL FILTERS
            </button>
          </div>
        </div>
      )}

      {/* Active Filter Badges */}
      {(selectedSize !== "All" || selectedColor !== "All" || activeCategory !== "All") && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Active Filters:</span>
          {activeCategory !== "All" && (
            <span className="badge-minimal" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              Category: {activeCategory} <X size={12} style={{ cursor: "pointer" }} onClick={() => setActiveCategory("All")} />
            </span>
          )}
          {selectedSize !== "All" && (
            <span className="badge-minimal" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              Size: {selectedSize} <X size={12} style={{ cursor: "pointer" }} onClick={() => setSelectedSize("All")} />
            </span>
          )}
          {selectedColor !== "All" && (
            <span className="badge-minimal" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              Color: {selectedColor} <X size={12} style={{ cursor: "pointer" }} onClick={() => setSelectedColor("All")} />
            </span>
          )}
        </div>
      )}

      {/* Catalog Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "6rem 2rem", background: "var(--bg-surface)", border: "1px solid var(--border-light)" }}>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            No products match the selected filters.
          </p>
          <button onClick={clearAllFilters} className="btn-camel">
            RESET FILTERS
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {filtered.map((product) => {
            const isSaved = wishlist.includes(product.id);
            return (
              <div
                key={product.id}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                {/* Image */}
                <div
                  className="image-zoom-container"
                  style={{ aspectRatio: "3/4", cursor: "pointer", position: "relative" }}
                  onClick={() => openPDP(product)}
                >
                  <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

                  {product.isNew && (
                    <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
                      <span className="badge-camel">NEW ARRIVAL</span>
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

                {/* Body */}
                <div style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.25rem" }}>
                    <h3 onClick={() => openPDP(product)} style={{ fontSize: "1.125rem", color: "var(--text-primary)", cursor: "pointer" }}>
                      {product.name}
                    </h3>
                    <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>
                      {formatPrice(product.price, product.priceEur)}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                    {product.subtitle}
                  </p>

                  {/* Color Swatch Dots */}
                  <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1rem" }}>
                    {product.colors && product.colors.map((c, i) => (
                      <span
                        key={i}
                        title={c.name}
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background: c.hex,
                          border: "1px solid rgba(255,255,255,0.2)",
                          display: "inline-block"
                        }}
                      />
                    ))}
                  </div>

                  {/* Buttons */}
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
                      title="Quick Add"
                    >
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
