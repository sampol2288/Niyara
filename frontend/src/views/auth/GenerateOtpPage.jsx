import React, { useState } from "react";
import { Zap, Mail, User, AlertCircle, CheckCircle } from "lucide-react";
import { authApi } from "../../api/authApi";

const PURPOSES = ["signup", "reset", "login", "verify", "custom"];

export const GenerateOtpPage = ({ onNavigate }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("signup");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError("Email address is required."); return; }
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const data = await authApi.generateOtp(email.trim(), name.trim() || "Member", purpose);
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || "Failed to generate OTP.");
      }
    } catch {
      setError("Server connection failed. Check backend is running.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-page-wrapper auth-page-wrapper-wide">
      <div className="auth-page-card auth-admin-card animate-fade-in">
        <div className="auth-admin-header">
          <div className="auth-admin-icon auth-admin-icon-yellow"><Zap size={22} /></div>
          <div>
            <span className="auth-brand-label">DEV / ADMIN TOOL</span>
            <h1 className="auth-page-title" style={{ fontSize: "1.75rem" }}>Generate OTP</h1>
            <p className="auth-page-subtitle">Manually dispatch a 6-digit one-time password to any email</p>
          </div>
        </div>

        {error && <div className="auth-error-banner"><AlertCircle size={15} /><span>{error}</span></div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">TARGET EMAIL ADDRESS</label>
            <div className="auth-input-wrap">
              <Mail size={15} className="auth-input-icon" />
              <input
                id="gen-otp-email"
                type="email"
                placeholder="recipient@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input auth-input-icon-left"
                required
              />
            </div>
          </div>

          {/* Name */}
          <div className="auth-field">
            <label className="auth-label">RECIPIENT NAME (OPTIONAL)</label>
            <div className="auth-input-wrap">
              <User size={15} className="auth-input-icon" />
              <input
                id="gen-otp-name"
                type="text"
                placeholder="Member name for email personalization"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-input auth-input-icon-left"
              />
            </div>
          </div>

          {/* Purpose */}
          <div className="auth-field">
            <label className="auth-label">OTP PURPOSE</label>
            <div className="auth-purpose-grid">
              {PURPOSES.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPurpose(p)}
                  className={`auth-purpose-pill ${purpose === p ? "auth-purpose-active" : ""}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="auth-btn-camel" disabled={loading}>
            {loading
              ? <span className="auth-spinner auth-spinner-dark" />
              : <><Zap size={15} /> GENERATE &amp; SEND OTP</>}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className="auth-otp-result animate-fade-in">
            <div className="auth-otp-result-header">
              <CheckCircle size={18} style={{ color: "#10b981" }} />
              <span>OTP Dispatched via Email</span>
            </div>
            <p className="auth-result-message" style={{ textAlign: "center", marginTop: "0.75rem" }}>{result.message}</p>
            <p style={{ fontSize: "0.8rem", color: "#a1a1aa", textAlign: "center", marginTop: "0.5rem" }}>
              The code was sent to <strong style={{ color: "var(--text-primary)" }}>{email}</strong> by email only.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
