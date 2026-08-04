import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Lock, Mail, User, Eye, EyeOff, ShieldCheck, ArrowRight, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";

export const AuthView = ({ initialTab = "login" }) => {
  const {
    authMode,
    setAuthMode,
    loginUser,
    startSignupOtp,
    startResetOtp,
    verifyOtpCode,
    completePasswordReset,
    activeOtpSession,
    setView,
    showToast
  } = useApp();

  const [mode, setMode] = useState(authMode || initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(true);

  // OTP 6-digit State
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const otpInputRefs = useRef([]);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    setErrorMessage("");
    if (mode === "otp") {
      setResendTimer(30);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    }
  }, [mode]);

  useEffect(() => {
    let interval;
    if (mode === "otp" && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [mode, resendTimer]);

  const calculatePasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const handleOtpDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      setOtpDigits(pasted.split(""));
      otpInputRefs.current[5]?.focus();
    }
  };

  const autofillDemoOtp = () => {
    const codeToFill = activeOtpSession?.code || "882194";
    setOtpDigits(codeToFill.split(""));
    setErrorMessage("");
    showToast(`Auto-filled verification code ${codeToFill}`);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const result = await loginUser(email, password);
    if (result.success) {
      setView("account");
    } else {
      setErrorMessage(result.error);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!agreedTerms) {
      setErrorMessage("Please accept the Terms of Service to create an account.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    const result = await startSignupOtp(fullName, email, password);
    if (result.success) {
      setMode("otp");
    } else {
      setErrorMessage(result.error);
    }
  };

  const handleResetEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const result = await startResetOtp(email);
    if (result.success) {
      setMode("otp");
    } else {
      setErrorMessage(result.error);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const fullCode = otpDigits.join("");
    if (fullCode.length < 6) {
      setErrorMessage("Please enter the full 6-digit verification code.");
      return;
    }

    const result = await verifyOtpCode(fullCode);
    if (result.success) {
      if (result.nextStep === "new_password") {
        setMode("reset_new_password");
      } else {
        setView("account");
      }
    } else {
      setErrorMessage(result.error);
    }
  };

  const handleNewPasswordSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const result = completePasswordReset(newPassword);
    if (result.success) {
      setView("account");
    } else {
      setErrorMessage(result.error);
    }
  };



  return (
    <div className="animate-fade-in page-container" style={{ maxWidth: "1200px" }}>
      <div className="auth-view-grid">
        {/* Left Hero Brand Banner */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: "3.5rem 3rem", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "0.7rem", letterSpacing: "0.25em", color: "var(--accent-camel)", textTransform: "uppercase", fontWeight: 600 }}>
              NIYARA ARCHIVE
            </span>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "3rem", color: "var(--text-primary)", marginTop: "0.5rem", lineHeight: 1.1 }}>
              Exclusive Access & Crated Luxury.
            </h1>
            <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", marginTop: "1.25rem", lineHeight: 1.7 }}>
              Authenticate your member session to unlock archival releases, bespoke order tracking, and private concierge services.
            </p>
          </div>

          <div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", gap: "1rem", borderTop: "1px solid var(--border-light)", paddingTop: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
              <CheckCircle2 size={16} color="var(--accent-camel)" />
              <span>Encrypted 256-Bit TLS Security & OTP Verification</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
              <CheckCircle2 size={16} color="var(--accent-camel)" />
              <span>Real-Time Express Dispatch & Order Tracking</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
              <CheckCircle2 size={16} color="var(--accent-camel)" />
              <span>Saved Architectural Wishlist & Concierge Support</span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: "3rem 2.5rem" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--text-primary)" }}>
              {mode === "login" ? "Welcome Back" : mode === "signup" ? "Join NIYARA" : mode === "otp" ? "Verify Security Code" : "Reset Password"}
            </h2>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              {mode === "login" ? "Enter your credentials to manage your account" : mode === "signup" ? "Create your archival member profile" : "Complete authentication"}
            </p>
          </div>

          {errorMessage && (
            <div style={{ background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.4)", padding: "0.875rem 1rem", borderRadius: "4px", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.75rem", color: "#f87171" }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Mode Tabs */}
          {(mode === "login" || mode === "signup") && (
            <div style={{ display: "flex", borderBottom: "1px solid var(--border-light)", marginBottom: "2rem" }}>
              <button
                onClick={() => { setMode("login"); setErrorMessage(""); }}
                style={{
                  flex: 1,
                  padding: "0.875rem",
                  background: "none",
                  border: "none",
                  borderBottom: mode === "login" ? "2px solid var(--accent-camel)" : "none",
                  color: mode === "login" ? "var(--text-primary)" : "var(--text-muted)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                SIGN IN
              </button>
              <button
                onClick={() => { setMode("signup"); setErrorMessage(""); }}
                style={{
                  flex: 1,
                  padding: "0.875rem",
                  background: "none",
                  border: "none",
                  borderBottom: mode === "signup" ? "2px solid var(--accent-camel)" : "none",
                  color: mode === "signup" ? "var(--text-primary)" : "var(--text-muted)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                CREATE ACCOUNT
              </button>
            </div>
          )}

          {/* 1. LOGIN */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>EMAIL ADDRESS</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-minimal" required />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)" }}>PASSWORD</label>
                  <button type="button" onClick={() => setMode("reset_email")} style={{ background: "none", border: "none", color: "var(--accent-camel)", fontSize: "0.65rem", cursor: "pointer" }}>FORGOT?</button>
                </div>
                <div style={{ position: "relative" }}>
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="input-minimal" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%", padding: "1rem", marginTop: "0.5rem" }}>SECURE SIGN IN</button>
            </form>
          )}

          {/* 2. SIGNUP */}
          {mode === "signup" && (
            <form onSubmit={handleSignupSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>FULL NAME</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-minimal" required />
              </div>
              <div>
                <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>EMAIL ADDRESS</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-minimal" required />
              </div>
              <div>
                <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>PASSWORD</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-minimal" required />
              </div>
              <button type="submit" className="btn-camel" style={{ width: "100%", padding: "1rem" }}>SEND OTP CODE <ArrowRight size={16} /></button>
            </form>
          )}

          {/* 3. OTP VERIFICATION */}
          {mode === "otp" && (
            <form onSubmit={handleOtpSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", textAlign: "center" }}>
                Enter the 6-digit verification code sent to your email <br />
                <strong style={{ color: "var(--text-primary)" }}>{activeOtpSession?.email || email}</strong>
              </p>

              <div className="otp-inputs-responsive" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    style={{
                      width: "44px",
                      height: "50px",
                      textAlign: "center",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      borderRadius: "4px",
                      border: digit ? "2px solid var(--accent-camel)" : "1px solid var(--border-light)",
                      background: "var(--bg-surface)",
                      color: "var(--text-primary)",
                      outline: "none"
                    }}
                  />
                ))}
              </div>

              <button type="submit" className="btn-camel" style={{ width: "100%", padding: "1rem" }}>VERIFY & CONTINUE</button>
            </form>
          )}

          {/* 4. RESET EMAIL */}
          {mode === "reset_email" && (
            <form onSubmit={handleResetEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", textAlign: "center" }}>
                Enter your account email to receive a password reset OTP code.
              </p>
              <div>
                <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>EMAIL ADDRESS</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-minimal" required />
              </div>
              <button type="submit" className="btn-primary" style={{ width: "100%", padding: "1rem" }}>REQUEST CODE</button>
              <button type="button" onClick={() => setMode("login")} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer" }}>← Back to Sign In</button>
            </form>
          )}

          {/* 5. NEW PASSWORD */}
          {mode === "reset_new_password" && (
            <form onSubmit={handleNewPasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>NEW PASSWORD</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-minimal" required />
              </div>
              <div>
                <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>CONFIRM NEW PASSWORD</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-minimal" required />
              </div>
              <button type="submit" className="btn-camel" style={{ width: "100%", padding: "1rem" }}>SAVE & SIGN IN</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
