import React from "react";
import { useApp } from "../context/AppContext";
import { X, ShieldCheck } from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginWithGoogle,
    showToast
  } = useApp();

  if (!isAuthModalOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      {/* Backdrop */}
      <div
        onClick={() => setIsAuthModalOpen(false)}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }}
      />

      {/* Modal Card */}
      <div
        className="glass-modal animate-fade-in"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "400px",
          padding: "2.5rem 2rem",
          zIndex: 10,
          color: "var(--text-primary)",
          maxHeight: "90vh",
          overflowY: "auto",
          textAlign: "center"
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div style={{ marginBottom: "2rem" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", letterSpacing: "0.22em", display: "block", marginBottom: "0.5rem" }}>
            NIYARA
          </span>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-camel)", fontWeight: 600 }}>
            MEMBER PORTAL
          </span>
        </div>

        <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: 1.6 }}>
          Sign in or create an account to continue.
        </p>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              loginWithGoogle(credentialResponse.credential).then(res => {
                if(res.success) {
                  setIsAuthModalOpen(false);
                }
              });
            }}
            onError={() => {
              showToast("Google Login Failed or Cancelled");
            }}
            theme="filled_black"
            text="continue_with"
            shape="rectangular"
          />
        </div>

        {/* Footer info */}
        <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--border-light)", paddingTop: "1.5rem", display: "flex", justifyContent: "center", gap: "1.5rem", fontSize: "0.65rem", color: "var(--text-muted)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><ShieldCheck size={12} /> Privacy Policy</span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><ShieldCheck size={12} /> Security Protocol</span>
        </div>
      </div>
    </div>
  );
};
