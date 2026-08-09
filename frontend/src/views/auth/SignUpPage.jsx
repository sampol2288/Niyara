import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";

export const SignUpPage = ({ onNavigate }) => {
  const { startSignupOtp, showToast } = useApp();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const calcStrength = (pwd) => {
    let s = 0;
    if (pwd.length >= 6) s++;
    if (pwd.length >= 10) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  };

  const strengthColors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strength = calcStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!fullName || !email || !password) { setError("Please fill out all fields."); return; }
    if (!agreed) { setError("Please accept the Terms of Service to continue."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const result = await startSignupOtp(fullName, email, password);
      if (result.success) {
        showToast("Verification OTP sent to your email!");
        onNavigate("otp-verification");
      } else {
        setError(result.error || "Something went wrong. Please try again.");
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
        <div className="auth-page-brand">
          <span className="auth-brand-label">NIYARA ARCHIVE</span>
          <h1 className="auth-page-title">Join NIYARA</h1>
          <p className="auth-page-subtitle">Create your exclusive member profile</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name */}
          <div className="auth-field">
            <label className="auth-label">FULL NAME</label>
            <div className="auth-input-wrap">
              <User size={15} className="auth-input-icon" />
              <input
                id="signup-name"
                type="text"
                placeholder="e.g. Julian Vanderveld"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="auth-input auth-input-icon-left"
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">EMAIL ADDRESS</label>
            <div className="auth-input-wrap">
              <Mail size={15} className="auth-input-icon" />
              <input
                id="signup-email"
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
            <label className="auth-label">CREATE PASSWORD</label>
            <div className="auth-input-wrap">
              <Lock size={15} className="auth-input-icon" />
              <input
                id="signup-password"
                type={showPwd ? "text" : "password"}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input auth-input-icon-left auth-input-icon-right"
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="auth-eye-btn">
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {/* Strength Meter */}
            {password.length > 0 && (
              <div className="auth-strength-wrap">
                <div className="auth-strength-bars">
                  {[1,2,3,4].map(step => (
                    <div
                      key={step}
                      className="auth-strength-bar"
                      style={{ background: strength >= step ? strengthColors[strength] : "var(--border-light)" }}
                    />
                  ))}
                </div>
                <span className="auth-strength-label" style={{ color: strengthColors[strength] }}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>

          {/* Terms */}
          <label className="auth-checkbox-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="auth-checkbox"
            />
            <span>I agree to NIYARA's <span className="auth-link-text">Terms of Service</span> and <span className="auth-link-text">Privacy Policy</span></span>
          </label>

          <button type="submit" className="auth-btn-camel" disabled={loading}>
            {loading ? (
              <span className="auth-spinner auth-spinner-dark" />
            ) : (
              <>
                SEND VERIFICATION OTP <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer-row">
          <span>Already have an account?</span>
          <button className="auth-link-btn" onClick={() => onNavigate("signin")}>SIGN IN</button>
        </div>
      </div>
    </div>
  );
};
