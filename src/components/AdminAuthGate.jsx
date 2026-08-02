import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Shield, Lock, Mail, KeyRound, AlertTriangle, ArrowLeft, Eye, EyeOff, Fingerprint, Sun, Moon, Sparkles } from "lucide-react";

export const AdminAuthGate = () => {
  const { setView, authenticateAdminWithEmail, authenticateAdmin, lockoutTime, theme, toggleTheme } = useApp();
  
  const [authMode, setAuthMode] = useState("email"); // 'email' | 'pin' | '2fa'
  
  // Email Form State
  const [emailInput, setEmailInput] = useState("admin@NIYARA.com");
  const [passwordInput, setPasswordInput] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);

  // PIN / 2FA Form State
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
        minHeight: "75vh",
        width: "100%",
        background: isLight
          ? "radial-gradient(ellipse at center, #ffffff 0%, #f4f4f5 100%)"
          : "radial-gradient(ellipse at center, #1c1a17 0%, #0a0908 100%)",
        color: isLight ? "#09090b" : "#f4f4f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        position: "relative",
        boxSizing: "border-box"
      }}
    >
      {/* Top Header System Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: isLight ? "1px solid #e4e4e7" : "1px solid rgba(255,255,255,0.08)",
          background: isLight ? "rgba(255,255,255,0.8)" : "rgba(10,9,8,0.8)",
          backdropFilter: "blur(10px)",
          zIndex: 20
        }}
      >
        <button
          onClick={() => setView("home")}
          style={{
            background: "none",
            border: "none",
            color: isLight ? "#09090b" : "#f4f4f5",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <ArrowLeft size={16} />
          <span>Return to NIYARA Storefront</span>
        </button>

        <button
          onClick={toggleTheme}
          style={{
            background: isLight ? "#f4f4f5" : "rgba(255,255,255,0.08)",
            border: isLight ? "1px solid #d4d4d8" : "1px solid rgba(255,255,255,0.15)",
            color: isLight ? "#09090b" : "#f4f4f5",
            padding: "0.4rem 0.85rem",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          {isLight ? <Moon size={15} /> : <Sun size={15} />}
          <span>{isLight ? "Dark Mode" : "Light Mode"}</span>
        </button>
      </div>

      {/* Main Elevated Glass Security Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: isLight ? "#ffffff" : "#141210",
          border: isLight ? "1px solid #d4d4d8" : "1px solid #c5a072",
          borderRadius: "14px",
          padding: "2.5rem 2rem",
          boxShadow: isLight
            ? "0 20px 40px rgba(0, 0, 0, 0.08)"
            : "0 25px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(197, 160, 114, 0.2)",
          position: "relative",
          zIndex: 10,
          marginTop: "2rem"
        }}
      >
        {/* Header Icon & Title */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 1.25rem",
              borderRadius: "50%",
              background: "rgba(197, 160, 114, 0.15)",
              border: "1px solid #c5a072",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#c5a072",
              boxShadow: "0 0 25px rgba(197, 160, 114, 0.25)"
            }}
          >
            <Shield size={32} />
          </div>

          <h2 style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "1.6rem", fontWeight: 500, letterSpacing: "0.04em", margin: 0, color: isLight ? "#09090b" : "#ffffff" }}>
            ADMINISTRATOR ACCESS
          </h2>
          <p style={{ color: isLight ? "#71717a" : "#a1a1aa", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "0.4rem" }}>
            AUTHENTICATE TO UNLOCK OPERATIONAL TERMINAL
          </p>
        </div>

        {/* Lockout Warning Banner */}
        {remainingLockout > 0 && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid #ef4444",
              borderRadius: "6px",
              padding: "0.75rem 1rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              color: "#ef4444",
              fontSize: "0.8rem"
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <div>
              <span style={{ fontWeight: 600, display: "block" }}>TERMINAL LOCKED</span>
              <span>Too many invalid attempts. Try again in {remainingLockout} seconds.</span>
            </div>
          </div>
        )}

        {/* Authentication Method Selector Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", borderBottom: isLight ? "1px solid #e4e4e7" : "1px solid rgba(255,255,255,0.1)", marginBottom: "1.5rem", paddingBottom: "0.5rem" }}>
          <button
            type="button"
            onClick={() => { setAuthMode("email"); setErrorMessage(""); }}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              color: authMode === "email" ? "#c5a072" : isLight ? "#71717a" : "#a1a1aa",
              fontWeight: authMode === "email" ? 700 : 500,
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              paddingBottom: "0.4rem",
              borderBottom: authMode === "email" ? "2px solid #c5a072" : "2px solid transparent"
            }}
          >
            <Mail size={14} />
            <span>Email</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode("pin"); setErrorMessage(""); }}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              color: authMode === "pin" ? "#c5a072" : isLight ? "#71717a" : "#a1a1aa",
              fontWeight: authMode === "pin" ? 700 : 500,
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              paddingBottom: "0.4rem",
              borderBottom: authMode === "pin" ? "2px solid #c5a072" : "2px solid transparent"
            }}
          >
            <KeyRound size={14} />
            <span>PIN</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode("2fa"); setErrorMessage(""); }}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              color: authMode === "2fa" ? "#c5a072" : isLight ? "#71717a" : "#a1a1aa",
              fontWeight: authMode === "2fa" ? 700 : 500,
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              paddingBottom: "0.4rem",
              borderBottom: authMode === "2fa" ? "2px solid #c5a072" : "2px solid transparent"
            }}
          >
            <Fingerprint size={14} />
            <span>2FA Token</span>
          </button>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleLoginSubmit}>
          {authMode === "email" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.5rem" }}>
              {/* Email Address Input */}
              <div>
                <label style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: isLight ? "#71717a" : "#a1a1aa", display: "block", marginBottom: "0.4rem", fontWeight: 600 }}>
                  Admin Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: isLight ? "#a1a1aa" : "#71717a" }} />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@NIYARA.com"
                    disabled={remainingLockout > 0}
                    style={{
                      width: "100%",
                      background: isLight ? "#f4f4f5" : "#0a0908",
                      border: isLight ? "1px solid #d4d4d8" : "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "6px",
                      padding: "0.75rem 1rem 0.75rem 2.4rem",
                      fontSize: "0.875rem",
                      color: isLight ? "#09090b" : "#ffffff",
                      outline: "none"
                    }}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <label style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: isLight ? "#71717a" : "#a1a1aa", fontWeight: 600 }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: "none", border: "none", color: "#c5a072", fontSize: "0.72rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 600 }}
                  >
                    {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: isLight ? "#a1a1aa" : "#71717a" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    disabled={remainingLockout > 0}
                    style={{
                      width: "100%",
                      background: isLight ? "#f4f4f5" : "#0a0908",
                      border: isLight ? "1px solid #d4d4d8" : "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "6px",
                      padding: "0.75rem 1rem 0.75rem 2.4rem",
                      fontSize: "0.875rem",
                      color: isLight ? "#09090b" : "#ffffff",
                      outline: "none"
                    }}
                    required
                  />
                </div>
              </div>

              {/* Account Quick Select Helpers */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={handleFillDemoCredentials}
                  style={{
                    background: "rgba(197, 160, 114, 0.15)",
                    border: "1px solid #c5a072",
                    color: "#c5a072",
                    padding: "0.4rem 0.75rem",
                    borderRadius: "4px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem"
                  }}
                >
                  <Sparkles size={12} />
                  <span>Auto-fill Admin (admin@NIYARA.com)</span>
                </button>
              </div>
            </div>
          ) : authMode === "pin" ? (
            <div>
              {/* Role Selector */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: isLight ? "#71717a" : "#a1a1aa", display: "block", marginBottom: "0.5rem" }}>
                  Select Operator Role
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                  {[
                    { id: "Super Admin", label: "Super Admin" },
                    { id: "Senior Manager", label: "Manager" },
                    { id: "Inventory Lead", label: "Inventory" }
                  ].map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      style={{
                        background: selectedRole === role.id ? "#c5a072" : isLight ? "#f4f4f5" : "rgba(255,255,255,0.05)",
                        color: selectedRole === role.id ? "#ffffff" : isLight ? "#09090b" : "#f4f4f5",
                        border: selectedRole === role.id ? "1px solid #c5a072" : isLight ? "1px solid #d4d4d8" : "1px solid rgba(255,255,255,0.1)",
                        padding: "0.45rem 0.25rem",
                        borderRadius: "6px",
                        fontSize: "0.72rem",
                        fontWeight: selectedRole === role.id ? 700 : 500,
                        cursor: "pointer"
                      }}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Masked PIN Display */}
              <div style={{ marginBottom: "1.25rem" }}>
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter Security PIN"
                  disabled={remainingLockout > 0}
                  style={{
                    width: "100%",
                    background: isLight ? "#f4f4f5" : "#0a0908",
                    border: isLight ? "1px solid #d4d4d8" : "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "6px",
                    padding: "0.75rem 1rem",
                    fontSize: "1.25rem",
                    letterSpacing: "0.5em",
                    textAlign: "center",
                    color: isLight ? "#09090b" : "#ffffff",
                    outline: "none"
                  }}
                />
              </div>

              {/* Graphical Numpad */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    disabled={remainingLockout > 0}
                    onClick={() => handleNumpadClick(num.toString())}
                    style={{
                      background: isLight ? "#f4f4f5" : "rgba(255,255,255,0.05)",
                      border: isLight ? "1px solid #e4e4e7" : "1px solid rgba(255,255,255,0.1)",
                      color: isLight ? "#09090b" : "#f4f4f5",
                      padding: "0.65rem",
                      borderRadius: "6px",
                      fontSize: "1.1rem",
                      fontWeight: 500,
                      cursor: "pointer"
                    }}
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={remainingLockout > 0}
                  onClick={() => setPinInput("")}
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#ef4444",
                    padding: "0.65rem",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  CLEAR
                </button>
                <button
                  type="button"
                  disabled={remainingLockout > 0}
                  onClick={() => handleNumpadClick("0")}
                  style={{
                    background: isLight ? "#f4f4f5" : "rgba(255,255,255,0.05)",
                    border: isLight ? "1px solid #e4e4e7" : "1px solid rgba(255,255,255,0.1)",
                    color: isLight ? "#09090b" : "#f4f4f5",
                    padding: "0.65rem",
                    borderRadius: "6px",
                    fontSize: "1.1rem",
                    fontWeight: 500,
                    cursor: "pointer"
                  }}
                >
                  0
                </button>
                <button
                  type="button"
                  disabled={remainingLockout > 0}
                  onClick={() => setPinInput("8890")}
                  style={{
                    background: "rgba(197, 160, 114, 0.15)",
                    border: "1px solid #c5a072",
                    color: "#c5a072",
                    padding: "0.65rem",
                    borderRadius: "6px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  DEMO PIN
                </button>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontSize: "0.75rem", color: isLight ? "#71717a" : "#a1a1aa", display: "block", marginBottom: "0.5rem" }}>
                Enter 6-Digit Hardware Authenticator Token
              </label>
              <input
                type="text"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                placeholder="e.g. 492104"
                style={{
                  width: "100%",
                  background: isLight ? "#f4f4f5" : "#0a0908",
                  border: isLight ? "1px solid #d4d4d8" : "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "6px",
                  padding: "0.75rem 1rem",
                  fontSize: "1.25rem",
                  letterSpacing: "0.3em",
                  textAlign: "center",
                  color: isLight ? "#09090b" : "#ffffff",
                  outline: "none"
                }}
              />
            </div>
          )}

          {errorMessage && (
            <div style={{ color: "#ef4444", fontSize: "0.78rem", textAlign: "center", marginBottom: "1rem", fontWeight: 600 }}>
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={remainingLockout > 0}
            style={{
              width: "100%",
              background: remainingLockout > 0 ? "rgba(255,255,255,0.1)" : "#c5a072",
              color: "#ffffff",
              border: "none",
              padding: "0.85rem",
              borderRadius: "6px",
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: remainingLockout > 0 ? "not-allowed" : "pointer",
              transition: "opacity 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem"
            }}
          >
            <Lock size={16} />
            <span>SIGN IN & UNLOCK TERMINAL</span>
          </button>
        </form>

        {/* Security Helper & Demo Info Footer */}
        <div style={{ marginTop: "2rem", paddingTop: "1.25rem", borderTop: isLight ? "1px solid #e4e4e7" : "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.72rem", color: isLight ? "#71717a" : "#a1a1aa" }}>
            Demo Admin Credentials:
          </span>
          <div style={{ fontSize: "0.72rem", color: "#c5a072", fontFamily: "monospace", textAlign: "right" }}>
            <span><strong>admin@NIYARA.com</strong> / <strong>admin123</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
