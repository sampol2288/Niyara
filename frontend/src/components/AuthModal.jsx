import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { X, ShieldCheck, Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    loginUser,
    startSignupOtp,
    startResetOtp,
    verifyOtpCode,
    completePasswordReset,
    showToast
  } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otpCode: "",
    newPassword: ""
  });

  if (!isAuthModalOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return showToast("Please fill in all fields.");
    
    setIsLoading(true);
    const res = await loginUser(formData.email, formData.password);
    setIsLoading(false);
    
    if (res.success) {
      setIsAuthModalOpen(false);
      setFormData({ ...formData, password: "" });
    } else {
      showToast(res.error || "Login failed");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return showToast("Please fill in all fields.");
    
    setIsLoading(true);
    const res = await startSignupOtp(formData.name, formData.email, formData.password);
    setIsLoading(false);
    
    if (res.success) {
      setAuthMode("otp");
    } else {
      showToast(res.error || "Signup failed");
    }
  };

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    if (!formData.email) return showToast("Please enter your email.");
    
    setIsLoading(true);
    const res = await startResetOtp(formData.email);
    setIsLoading(false);
    
    if (res.success) {
      setAuthMode("otp");
    } else {
      showToast(res.error || "Failed to send reset link");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otpCode) return showToast("Please enter the verification code.");
    
    setIsLoading(true);
    const res = await verifyOtpCode(formData.otpCode);
    setIsLoading(false);
    
    if (res.success) {
      if (res.nextStep === "new_password") {
        setAuthMode("reset_new_password");
      } else {
        // Signup complete
        setIsAuthModalOpen(false);
        setFormData({ name: "", email: "", password: "", otpCode: "", newPassword: "" });
        setAuthMode("login");
      }
    } else {
      showToast(res.error || "Invalid verification code");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.newPassword) return showToast("Please enter a new password.");
    
    setIsLoading(true);
    const res = await completePasswordReset(formData.newPassword);
    setIsLoading(false);
    
    if (res.success) {
      setAuthMode("login");
      setFormData({ ...formData, newPassword: "", otpCode: "", password: "" });
    } else {
      showToast(res.error || "Failed to reset password");
    }
  };

  // Helper for input styles
  const inputStyle = {
    width: "100%",
    padding: "0.85rem 1rem 0.85rem 2.5rem",
    background: "var(--bg-surface)",
    border: "1px solid var(--border-light)",
    color: "var(--text-primary)",
    fontSize: "0.85rem",
    outline: "none",
    transition: "border-color var(--transition-fast)"
  };

  const iconStyle = {
    position: "absolute",
    left: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--text-muted)"
  };

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

        {/* --- LOGIN MODE --- */}
        {authMode === "login" && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", textAlign: "center" }}>Welcome Back</h3>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={iconStyle} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required style={inputStyle} />
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={iconStyle} />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required style={inputStyle} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setAuthMode("reset_email")} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer", textDecoration: "underline" }}>
                  Forgot Password?
                </button>
              </div>
              <button type="submit" className="btn-camel" disabled={isLoading} style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
                {isLoading ? "SIGNING IN..." : <>SIGN IN <ArrowRight size={16} /></>}
              </button>
            </form>
            <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Don't have an account?{" "}
              <button onClick={() => setAuthMode("signup")} style={{ background: "none", border: "none", color: "var(--accent-camel)", fontWeight: 600, cursor: "pointer", padding: 0 }}>
                Create one
              </button>
            </div>
          </div>
        )}

        {/* --- SIGNUP MODE --- */}
        {authMode === "signup" && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", textAlign: "center" }}>Create Account</h3>
            <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ position: "relative" }}>
                <User size={16} style={iconStyle} />
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required style={inputStyle} />
              </div>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={iconStyle} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required style={inputStyle} />
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={iconStyle} />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required style={inputStyle} />
              </div>
              <button type="submit" className="btn-camel" disabled={isLoading} style={{ width: "100%", padding: "0.85rem", marginTop: "1rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
                {isLoading ? "CREATING..." : <>CREATE ACCOUNT <ArrowRight size={16} /></>}
              </button>
            </form>
            <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Already have an account?{" "}
              <button onClick={() => setAuthMode("login")} style={{ background: "none", border: "none", color: "var(--accent-camel)", fontWeight: 600, cursor: "pointer", padding: 0 }}>
                Sign in
              </button>
            </div>
          </div>
        )}

        {/* --- OTP VERIFICATION MODE --- */}
        {authMode === "otp" && (
          <div className="animate-fade-in" style={{ textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem", color: "var(--accent-camel)" }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Verify Email</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.5 }}>
              We've sent a 6-digit verification code to your email. Please enter it below.
            </p>
            <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <input
                type="text"
                name="otpCode"
                value={formData.otpCode}
                onChange={handleChange}
                placeholder="------"
                maxLength={6}
                required
                style={{ ...inputStyle, padding: "1rem", textAlign: "center", fontSize: "1.5rem", letterSpacing: "0.5em" }}
              />
              <button type="submit" className="btn-camel" disabled={isLoading} style={{ width: "100%", padding: "0.85rem" }}>
                {isLoading ? "VERIFYING..." : "VERIFY CODE"}
              </button>
            </form>
            <button onClick={() => setAuthMode("login")} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer", marginTop: "1.5rem" }}>
              Return to Login
            </button>
          </div>
        )}

        {/* --- FORGOT PASSWORD (EMAIL) MODE --- */}
        {authMode === "reset_email" && (
          <div className="animate-fade-in" style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Reset Password</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSendResetEmail} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={iconStyle} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required style={{...inputStyle, textAlign: "left"}} />
              </div>
              <button type="submit" className="btn-camel" disabled={isLoading} style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem" }}>
                {isLoading ? "SENDING..." : "SEND RESET CODE"}
              </button>
            </form>
            <button onClick={() => setAuthMode("login")} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer", marginTop: "1.5rem" }}>
              Back to Login
            </button>
          </div>
        )}

        {/* --- NEW PASSWORD MODE --- */}
        {authMode === "reset_new_password" && (
          <div className="animate-fade-in" style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Create New Password</h3>
            <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={iconStyle} />
                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="New Password" required style={{...inputStyle, textAlign: "left"}} />
              </div>
              <button type="submit" className="btn-camel" disabled={isLoading} style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem" }}>
                {isLoading ? "UPDATING..." : "UPDATE PASSWORD"}
              </button>
            </form>
          </div>
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
