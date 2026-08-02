import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag } from "lucide-react";

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQty,
    removeFromCart,
    getSubtotal,
    formatPrice,
    FREE_SHIPPING_THRESHOLD,
    setView,
    currency,
    showToast
  } = useApp();

  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 25;
  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount + shipping);

  // Free shipping progress calculation
  const currentTotalUsd = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const progressPercent = Math.min(100, Math.round((currentTotalUsd / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - currentTotalUsd);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === "ARCHIVE10") {
      setDiscountPercent(10);
      showToast("Promo Code 'ARCHIVE10' applied (10% OFF)");
    } else if (promoCode.toUpperCase() === "AETHER20") {
      setDiscountPercent(20);
      showToast("Promo Code 'AETHER20' applied (20% OFF)");
    } else {
      showToast("Invalid Promo Code");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", justifyContent: "flex-end" }}>
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)"
        }}
      />

      {/* Slide-Out Panel */}
      <div
        className="animate-slide-right"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "460px",
          height: "100%",
          background: "var(--bg-surface)",
          borderLeft: "1px solid var(--border-light)",
          display: "flex",
          flexDirection: "column",
          zIndex: 10,
          color: "var(--text-primary)"
        }}
      >
        {/* Header */}
        <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-camel)", fontWeight: 700 }}>SHOPPING BAG</span>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--text-primary)" }}>
              YOUR SELECTION ({cart.reduce((s, i) => s + i.qty, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer", padding: "0.5rem" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ background: "var(--bg-card)", padding: "1.25rem 2rem", borderBottom: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
            <span style={{ color: "var(--text-secondary)" }}>
              {remainingForFreeShipping > 0 ? (
                <>Add <strong style={{ color: "var(--text-primary)" }}>${remainingForFreeShipping}</strong> more for free shipping</>
              ) : (
                <span style={{ color: "var(--accent-camel)", fontWeight: 700 }}>YOU QUALIFY FOR FREE COMPLIMENTARY SHIPPING</span>
              )}
            </span>
            <span style={{ color: "var(--accent-camel)", fontWeight: 700 }}>{progressPercent}%</span>
          </div>
          <div style={{ width: "100%", height: "4px", background: "var(--bg-surface)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ width: `${progressPercent}%`, height: "100%", background: "var(--accent-camel)", transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 2rem" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-muted)" }}>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>Your bag is empty.</p>
              <button
                onClick={() => { setIsCartOpen(false); setView("shop"); }}
                className="btn-secondary"
                style={{ fontSize: "0.7rem" }}
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {cart.map((item, idx) => {
                const itemImg = item.product.colors?.find(c => c.name === item.color)?.image || item.product.images[0];
                return (
                  <div key={idx} style={{ display: "flex", gap: "1.25rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border-light)" }}>
                    {/* Thumbnail */}
                    <div style={{ width: "90px", height: "115px", background: "var(--bg-card)", border: "1px solid var(--border-light)", flexShrink: 0 }} className="image-zoom-container">
                      <img src={itemImg} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <h4 style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)", cursor: "pointer" }} onClick={() => { setIsCartOpen(false); setView("pdp"); }}>
                            {item.product.name}
                          </h4>
                          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>
                            {formatPrice(item.product.price * item.qty, (item.product.priceEur || item.product.price) * item.qty)}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.35rem", display: "flex", gap: "0.75rem" }}>
                          <span>COLOR: {item.color.toUpperCase()}</span>
                          <span>•</span>
                          <span>SIZE: {item.size}</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-light)", background: "var(--bg-card)" }}>
                          <button
                            onClick={() => updateCartQty(idx, item.qty - 1)}
                            style={{ background: "none", border: "none", color: "var(--text-primary)", padding: "0.35rem 0.5rem", cursor: "pointer" }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ padding: "0 0.75rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)" }}>{item.qty}</span>
                          <button
                            onClick={() => updateCartQty(idx, item.qty + 1)}
                            style={{ background: "none", border: "none", color: "var(--text-primary)", padding: "0.35rem 0.5rem", cursor: "pointer" }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(idx)}
                          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.25rem" }}
                        >
                          <Trash2 size={12} /> REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary Footer */}
        {cart.length > 0 && (
          <div style={{ padding: "1.5rem 2rem", background: "var(--bg-card)", borderTop: "1px solid var(--border-light)" }}>
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} style={{ display: "flex", marginBottom: "1.25rem" }}>
              <input
                type="text"
                placeholder="PROMO CODE (e.g. ARCHIVE10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="input-minimal"
                style={{ fontSize: "0.75rem", borderRight: "none" }}
              />
              <button type="submit" className="btn-secondary" style={{ padding: "0.75rem 1.25rem", fontSize: "0.7rem", whiteSpace: "nowrap" }}>
                APPLY
              </button>
            </form>

            {/* Calculations */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.8125rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                <span>Subtotal</span>
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{formatPrice(subtotal)}</span>
              </div>
              {discountPercent > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--accent-camel)" }}>
                  <span>Discount ({discountPercent}%)</span>
                  <span style={{ fontWeight: 600 }}>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                <span>Estimated Shipping</span>
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{shipping === 0 ? "FREE" : formatPrice(25)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)", paddingTop: "0.75rem", borderTop: "1px solid var(--border-light)" }}>
                <span>TOTAL</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                setView("checkout");
              }}
              className="btn-primary"
              style={{ width: "100%", padding: "1.1rem" }}
            >
              PROCEED TO CHECKOUT <ArrowRight size={16} />
            </button>

            <div style={{ marginTop: "1rem", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.7rem", letterSpacing: "0.08em" }}>
              <ShieldCheck size={14} /> SECURE ENCRYPTED TRANSACTION
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
