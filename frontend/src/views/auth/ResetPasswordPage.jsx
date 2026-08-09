import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, ChevronLeft } from "lucide-react";

export const ResetPasswordPage = ({ onNavigate }) => {
  const { startResetOtp, completePasswordReset, activeOtpSession, showToast } = useApp();
  const [step, setStep] = useState("email"); // "email" | "new_password"
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) { setError("Please enter your registered email address."); return; }
    setLoading(true);
    try {
      const result = await startResetOtp(email);
      if (result.success) {
        showToast("Reset code dispatched to your email!");
        onNavigate("otp-verification");
      } else {
        setError(result.error || "No account found with that email.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const result = await completePasswordReset(newPassword);
      if (result.success) {
        showToast("Password updated successfully!");
        onNavigate("signin");
      } else {
        setError(result.error || "Failed to update password.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-page-card animate-fade-in">
        {/* Icon */}
        <div className="auth-icon-badge">
          <ShieldCheck size={28} />
        </div>

        <div className="auth-page-brand">
          <span className="auth-brand-label">SECURITY RESET</span>
          <h1 className="auth-page-title">
            {step === "email" ? "Reset Password" : "New Password"}
          </h1>
          <p className="auth-page-subtitle">
            {step === "email"
              ? "Enter your email to receive a 6-digit reset code"
              : "Identity verified — set your new secure password"}
          </p>
        </div>

        {/* Step indicator */}
        <div className="auth-steps-row">
          {["Email", "OTP", "Password"].map((label, i) => (
            <React.Fragment key={label}>
              <div className={`auth-step-dot ${i === 0 ? "auth-step-active" : i === 2 && step === "new_password" ? "auth-step-active" : ""}`}>
                <span>{i + 1}</span>
              </div>
              {i < 2 && <div className="auth-step-line" />}
            </React.Fragment>
          ))}
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleEmailSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">REGISTERED EMAIL ADDRESS</label>
              <div className="auth-input-wrap">
                <Mail size={15} className="auth-input-icon" />
                <input
                  id="reset-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input auth-input-icon-left"
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-btn-primary" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : <>REQUEST RESET CODE <ArrowRight size={15} /></>}
            </button>

            <button type="button" className="auth-back-btn" onClick={() => onNavigate("signin")}>
              <ChevronLeft size={15} /> Back to Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleNewPasswordSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">NEW PASSWORD</label>
              <div className="auth-input-wrap">
                <Lock size={15} className="auth-input-icon" />
                <input
                  id="reset-new-password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="auth-input auth-input-icon-left"
                  required
                />
              </div>
            </div>
            <div className="auth-field">
              <label className="auth-label">CONFIRM NEW PASSWORD</label>
              <div className="auth-input-wrap">
                <Lock size={15} className="auth-input-icon" />
                <input
                  id="reset-confirm-password"
                  type="password"
                  placeholder="Retype new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="auth-input auth-input-icon-left"
                  required
                />
              </div>
            </div>
            <button type="submit" className="auth-btn-camel" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : "SAVE NEW PASSWORD & SIGN IN"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
