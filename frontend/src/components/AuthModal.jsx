import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { X, ShieldCheck } from "lucide-react";

import { LoginForm } from "./auth/LoginForm";
import { SignupForm } from "./auth/SignupForm";
import { OtpVerification } from "./auth/OtpVerification";
import { ForgotPassword } from "./auth/ForgotPassword";
import { ResetPassword } from "./auth/ResetPassword";

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode
  } = useApp();

  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      {/* Backdrop */}
      <div
        onClick={() => !isLoading && setIsAuthModalOpen(false)}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }}
      />

      {/* Modal Card */}
      <div
        className="glass-modal animate-fade-in"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "420px",
          padding: "2.5rem 2.5rem",
          zIndex: 10,
          color: "var(--text-primary)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => !isLoading && setIsAuthModalOpen(false)}
          style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", letterSpacing: "0.22em", display: "block", marginBottom: "0.5rem" }}>
            NIYARA
          </span>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-camel)", fontWeight: 600 }}>
            MEMBER PORTAL
          </span>
        </div>

        {/* --- DYNAMIC CONTENT BASED ON AUTH MODE --- */}
        {authMode === "login" && (
          <LoginForm setAuthMode={setAuthMode} setIsLoading={setIsLoading} isLoading={isLoading} setIsAuthModalOpen={setIsAuthModalOpen} />
        )}

        {authMode === "signup" && (
          <SignupForm setAuthMode={setAuthMode} setIsLoading={setIsLoading} isLoading={isLoading} setIsAuthModalOpen={setIsAuthModalOpen} />
        )}

        {authMode === "otp" && (
          <OtpVerification setAuthMode={setAuthMode} setIsLoading={setIsLoading} isLoading={isLoading} setIsAuthModalOpen={setIsAuthModalOpen} />
        )}

        {authMode === "reset_email" && (
          <ForgotPassword setAuthMode={setAuthMode} setIsLoading={setIsLoading} isLoading={isLoading} />
        )}

        {authMode === "reset_new_password" && (
          <ResetPassword setAuthMode={setAuthMode} setIsLoading={setIsLoading} isLoading={isLoading} />
        )}

        {/* Footer info */}
        <div style={{ marginTop: "2.5rem", borderTop: "1px solid var(--border-light)", paddingTop: "1.5rem", display: "flex", justifyContent: "center", gap: "1.5rem", fontSize: "0.65rem", color: "var(--text-muted)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><ShieldCheck size={12} /> Privacy Policy</span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><ShieldCheck size={12} /> Security Protocol</span>
        </div>
      </div>
    </div>
  );
};
