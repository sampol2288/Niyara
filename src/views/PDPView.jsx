import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { PRODUCTS, MOCK_REVIEWS } from "../data/products";
import { Heart, ShoppingBag, Star, ChevronDown, ChevronUp, ShieldCheck, RefreshCw, Truck, X, Plus, Minus, Check } from "lucide-react";

export const PDPView = () => {
  const { selectedProduct, addToCart, toggleWishlist, wishlist, formatPrice, setView, openPDP, showToast } = useApp();

  const product = selectedProduct || PRODUCTS[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "Camel");
  const [selectedSize, setSelectedSize] = useState(product.sizes[2] || "M");
  const [qty, setQty] = useState(1);

  // Accordion states
  const [openAccordion, setOpenAccordion] = useState("description");

  // Modals
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", title: "", comment: "", rating: 5 });

  const isSaved = wishlist.includes(product.id);

  const toggleAccordion = (key) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    showToast("Thank you for your review! It will be published after verification.");
    setShowReviewModal(false);
    setNewReview({ name: "", title: "", comment: "", rating: 5 });
  };

  const currentImage = product.colors.find((c) => c.name === selectedColor)?.image || product.images[activeImageIndex] || product.images[0];

  return (
    <div className="animate-fade-in" style={{ maxWidth: "1440px", margin: "0 auto", padding: "2rem 2rem 6rem" }}>
      {/* Breadcrumbs */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "2rem" }}>
        <span style={{ cursor: "pointer" }} onClick={() => setView("home")}>Home</span> /
        <span style={{ cursor: "pointer" }} onClick={() => setView("shop")}>{product.gender || "Women"}</span> /
        <span style={{ cursor: "pointer" }} onClick={() => setView("shop")}>{product.category}</span> /
        <span style={{ color: "var(--text-primary)" }}>{product.name}</span>
      </div>

      {/* Main PDP Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "4rem", marginBottom: "6rem" }}>
        {/* Left Column: Gallery */}
        <div>
          {/* Main Hero Image */}
          <div className="image-zoom-container" style={{ aspectRatio: "3/4", background: "var(--bg-card)", border: "1px solid var(--border-light)", marginBottom: "1rem" }}>
            <img src={currentImage} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          {/* Thumbnails */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            {product.images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                style={{
                  aspectRatio: "3/4",
                  background: "var(--bg-card)",
                  border: activeImageIndex === idx ? "2px solid var(--accent-camel)" : "1px solid var(--border-light)",
                  cursor: "pointer",
                  overflow: "hidden"
                }}
              >
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-camel)", fontWeight: 600, marginBottom: "0.5rem" }}>
            {product.subtitle}
          </span>
          <h1 style={{ fontSize: "2.5rem", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
            {product.name}
          </h1>

          {/* Price & Rating */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border-light)" }}>
            <span style={{ fontSize: "1.75rem", fontWeight: 500, color: "var(--text-primary)" }}>
              {formatPrice(product.price, product.priceEur)}
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
              <div style={{ display: "flex", color: "var(--accent-camel)" }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{product.rating}</span>
              <span>({product.reviewCount} Reviews)</span>
            </div>
          </div>

          {/* Color Selector */}
          <div style={{ marginBottom: "1.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
              <span style={{ color: "var(--text-secondary)" }}>COLOR:</span>
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{selectedColor.toUpperCase()}</span>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1rem",
                    background: selectedColor === c.name ? "var(--bg-hover)" : "var(--bg-surface)",
                    border: selectedColor === c.name ? "1px solid var(--accent-camel)" : "1px solid var(--border-light)",
                    color: "var(--text-primary)",
                    fontSize: "0.75rem",
                    cursor: "pointer"
                  }}
                >
                  <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: c.hex, display: "inline-block", border: "1px solid rgba(255,255,255,0.2)" }} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
              <span style={{ color: "var(--text-secondary)" }}>SIZE:</span>
              <button
                onClick={() => setShowSizeGuide(true)}
                style={{ background: "none", border: "none", color: "var(--accent-camel)", cursor: "pointer", textDecoration: "underline", fontSize: "0.75rem" }}
              >
                Size Guide
              </button>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  style={{
                    width: "48px",
                    height: "48px",
                    background: selectedSize === s ? "var(--text-primary)" : "var(--bg-surface)",
                    color: selectedSize === s ? "var(--bg-primary)" : "var(--text-primary)",
                    border: selectedSize === s ? "1px solid var(--text-primary)" : "1px solid var(--border-light)",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all var(--transition-fast)"
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-light)", background: "var(--bg-surface)" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: "none", border: "none", color: "var(--text-primary)", padding: "0.75rem 1rem", cursor: "pointer" }}>
                <Minus size={14} />
              </button>
              <span style={{ padding: "0 0.5rem", fontSize: "0.875rem", fontWeight: 600 }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ background: "none", border: "none", color: "var(--text-primary)", padding: "0.75rem 1rem", cursor: "pointer" }}>
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={() => addToCart(product, selectedColor, selectedSize, qty)}
              className="btn-primary"
              style={{ flex: 1, padding: "1rem" }}
            >
              ADD TO BAG • {formatPrice(product.price * qty, product.priceEur * qty)}
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              className="btn-secondary"
              style={{ padding: "1rem" }}
              title="Add to Wishlist"
            >
              <Heart size={18} fill={isSaved ? "var(--accent-camel)" : "none"} color={isSaved ? "var(--accent-camel)" : "var(--text-primary)"} />
            </button>
          </div>

          {/* Features Callout list */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", padding: "1.25rem", background: "var(--bg-card)", border: "1px solid var(--border-light)", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              <Truck size={16} style={{ color: "var(--accent-camel)" }} /> 3-5 Business Days Delivery
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              <RefreshCw size={16} style={{ color: "var(--accent-camel)" }} /> 30-Day Effortless Returns
            </div>
          </div>

          {/* Accordions */}
          <div style={{ borderTop: "1px solid var(--border-light)" }}>
            {/* Description */}
            <div style={{ borderBottom: "1px solid var(--border-light)" }}>
              <button
                onClick={() => toggleAccordion("description")}
                style={{ width: "100%", padding: "1.25rem 0", background: "none", border: "none", color: "var(--text-primary)", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontSize: "0.8125rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
              >
                <span>DESCRIPTION</span>
                {openAccordion === "description" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordion === "description" && (
                <p style={{ paddingBottom: "1.25rem", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  {product.description}
                </p>
              )}
            </div>

            {/* Materials & Care */}
            <div style={{ borderBottom: "1px solid var(--border-light)" }}>
              <button
                onClick={() => toggleAccordion("materials")}
                style={{ width: "100%", padding: "1.25rem 0", background: "none", border: "none", color: "var(--text-primary)", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontSize: "0.8125rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
              >
                <span>MATERIALS & CARE</span>
                {openAccordion === "materials" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordion === "materials" && (
                <ul style={{ paddingBottom: "1.25rem", paddingLeft: "1.25rem", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  {product.materials.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              )}
            </div>

            {/* Shipping & Returns */}
            <div style={{ borderBottom: "1px solid var(--border-light)" }}>
              <button
                onClick={() => toggleAccordion("shipping")}
                style={{ width: "100%", padding: "1.25rem 0", background: "none", border: "none", color: "var(--text-primary)", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontSize: "0.8125rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
              >
                <span>SHIPPING & RETURNS</span>
                {openAccordion === "shipping" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordion === "shipping" && (
                <p style={{ paddingBottom: "1.25rem", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  {product.shippingInfo}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section style={{ borderTop: "1px solid var(--border-light)", paddingTop: "4rem", marginBottom: "6rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
          <div>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-camel)" }}>CLIENT FEEDBACK</span>
            <h2 style={{ fontSize: "2.25rem", color: "var(--text-primary)" }}>
              Customer Reviews ({product.reviewCount})
            </h2>
          </div>
          <button onClick={() => setShowReviewModal(true)} className="btn-secondary" style={{ fontSize: "0.7rem" }}>
            WRITE A REVIEW
          </button>
        </div>

        {/* Rating Breakdown & List */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem" }}>
          {/* Left Summary */}
          <div style={{ background: "var(--bg-card)", padding: "2rem", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "3.5rem", fontFamily: "var(--font-serif)", color: "var(--text-primary)", lineHeight: 1 }}>
              {product.rating}
              <span style={{ fontSize: "1.25rem", color: "var(--text-muted)" }}> / 5.0</span>
            </div>
            <div style={{ display: "flex", color: "var(--accent-camel)", margin: "0.75rem 0 1.5rem" }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>

            {/* Distribution Bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>5 stars</span>
                <div style={{ flex: 1, height: "4px", background: "var(--bg-surface)", borderRadius: "2px" }}><div style={{ width: "82%", height: "100%", background: "var(--accent-camel)" }} /></div>
                <span>102</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>4 stars</span>
                <div style={{ flex: 1, height: "4px", background: "var(--bg-surface)", borderRadius: "2px" }}><div style={{ width: "12%", height: "100%", background: "var(--accent-camel)" }} /></div>
                <span>15</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>3 stars</span>
                <div style={{ flex: 1, height: "4px", background: "var(--bg-surface)", borderRadius: "2px" }}><div style={{ width: "6%", height: "100%", background: "var(--accent-camel)" }} /></div>
                <span>7</span>
              </div>
            </div>
          </div>

          {/* Right Reviews List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {MOCK_REVIEWS.map((rev) => (
              <div key={rev.id} style={{ borderBottom: "1px solid var(--border-light)", paddingBottom: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{rev.author}</span>
                    {rev.verified && (
                      <span className="badge-minimal" style={{ fontSize: "0.6rem" }}>VERIFIED BUYER</span>
                    )}
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{rev.date}</span>
                </div>
                <div style={{ display: "flex", color: "var(--accent-camel)", marginBottom: "0.75rem" }}>
                  {[...Array(rev.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <h4 style={{ fontSize: "1rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>{rev.title}</h4>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div onClick={() => setShowSizeGuide(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)" }} />
          <div className="glass-modal" style={{ position: "relative", width: "100%", maxWidth: "600px", padding: "2.5rem", zIndex: 10, color: "var(--text-primary)" }}>
            <button onClick={() => setShowSizeGuide(false)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "var(--text-primary)" }}><X size={20} /></button>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", marginBottom: "1.5rem" }}>ARCHITECTURAL SIZE GUIDE</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-light)", color: "var(--accent-camel)" }}>
                  <th style={{ padding: "0.75rem" }}>SIZE</th>
                  <th style={{ padding: "0.75rem" }}>CHEST (IN)</th>
                  <th style={{ padding: "0.75rem" }}>WAIST (IN)</th>
                  <th style={{ padding: "0.75rem" }}>EU SIZE</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}><td style={{ padding: "0.75rem" }}>XS</td><td>34 - 36</td><td>28 - 30</td><td>44</td></tr>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}><td style={{ padding: "0.75rem" }}>S</td><td>36 - 38</td><td>30 - 32</td><td>46</td></tr>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}><td style={{ padding: "0.75rem" }}>M</td><td>38 - 40</td><td>32 - 34</td><td>48</td></tr>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}><td style={{ padding: "0.75rem" }}>L</td><td>40 - 42</td><td>34 - 36</td><td>50</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {showReviewModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div onClick={() => setShowReviewModal(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)" }} />
          <div className="glass-modal" style={{ position: "relative", width: "100%", maxWidth: "500px", padding: "2.5rem", zIndex: 10, color: "var(--text-primary)" }}>
            <button onClick={() => setShowReviewModal(false)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "var(--text-primary)" }}><X size={20} /></button>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", marginBottom: "1.5rem" }}>WRITE A REVIEW</h3>
            <form onSubmit={handleReviewSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <input type="text" placeholder="YOUR NAME" value={newReview.name} onChange={(e) => setNewReview({ ...newReview, name: e.target.value })} className="input-minimal" required />
              <input type="text" placeholder="REVIEW TITLE" value={newReview.title} onChange={(e) => setNewReview({ ...newReview, title: e.target.value })} className="input-minimal" required />
              <textarea placeholder="SHARE YOUR EXPERIENCE WITH THIS PIECE..." value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} className="input-minimal" rows={4} required />
              <button type="submit" className="btn-primary">SUBMIT REVIEW</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
