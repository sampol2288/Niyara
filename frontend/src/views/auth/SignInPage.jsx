import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Shield } from "lucide-react";

export const SignInPage = ({ onNavigate }) => {
  const { loginUser, showToast, setView } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    try {
      const result = await loginUser(email, password);
      if (result.success) {
        showToast(`Welcome back, ${result.user.name.split(" ")[0]}!`);
        setView("account");
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-page-card animate-fade-in">
        {/* Header */}
        <div className="auth-page-brand">
          <span className="auth-brand-label">NIYARA ARCHIVE</span>
          <h1 className="auth-page-title">Welcome Back</h1>
          <p className="auth-page-subtitle">Sign in to your member portal</p>
        </div>

        {/* Error */}
        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">EMAIL ADDRESS</label>
            <div className="auth-input-wrap">
              <Mail size={15} className="auth-input-icon" />
              <input
                id="signin-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input auth-input-icon-left"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className="auth-label-row">
              <label className="auth-label">PASSWORD</label>
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => onNavigate("reset-password")}
              >
                FORGOT PASSWORD?
              </button>
            </div>
            <div className="auth-input-wrap">
              <Lock size={15} className="auth-input-icon" />
              <input
                id="signin-password"
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input auth-input-icon-left auth-input-icon-right"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="auth-eye-btn"
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? (
              <span className="auth-spinner" />
            ) : (
              <>
                SECURE SIGN IN <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Social Divider */}
        <div className="auth-divider">
          <span className="auth-divider-label">OR CONTINUE WITH</span>
        </div>
        <div className="auth-social-row">
          <button className="auth-social-btn" onClick={() => showToast("Google sign-in coming soon.")}>
            <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
              <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
              <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
              <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
              <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
            </svg>
            GOOGLE
          </button>
          <button className="auth-social-btn" onClick={() => showToast("Apple sign-in coming soon.")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            APPLE
          </button>
        </div>

        {/* Footer */}
        <div className="auth-footer-row">
          <span>Don't have an account?</span>
          <button className="auth-link-btn" onClick={() => onNavigate("signup")}>
            CREATE ACCOUNT
          </button>
        </div>

        {/* Security Badge */}
        <div className="auth-security-badge">
          <Shield size={12} />
          <span>256-Bit TLS Encrypted · JWT Secured Session</span>
        </div>
      </div>
    </div>
  );
};
