import React from "react";
import { useApp } from "../context/AppContext";
import { X, ShieldCheck } from "lucide-react";

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    setUser,
    showToast
  } = useApp();

  if (!isAuthModalOpen) return null;

  const handleGoogleLogin = () => {
    const mockGoogleUser = {
      name: "Google User",
      email: "google.user@example.com",
      role: "user"
    };
    setUser(mockGoogleUser);
    showToast("Successfully logged in with Google");
    setIsAuthModalOpen(false);
  };

  const handleAppleLogin = () => {
    const mockAppleUser = {
      name: "Apple User",
      email: "apple.user@icloud.com",
      role: "user"
    };
    setUser(mockAppleUser);
    showToast("Successfully logged in with Apple");
    setIsAuthModalOpen(false);
  };

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
          Sign in or create an account using your preferred provider.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn-secondary"
            style={{ padding: "1rem", fontSize: "0.75rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.75rem" }}
          >
            {/* Google Icon SVG */}
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            CONTINUE WITH GOOGLE
          </button>
          <button
            type="button"
            onClick={handleAppleLogin}
            className="btn-secondary"
            style={{ padding: "1rem", fontSize: "0.75rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.75rem" }}
          >
            {/* Apple Icon SVG */}
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.365 21.43c-1.373.993-2.736.993-4.004.05-1.314-.993-2.905-.905-4.407.41-1.637 1.488-3.322 1.442-4.996-.13C-1.895 16.51-.763 8.358 3.864 5.253c1.92-1.285 3.73-1.424 5.343-.374 1.345.894 2.658.894 3.926-.062 2.274-1.648 4.204-1.077 5.43.684-4.223 2.247-3.415 7.767 1.258 9.77-.977 2.457-2.26 4.63-3.456 6.16zm-5.06-16.71c-.057-2.68 2.08-5.094 4.887-5.503.493 2.766-2.095 5.234-4.888 5.503z" fill="currentColor"/>
            </svg>
            CONTINUE WITH APPLE
          </button>
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
