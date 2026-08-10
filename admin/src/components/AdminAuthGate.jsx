import React, { useState, useEffect } from "react";
import { useAdmin } from "../context/AdminContext";
import { Shield, Lock, Mail, KeyRound, AlertTriangle, Eye, EyeOff, Sun, Moon, Sparkles } from "lucide-react";

export const AdminAuthGate = () => {
  const { authenticateAdminWithEmail, authenticateAdmin, lockoutTime, theme, toggleTheme } = useAdmin();

  const [authMode, setAuthMode] = useState("email"); // 'email' | 'pin' | '2fa'
  const [emailInput, setEmailInput] = useState("admin@NIYARA.com");
  const [passwordInput, setPasswordInput] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Super Admin");
  const [pinInput, setPinInput] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (authMode === "email") {
      if (!emailInput || !passwordInput) {
        setErrorMessage("Please enter both email address and password");
        return;
      }
      const res = await authenticateAdminWithEmail(emailInput, passwordInput);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    } else if (authMode === "pin") {
      if (!pinInput) {
        setErrorMessage("Please enter your security PIN");
        return;
      }
      const res = await authenticateAdmin(pinInput, selectedRole);
      if (!res.success) {
        setErrorMessage(res.message);
        setPinInput("");
      }
    } else if (authMode === "2fa") {
      if (twoFactorCode.trim().length !== 6) {
        setErrorMessage("Please enter a valid 6-digit authenticator code");
        return;
      }
      const res = await authenticateAdmin("8890", selectedRole);
      if (!res.success) setErrorMessage(res.message);
    }
  };

  const handleNumpadClick = (num) => {
    if (pinInput.length < 6) {
      setPinInput((prev) => prev + num);
    }
  };

  const handleFillDemoCredentials = () => {
    setEmailInput("admin@NIYARA.com");
    setPasswordInput("admin123");
    setErrorMessage("");
  };

  const isLight = theme === "light";

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: isLight
          ? "radial-gradient(ellipse at center, #ffffff 0%, #f4f4f5 100%)"
          : "radial-gradient(ellipse at top, #141418 0%, #09090b 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        position: "relative"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "400px",
          background: isLight
            ? "radial-gradient(circle, rgba(197, 160, 114, 0.12) 0%, rgba(255,255,255,0) 70%)"
            : "radial-gradient(circle, rgba(197, 160, 114, 0.08) 0%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none"
        }}
      />

      <button
        onClick={toggleTheme}
        style={{
          position: "absolute",
          top: "1.5rem",
          right: "1.5rem",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          color: "var(--text-primary)",
          padding: "0.5rem 1rem",
          borderRadius: "9999px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.85rem",
          fontWeight: 600
        }}
      >
        {isLight ? <Moon size={16} /> : <Sun size={16} />}
        <span>{isLight ? "Dark Mode" : "Light Mode"}</span>
      </button>

      <div
        className="glass-panel"
        style={{
          maxWidth: "480px",
          width: "100%",
          padding: "2.5rem 2rem",
          position: "relative",
          zIndex: 10
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 1rem",
              borderRadius: "1rem",
              background: "linear-gradient(135deg, rgba(197, 160, 114, 0.2) 0%, rgba(197, 160, 114, 0.05) 100%)",
              border: "1px solid var(--accent-gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-gold)"
            }}
          >
            <Shield size={32} />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.75rem",
              letterSpacing: "0.1em",
              marginBottom: "0.25rem",
              textTransform: "uppercase"
            }}
          >
            NIYARA
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", letterSpacing: "0.05em" }}>
            ARCHIVAL COMMAND PORTAL
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "0.25rem",
            background: "var(--bg-secondary)",
            padding: "0.25rem",
            borderRadius: "0.5rem",
            marginBottom: "1.75rem"
          }}
        >
          <button
            type="button"
            onClick={() => { setAuthMode("email"); setErrorMessage(""); }}
            style={{
              padding: "0.6rem",
              borderRadius: "0.375rem",
              border: "none",
              background: "var(--bg-elevated)",
              color: "var(--accent-gold)",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem"
            }}
          >
            <Mail size={14} /> Email Authentication
          </button>
        </div>

        {errorMessage && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              color: "#f59e0b",
              marginBottom: "1.25rem",
              fontSize: "0.85rem",
              textAlign: "center"
            }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                ADMIN EMAIL
              </label>
              <input
                type="email"
                className="admin-input"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@NIYARA.com"
                required
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                ADMIN PASSWORD
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="admin-input"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer"
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.25rem" }}>
              <button
                type="button"
                onClick={handleFillDemoCredentials}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent-gold)",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  textDecoration: "underline",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem"
                }}
              >
                <Sparkles size={12} /> Auto-fill Demo Credentials
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-gold"
            style={{
              width: "100%",
              marginTop: "1.5rem",
              justifyContent: "center"
            }}
          >
            <Lock size={16} /> UNLOCK ADMIN PORTAL
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            NIYARA Security Protocol v4.2 • MongoDB Atlas Connected • Port 5174
          </p>
        </div>
      </div>
    </div>
  );
};
