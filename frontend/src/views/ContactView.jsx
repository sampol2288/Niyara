import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Mail, Phone, MapPin, Send, Check } from "lucide-react";

export const ContactView = () => {
  const { showToast } = useApp();

  const [form, setForm] = useState({
    type: "General Inquiries",
    fullName: "",
    email: "",
    orderNumber: "",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast("Your concierge inquiry has been transmitted.");
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 2rem 6rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-camel)" }}>CLIENT SERVICES</span>
        <h1 style={{ fontSize: "3.25rem", color: "var(--text-primary)", margin: "0.5rem 0 1rem" }}>
          Contact & Support
        </h1>
        <p style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.7 }}>
          How can we assist you today? Our team is dedicated to providing a seamless experience across all AETHER touchpoints.
        </p>
      </div>

      {/* 3 Touchpoint Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginBottom: "5rem" }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: "2.5rem 2rem", textAlign: "center" }}>
          <h3 style={{ fontSize: "1rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
            GENERAL INQUIRIES
          </h3>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            For any questions regarding our collections, sizing, or studio practice.
          </p>
          <a href="mailto:hello@aether.studio" style={{ color: "var(--accent-camel)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}>
            hello@aether.studio
          </a>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: "2.5rem 2rem", textAlign: "center" }}>
          <h3 style={{ fontSize: "1rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
            PRESS & EDITORIAL
          </h3>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            Editorial requests, asset packages, lookbooks, and interview inquiries.
          </p>
          <a href="mailto:press@aether.studio" style={{ color: "var(--accent-camel)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}>
            press@aether.studio
          </a>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: "2.5rem 2rem", textAlign: "center" }}>
          <h3 style={{ fontSize: "1rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
            WHOLESALE
          </h3>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            Global distribution and stockist partnership opportunities.
          </p>
          <a href="mailto:trade@aether.studio" style={{ color: "var(--accent-camel)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}>
            trade@aether.studio
          </a>
        </div>
      </div>

      {/* Inquiry Form */}
      <div style={{ maxWidth: "800px", margin: "0 auto", background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: "3rem 2.5rem" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", marginBottom: "1.5rem", textAlign: "center" }}>
          Transmit a Direct Inquiry
        </h2>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--accent-camel)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <Check size={28} />
            </div>
            <h3 style={{ fontSize: "1.5rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>Inquiry Transmitted</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>A concierge representative will respond within 24 business hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>INQUIRY TYPE</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input-minimal"
              >
                <option>General Inquiries</option>
                <option>Press & Media</option>
                <option>Wholesale Partnerships</option>
                <option>Order Assistance</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>FULL NAME</label>
                <input type="text" placeholder="E.g., Julian Thorne" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="input-minimal" required />
              </div>
              <div>
                <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>EMAIL ADDRESS</label>
                <input type="email" placeholder="name@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-minimal" required />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>ORDER NUMBER (OPTIONAL)</label>
              <input type="text" placeholder="#AE-XXXXX" value={form.orderNumber} onChange={(e) => setForm({ ...form, orderNumber: e.target.value })} className="input-minimal" />
            </div>

            <div>
              <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>MESSAGE</label>
              <textarea placeholder="How can our concierge assist you today?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-minimal" rows={5} required />
            </div>

            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              By submitting this form, you agree to our privacy policy and terms of service.
            </p>

            <button type="submit" className="btn-primary" style={{ width: "100%", padding: "1.1rem" }}>
              SUBMIT INQUIRY <Send size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
