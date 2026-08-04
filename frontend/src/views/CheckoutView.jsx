import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import confetti from "canvas-confetti";
import { ShieldCheck, Check, ArrowRight, Truck, CreditCard, Lock, Package, ArrowLeft } from "lucide-react";

export const CheckoutView = () => {
  const { user, cart, getSubtotal, formatPrice, FREE_SHIPPING_THRESHOLD, placeOrder, setView, showToast } = useApp();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review, 4: Confirmation

  // Form States
  const [shippingForm, setShippingForm] = useState({
    fullName: user ? user.name : "",
    street: "",
    city: "",
    zip: "",
    country: "United States",
    phone: user ? (user.phone || "") : "",
    deliveryMethod: "standard" // standard or express
  });

  const [paymentForm, setPaymentForm] = useState({
    method: "card", // card or wallet
    cardholder: user ? user.name.toUpperCase() : "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    sameAsShipping: true
  });

  const [agreedTerms, setAgreedTerms] = useState(true);
  const [completedOrder, setCompletedOrder] = useState(null);

  const subtotal = getSubtotal();
  const shippingFee = shippingForm.deliveryMethod === "express" ? 25 : (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 15);
  const estimatedTax = Math.round(subtotal * 0.08);
  const grandTotal = subtotal + shippingFee + estimatedTax;

  const handlePlaceOrder = () => {
    if (!agreedTerms) {
      showToast("Please agree to the Terms of Service to place your order.");
      return;
    }

    const order = placeOrder({
      total: grandTotal,
      shippingAddress: shippingForm
    });

    setCompletedOrder(order);
    setStep(4);

    // Trigger Confetti Celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }
  };

  if (step === 4 && completedOrder) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto", padding: "5rem 2rem", textAlign: "center" }}>
        <div style={{ background: "rgba(197, 160, 114, 0.15)", width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", color: "var(--accent-camel)" }}>
          <Check size={32} />
        </div>
        <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-camel)" }}>ORDER CONFIRMED</span>
        <h1 style={{ fontSize: "3rem", color: "var(--text-primary)", margin: "0.5rem 0 1rem" }}>
          Thank you for your order.
        </h1>
        <p style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: "500px", margin: "0 auto 2.5rem", lineHeight: 1.6 }}>
          Order <strong style={{ color: "var(--text-primary)" }}>{completedOrder.id}</strong>. We're getting your items ready for their journey. A confirmation email has been dispatched.
        </p>

        {/* Summary Card */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: "2rem", textAlign: "left", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "1rem", marginBottom: "1rem" }}>
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ESTIMATED DELIVERY</span>
              <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>{completedOrder.estimatedDelivery}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>TOTAL AMOUNT</span>
              <p style={{ fontWeight: 600, color: "var(--accent-camel)" }}>{formatPrice(completedOrder.total)}</p>
            </div>
          </div>

          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.75rem" }}>ITEMS IN SHIPMENT</span>
          {completedOrder.items.map((item, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
              <img src={item.image} alt={item.name} style={{ width: "48px", height: "60px", objectFit: "cover" }} />
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)" }}>{item.name}</p>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.color} / {item.size} • Qty: {item.qty}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <button onClick={() => setView("account")} className="btn-primary">
            TRACK ORDER IN ACCOUNT
          </button>
          <button onClick={() => setView("shop")} className="btn-secondary">
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 2rem 6rem" }}>
      {/* Checkout Progress Steps */}
      <div style={{ display: "flex", justifyContent: "center", gap: "3rem", marginBottom: "4rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: step >= 1 ? "var(--accent-camel)" : "var(--text-muted)" }}>
          <span style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid currentColor", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 600 }}>01</span>
          <span style={{ fontSize: "0.75rem", letterSpacing: "0.15em", fontWeight: 600 }}>SHIPPING</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: step >= 2 ? "var(--accent-camel)" : "var(--text-muted)" }}>
          <span style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid currentColor", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 600 }}>02</span>
          <span style={{ fontSize: "0.75rem", letterSpacing: "0.15em", fontWeight: 600 }}>PAYMENT</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: step >= 3 ? "var(--accent-camel)" : "var(--text-muted)" }}>
          <span style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid currentColor", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 600 }}>03</span>
          <span style={{ fontSize: "0.75rem", letterSpacing: "0.15em", fontWeight: 600 }}>REVIEW</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "4rem" }}>
        {/* Left Form Content */}
        <div>
          {/* STEP 1: SHIPPING */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", marginBottom: "1.5rem" }}>01 SHIPPING ADDRESS</h2>
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>FULL NAME</label>
                  <input type="text" value={shippingForm.fullName} onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })} className="input-minimal" required />
                </div>
                <div>
                  <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>STREET ADDRESS</label>
                  <input type="text" value={shippingForm.street} onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })} className="input-minimal" required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>CITY</label>
                    <input type="text" value={shippingForm.city} onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })} className="input-minimal" required />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>ZIP / POSTAL CODE</label>
                    <input type="text" value={shippingForm.zip} onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })} className="input-minimal" required />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>COUNTRY</label>
                  <input type="text" value={shippingForm.country} onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })} className="input-minimal" required />
                </div>

                {/* Delivery Options */}
                <h3 style={{ fontSize: "1rem", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "1.5rem" }}>DELIVERY METHOD</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <label
                    style={{
                      display: "flex",
                      justify: "space-between",
                      alignItems: "center",
                      padding: "1.25rem",
                      background: shippingForm.deliveryMethod === "standard" ? "var(--bg-card)" : "var(--bg-surface)",
                      border: shippingForm.deliveryMethod === "standard" ? "1px solid var(--accent-camel)" : "1px solid var(--border-light)",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <input type="radio" name="delivery" checked={shippingForm.deliveryMethod === "standard"} onChange={() => setShippingForm({ ...shippingForm, deliveryMethod: "standard" })} />
                      <div>
                        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>Standard Carbon-Neutral Shipping</p>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>3-5 business days</span>
                      </div>
                    </div>
                    <span style={{ fontWeight: 600, color: "var(--accent-camel)" }}>FREE</span>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      justify: "space-between",
                      alignItems: "center",
                      padding: "1.25rem",
                      background: shippingForm.deliveryMethod === "express" ? "var(--bg-card)" : "var(--bg-surface)",
                      border: shippingForm.deliveryMethod === "express" ? "1px solid var(--accent-camel)" : "1px solid var(--border-light)",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <input type="radio" name="delivery" checked={shippingForm.deliveryMethod === "express"} onChange={() => setShippingForm({ ...shippingForm, deliveryMethod: "express" })} />
                      <div>
                        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>Express Courier (PostNord / DHL)</p>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>1-2 business days</span>
                      </div>
                    </div>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>$25.00</span>
                  </label>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: "1.5rem" }}>
                  CONTINUE TO PAYMENT <ArrowRight size={16} />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: PAYMENT */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem" }}>02 PAYMENT METHOD</h2>
                <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "var(--accent-camel)", cursor: "pointer", fontSize: "0.75rem" }}>BACK TO SHIPPING</button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Payment Option Buttons */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <button
                    type="button"
                    onClick={() => setPaymentForm({ ...paymentForm, method: "card" })}
                    style={{
                      padding: "1rem",
                      background: paymentForm.method === "card" ? "var(--bg-card)" : "var(--bg-surface)",
                      border: paymentForm.method === "card" ? "1px solid var(--accent-camel)" : "1px solid var(--border-light)",
                      color: "var(--text-primary)",
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    CREDIT CARD
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentForm({ ...paymentForm, method: "wallet" })}
                    style={{
                      padding: "1rem",
                      background: paymentForm.method === "wallet" ? "var(--bg-card)" : "var(--bg-surface)",
                      border: paymentForm.method === "wallet" ? "1px solid var(--accent-camel)" : "1px solid var(--border-light)",
                      color: "var(--text-primary)",
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    DIGITAL WALLET (APPLE / GOOGLE)
                  </button>
                </div>

                <div>
                  <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>CARDHOLDER NAME</label>
                  <input type="text" value={paymentForm.cardholder} onChange={(e) => setPaymentForm({ ...paymentForm, cardholder: e.target.value })} className="input-minimal" required />
                </div>
                <div>
                  <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>CARD NUMBER</label>
                  <input type="text" value={paymentForm.cardNumber} onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })} className="input-minimal" required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>EXPIRY DATE</label>
                    <input type="text" value={paymentForm.expiry} onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value })} className="input-minimal" required />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>CVV</label>
                    <input type="password" value={paymentForm.cvv} onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })} className="input-minimal" required />
                  </div>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                  <input type="checkbox" checked={paymentForm.sameAsShipping} onChange={(e) => setPaymentForm({ ...paymentForm, sameAsShipping: e.target.checked })} />
                  Billing address same as shipping
                </label>

                <button type="submit" className="btn-primary" style={{ marginTop: "1.5rem" }}>
                  CONTINUE TO REVIEW <ArrowRight size={16} />
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem" }}>03 REVIEW YOUR ORDER</h2>
                <button onClick={() => setStep(2)} style={{ background: "none", border: "none", color: "var(--accent-camel)", cursor: "pointer", fontSize: "0.75rem" }}>BACK TO PAYMENT</button>
              </div>

              {/* Shipping & Payment Summary Card */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: "1.25rem" }}>
                  <span style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--accent-camel)", textTransform: "uppercase" }}>SHIPPING ADDRESS</span>
                  <p style={{ fontWeight: 600, marginTop: "0.5rem", color: "var(--text-primary)" }}>{shippingForm.fullName}</p>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{shippingForm.street}, {shippingForm.city} {shippingForm.zip}</p>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{shippingForm.country}</p>
                </div>

                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: "1.25rem" }}>
                  <span style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--accent-camel)", textTransform: "uppercase" }}>PAYMENT METHOD</span>
                  <p style={{ fontWeight: 600, marginTop: "0.5rem", color: "var(--text-primary)" }}>Visa ending in 4242</p>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>Expires {paymentForm.expiry}</p>
                </div>
              </div>

              {/* Terms Checkbox & CTA */}
              <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", padding: "1.5rem", marginBottom: "2rem" }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, cursor: "pointer" }}>
                  <input type="checkbox" checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)} style={{ marginTop: "0.2rem" }} />
                  <span>By placing this order, you agree to AETHER's Terms of Service and Privacy Policy. All international orders are subject to local duties.</span>
                </label>
              </div>

              <button onClick={handlePlaceOrder} className="btn-camel" style={{ width: "100%", padding: "1.25rem", fontSize: "0.875rem" }}>
                PLACE ORDER • {formatPrice(grandTotal)}
              </button>
            </div>
          )}
        </div>

        {/* Right Summary Column */}
        <div>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: "2rem", position: "sticky", top: "100px" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", marginBottom: "1.5rem" }}>Order Summary</h3>

            {/* Cart Items Preview */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "300px", overflowY: "auto", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "1.5rem" }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: "1rem" }}>
                  <img src={item.product.colors?.find(c => c.name === item.color)?.image || item.product.images[0]} alt="" style={{ width: "54px", height: "70px", objectFit: "cover" }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-primary)" }}>{item.product.name}</p>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{item.color} / {item.size} • Qty: {item.qty}</span>
                    <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", marginTop: "0.25rem" }}>{formatPrice(item.product.price * item.qty)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8125rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                <span>Estimated Tax</span>
                <span>{formatPrice(estimatedTax)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.125rem", fontWeight: 600, color: "var(--text-primary)", paddingTop: "1rem", borderTop: "1px solid var(--border-light)" }}>
                <span>TOTAL</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
