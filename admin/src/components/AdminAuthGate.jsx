import React, { useState, useEffect } from "react";
import { useAdmin } from "../context/AdminContext";
import { Shield, Lock, Mail, Eye, EyeOff, Sun, Moon, AlertTriangle, Clock, Loader2 } from "lucide-react";

export const AdminAuthGate = () => {
  const { authenticateAdminWithEmail, isSessionLoading, theme, toggleTheme } = useAdmin();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(null);
  const [lockoutCountdown, setLockoutCountdown] = useState(0);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutCountdown <= 0) return;
    const interval = setInterval(() => {
      setLockoutCountdown((prev) => {
        if (prev <= 1) {
          setErrorMessage("");
          setAttemptsRemaining(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutCountdown]);

  const formatCountdown = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!emailInput || !passwordInput) {
      setErrorMessage("Please enter both email address and password.");
      return;
    }

    setIsSubmitting(true);

    const res = await authenticateAdminWithEmail(emailInput, passwordInput);

    if (!res.success) {
      setErrorMessage(res.message);

      if (res.locked && res.lockoutRemainingMs) {
        setLockoutCountdown(Math.ceil(res.lockoutRemainingMs / 1000));
        setAttemptsRemaining(0);
      } else if (res.attemptsRemaining !== undefined) {
        setAttemptsRemaining(res.attemptsRemaining);
      }
    }

    setIsSubmitting(false);
  };

  const isLight = theme === "light";
  const isLockedOut = lockoutCountdown > 0;

  // Show loading spinner while validating stored session
  if (isSessionLoading) {
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
          flexDirection: "column",
          gap: "1rem"
        }}
      >
        <Loader2 size={40} style={{ color: "var(--accent-gold)", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", letterSpacing: "0.05em" }}>
          VALIDATING SESSION...
        </p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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
            background: "var(--bg-secondary)",
            padding: "0.6rem 1rem",
            borderRadius: "0.5rem",
            marginBottom: "1.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.35rem"
          }}
        >
          <Mail size={14} style={{ color: "var(--accent-gold)" }} />
          <span style={{ color: "var(--accent-gold)", fontWeight: 700, fontSize: "0.8rem" }}>
            Administrator Authentication
          </span>
        </div>

        {/* Error / Lockout Messages */}
        {errorMessage && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              background: isLockedOut ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)",
              border: `1px solid ${isLockedOut ? "rgba(239, 68, 68, 0.4)" : "rgba(245, 158, 11, 0.4)"}`,
              color: isLockedOut ? "#ef4444" : "#f59e0b",
              marginBottom: "1.25rem",
              fontSize: "0.85rem",
              textAlign: "center"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              {isLockedOut ? <Clock size={16} /> : <AlertTriangle size={16} />}
              <span>{errorMessage}</span>
            </div>
            {isLockedOut && (
              <div style={{ marginTop: "0.5rem", fontSize: "1.1rem", fontWeight: 700, fontFamily: "monospace" }}>
                {formatCountdown(lockoutCountdown)}
              </div>
            )}
          </div>
        )}

        {/* Attempts remaining warning */}
        {attemptsRemaining !== null && attemptsRemaining > 0 && attemptsRemaining <= 3 && !isLockedOut && (
          <div
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "0.5rem",
              background: "rgba(245, 158, 11, 0.08)",
              border: "1px solid rgba(245, 158, 11, 0.2)",
              color: "#f59e0b",
              marginBottom: "1rem",
              fontSize: "0.78rem",
              textAlign: "center"
            }}
          >
            ⚠️ {attemptsRemaining} attempt{attemptsRemaining !== 1 ? "s" : ""} remaining before lockout
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
                placeholder="Enter admin email"
                required
                disabled={isLockedOut}
                autoComplete="email"
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
                  disabled={isLockedOut}
                  autoComplete="current-password"
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
          </div>

          <button
            type="submit"
            className="btn-gold"
            disabled={isLockedOut || isSubmitting}
            style={{
              width: "100%",
              marginTop: "1.5rem",
              justifyContent: "center",
              opacity: isLockedOut || isSubmitting ? 0.5 : 1,
              cursor: isLockedOut || isSubmitting ? "not-allowed" : "pointer"
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> AUTHENTICATING...
              </>
            ) : isLockedOut ? (
              <>
                <Clock size={16} /> ACCOUNT LOCKED
              </>
            ) : (
              <>
                <Lock size={16} /> UNLOCK ADMIN PORTAL
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            NIYARA Security Protocol v5.0 • JWT Authentication • 4h Token Expiry
          </p>
        </div>
      </div>
    </div>
  );
};
