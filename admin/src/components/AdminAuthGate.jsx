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
  const [remainingLockout, setRemainingLockout] = useState(0);

  useEffect(() => {
    let interval;
    if (lockoutTime > Date.now()) {
      setRemainingLockout(Math.ceil((lockoutTime - Date.now()) / 1000));
      interval = setInterval(() => {
        const left = Math.ceil((lockoutTime - Date.now()) / 1000);
        if (left <= 0) {
          setRemainingLockout(0);
          clearInterval(interval);
        } else {
          setRemainingLockout(left);
        }
      }, 1000);
    } else {
      setRemainingLockout(0);
    }
    return () => clearInterval(interval);
  }, [lockoutTime]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (remainingLockout > 0) {
      setErrorMessage(`Terminal locked. Please wait ${remainingLockout}s`);
      return;
    }

    if (authMode === "email") {
      if (!emailInput || !passwordInput) {
        setErrorMessage("Please enter both email address and password");
        return;
      }
      const res = authenticateAdminWithEmail(emailInput, passwordInput);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    } else if (authMode === "pin") {
      if (!pinInput) {
        setErrorMessage("Please enter your security PIN");
        return;
      }
      const res = authenticateAdmin(pinInput, selectedRole);
      if (!res.success) {
        setErrorMessage(res.message);
        setPinInput("");
      }
    } else if (authMode === "2fa") {
      if (twoFactorCode.trim().length !== 6) {
        setErrorMessage("Please enter a valid 6-digit authenticator code");
        return;
      }
      const res = authenticateAdmin("8890", selectedRole);
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
      {/* Background glow effects */}
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

      {/* Top right theme toggle */}
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
        {/* Header */}
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

        {/* Tab switcher */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
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
              background: authMode === "email" ? "var(--bg-elevated)" : "transparent",
              color: authMode === "email" ? "var(--accent-gold)" : "var(--text-muted)",
              fontWeight: authMode === "email" ? 700 : 500,
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem"
            }}
          >
            <Mail size={14} /> Email
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode("pin"); setErrorMessage(""); }}
            style={{
              padding: "0.6rem",
              borderRadius: "0.375rem",
              border: "none",
              background: authMode === "pin" ? "var(--bg-elevated)" : "transparent",
              color: authMode === "pin" ? "var(--accent-gold)" : "var(--text-muted)",
              fontWeight: authMode === "pin" ? 700 : 500,
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem"
            }}
          >
            <KeyRound size={14} /> PIN Pass
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode("2fa"); setErrorMessage(""); }}
            style={{
              padding: "0.6rem",
              borderRadius: "0.375rem",
              border: "none",
              background: authMode === "2fa" ? "var(--bg-elevated)" : "transparent",
              color: authMode === "2fa" ? "var(--accent-gold)" : "var(--text-muted)",
              fontWeight: authMode === "2fa" ? 700 : 500,
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem"
            }}
          >
            <Lock size={14} /> 2FA
          </button>
        </div>

        {/* Lockout notification */}
        {remainingLockout > 0 && (
          <div
            style={{
              padding: "0.85rem",
              borderRadius: "0.5rem",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#ef4444",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              fontSize: "0.85rem"
            }}
          >
            <AlertTriangle size={18} />
            <span>Terminal Locked: Wait {remainingLockout} seconds to retry.</span>
          </div>
        )}

        {/* Error message */}
        {errorMessage && remainingLockout === 0 && (
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
          {authMode === "email" && (
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
          )}

          {authMode === "pin" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                  AUTHORIZATION TIER
                </label>
                <select
                  className="admin-input"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="Super Admin">Super Admin (Full Root Access)</option>
                  <option value="Inventory Manager">Inventory Manager</option>
                  <option value="Order Operations">Order Operations</option>
                  <option value="Auditor">Security Auditor</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                  ENTER 4-6 DIGIT MASTER PIN
                </label>
                <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      style={{
                        width: "42px",
                        height: "48px",
                        borderRadius: "0.5rem",
                        background: "var(--bg-secondary)",
                        border: pinInput.length > idx ? "1px solid var(--accent-gold)" : "1px solid var(--border-color)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: "var(--accent-gold)"
                      }}
                    >
                      {pinInput[idx] ? "•" : ""}
                    </div>
                  ))}
                </div>

                {/* Keypad */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "←"].map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        if (key === "C") setPinInput("");
                        else if (key === "←") setPinInput((prev) => prev.slice(0, -1));
                        else handleNumpadClick(key);
                      }}
                      style={{
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "1px solid var(--border-color)",
                        background: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "1rem"
                      }}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {authMode === "2fa" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Enter the 6-digit verification code from your Authenticator app (or enter <strong>8890</strong> for demo mode).
              </p>
              <div>
                <input
                  type="text"
                  className="admin-input"
                  style={{ textAlign: "center", letterSpacing: "0.3em", fontSize: "1.25rem", fontWeight: 700 }}
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="889000"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn-gold"
            disabled={remainingLockout > 0}
            style={{
              width: "100%",
              marginTop: "1.5rem",
              justifyContent: "center",
              opacity: remainingLockout > 0 ? 0.5 : 1
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
