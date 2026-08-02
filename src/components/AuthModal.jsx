import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { X, Lock, Mail, User, Eye, EyeOff, ShieldCheck } from "lucide-react";

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, setUser, showToast } = useApp();

  const [email, setEmail] = useState("hello@aether.co");
  const [password, setPassword] = useState("••••••••");
  const [fullName, setFullName] = useState("John Doe");
  const [showPassword, setShowPassword] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({
      name: fullName || "John Doe",
      email: email,
      isVerified: true,
      phone: "+1 (555) 000-0000",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"
    });
    setIsAuthModalOpen(false);
    showToast(authMode === "login" ? "Welcome back, Member." : "Account created successfully.");
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      {/* Backdrop */}
      <div
        onClick={() => setIsAuthModalOpen(false)}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
      />

      {/* Modal Card */}
      <div
        className="glass-modal animate-fade-in"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "440px",
          padding: "2.5rem 2rem",
          zIndex: 10,
          color: "var(--text-primary)"
        }}
      >
        <button
          onClick={() => setIsAuthModalOpen(false)}
          style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", letterSpacing: "0.2em", display: "block", marginBottom: "0.25rem" }}>
            NIYARI
          </span>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-camel)" }}>
            ARCHIVE ACCESS
          </span>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border-light)", marginBottom: "2rem" }}>
          <button
            onClick={() => setAuthMode("login")}
            style={{
              flex: 1,
              padding: "0.75rem",
              background: "none",
              border: "none",
              borderBottom: authMode === "login" ? "2px solid var(--accent-camel)" : "none",
              color: authMode === "login" ? "var(--text-primary)" : "var(--text-muted)",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            LOGIN
          </button>
          <button
            onClick={() => setAuthMode("signup")}
            style={{
              flex: 1,
              padding: "0.75rem",
              background: "none",
              border: "none",
              borderBottom: authMode === "signup" ? "2px solid var(--accent-camel)" : "none",
              color: authMode === "signup" ? "var(--text-primary)" : "var(--text-muted)",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            SIGN UP
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {authMode === "signup" && (
            <div>
              <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                FULL NAME
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-minimal"
                required
              />
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-minimal"
              required
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                PASSWORD
              </label>
              {authMode === "login" && (
                <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast("Password reset link sent."); }} style={{ fontSize: "0.65rem", color: "var(--accent-camel)", textDecoration: "none", letterSpacing: "0.1em" }}>
                  FORGOT?
                </a>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-minimal"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: "0.75rem", width: "100%", padding: "1rem" }}>
            {authMode === "login" ? "SECURE LOGIN" : "CREATE ACCOUNT"}
          </button>
        </form>

        {/* Social Dividers */}
        <div style={{ textAlign: "center", margin: "1.75rem 0 1.25rem", position: "relative" }}>
          <span style={{ background: "var(--bg-card)", padding: "0 0.75rem", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-muted)", position: "relative", zIndex: 1 }}>
            OR CONTINUE WITH
          </span>
          <div style={{ position: "absolute", top: "50%", insetX: 0, height: "1px", background: "var(--border-light)" }} />
        </div>

        {/* Social Buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <button
            type="button"
            onClick={() => handleSubmit({ preventDefault: () => {} })}
            className="btn-secondary"
            style={{ fontSize: "0.7rem", padding: "0.75rem" }}
          >
            GOOGLE
          </button>
          <button
            type="button"
            onClick={() => handleSubmit({ preventDefault: () => {} })}
            className="btn-secondary"
            style={{ fontSize: "0.7rem", padding: "0.75rem" }}
          >
            APPLE
          </button>
        </div>

        {/* Toggle Mode Footer */}
        <div style={{ marginTop: "1.75rem", textAlign: "center" }}>
          {authMode === "login" ? (
            <button
              onClick={() => setAuthMode("signup")}
              style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: "0.75rem", cursor: "pointer" }}
            >
              Don't have an account? <span style={{ color: "var(--accent-camel)", fontWeight: 600 }}>Sign Up</span>
            </button>
          ) : (
            <button
              onClick={() => setAuthMode("login")}
              style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: "0.75rem", cursor: "pointer" }}
            >
              Already have an account? <span style={{ color: "var(--accent-camel)", fontWeight: 600 }}>Login</span>
            </button>
          )}
        </div>

        {/* Bottom Terms */}
        <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--border-light)", paddingTop: "1rem", display: "flex", justifyContent: "center", gap: "1.5rem", fontSize: "0.65rem", color: "var(--text-muted)" }}>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Support</span>
        </div>
      </div>
    </div>
  );
};
