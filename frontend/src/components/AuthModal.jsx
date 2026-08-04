import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { X, Lock, Mail, User, Eye, EyeOff, ShieldCheck, ArrowRight, RefreshCw, KeyRound, AlertCircle } from "lucide-react";

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
    activeOtpSession,
    showToast
  } = useApp();

  // Form Input States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // OTP 6-digit State
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const otpInputRefs = useRef([]);
  const [resendTimer, setResendTimer] = useState(30);

  // Reset errors when mode changes
  useEffect(() => {
    setErrorMessage("");
    if (authMode === "otp") {
      setResendTimer(30);
      // Auto focus first OTP input
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    }
  }, [authMode]);

  // Resend Timer Countdown
  useEffect(() => {
    let interval;
    if (authMode === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [authMode, resendTimer]);

  if (!isAuthModalOpen) return null;

  // Password Strength Calculation (0 to 4)
  const calculatePasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  // OTP Pin Box Input Handlers
  const handleOtpDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-advance to next input
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
      const digits = pasted.split("");
      setOtpDigits(digits);
      otpInputRefs.current[5]?.focus();
    }
  };

  const autofillDemoOtp = () => {
    const codeToFill = activeOtpSession?.code || "882194";
    setOtpDigits(codeToFill.split(""));
    setErrorMessage("");
    showToast(`Auto-filled verification code ${codeToFill}`);
  };

  // Form Submission Handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    const result = await loginUser(email, password);
    setIsLoading(false);
    if (result.success) {
      setIsAuthModalOpen(false);
    } else {
      setErrorMessage(result.error);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!fullName || !email || !password) {
      setErrorMessage("Please fill out all fields to create an account.");
      return;
    }
    if (!agreedTerms) {
      setErrorMessage("Please accept the Terms of Service to create an account.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    const result = await startSignupOtp(fullName, email, password);
    setIsLoading(false);
    
    if (result.success) {
      setAuthMode("otp");
    } else {
      setErrorMessage(result.error);
    }
  };

  const handleResetEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }
    setIsLoading(true);
    const result = await startResetOtp(email);
    setIsLoading(false);
    if (result.success) {
      setAuthMode("otp");
    } else {
      setErrorMessage(result.error);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const fullCode = otpDigits.join("");
    if (fullCode.length < 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    const result = await verifyOtpCode(fullCode);
    if (result.success) {
      if (result.nextStep === "new_password") {
        setAuthMode("reset_new_password");
      } else {
        setIsAuthModalOpen(false);
      }
    } else {
      setErrorMessage(result.error);
    }
  };

  const handleNewPasswordSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please retype.");
      return;
    }

    const result = completePasswordReset(newPassword);
    if (result.success) {
      setIsAuthModalOpen(false);
    } else {
      setErrorMessage(result.error);
    }
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
          maxWidth: "460px",
          padding: "2.5rem 2rem",
          zIndex: 10,
          color: "var(--text-primary)",
          maxHeight: "90vh",
          overflowY: "auto"
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
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", letterSpacing: "0.22em", display: "block", marginBottom: "0.25rem" }}>
            NIYARA
          </span>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent-camel)", fontWeight: 600 }}>
            {authMode === "otp"
              ? "OTP VERIFICATION"
              : authMode === "reset_email" || authMode === "reset_new_password"
              ? "SECURITY RESET"
              : "ARCHIVE MEMBER PORTAL"}
          </span>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "4px",
              padding: "0.75rem 1rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontSize: "0.75rem",
              color: "#f87171"
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Mode Switcher Tabs (Only for login / signup) */}
        {(authMode === "login" || authMode === "signup") && (
          <div style={{ display: "flex", borderBottom: "1px solid var(--border-light)", marginBottom: "1.75rem" }}>
            <button
              onClick={() => { setAuthMode("login"); setErrorMessage(""); }}
              style={{
                flex: 1,
                padding: "0.75rem",
                background: "none",
                border: "none",
                borderBottom: authMode === "login" ? "2px solid var(--accent-camel)" : "none",
                color: authMode === "login" ? "var(--text-primary)" : "var(--text-muted)",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              SIGN IN
            </button>
            <button
              onClick={() => { setAuthMode("signup"); setErrorMessage(""); }}
              style={{
                flex: 1,
                padding: "0.75rem",
                background: "none",
                border: "none",
                borderBottom: authMode === "signup" ? "2px solid var(--accent-camel)" : "none",
                color: authMode === "signup" ? "var(--text-primary)" : "var(--text-muted)",
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

        {/* 1. LOGIN FORM */}
        {authMode === "login" && (
          <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-minimal"
                required
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                  PASSWORD
                </label>
                <button
                  type="button"
                  onClick={() => { setAuthMode("reset_email"); setErrorMessage(""); }}
                  style={{ background: "none", border: "none", fontSize: "0.65rem", color: "var(--accent-camel)", cursor: "pointer", letterSpacing: "0.1em", padding: 0 }}
                >
                  FORGOT PASSWORD?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-minimal"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: "0.5rem", width: "100%", padding: "1rem" }}>
              SECURE LOGIN
            </button>
          </form>
        )}

        {/* 2. SIGN UP FORM */}
        {authMode === "signup" && (
          <form onSubmit={handleSignupSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                FULL NAME
              </label>
              <input
                type="text"
                placeholder="e.g. Julian Vanderveld"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-minimal"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-minimal"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                CREATE PASSWORD
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-minimal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password.length > 0 && (
                <div style={{ marginTop: "0.5rem" }}>
                  <div style={{ display: "flex", gap: "4px", height: "4px", marginBottom: "0.25rem" }}>
                    {[1, 2, 3, 4].map((step) => {
                      const strength = calculatePasswordStrength(password);
                      const active = strength >= step;
                      return (
                        <div
                          key={step}
                          style={{
                            flex: 1,
                            background: active
                              ? strength === 1
                                ? "#ef4444"
                                : strength === 2
                                ? "#f59e0b"
                                : strength === 3
                                ? "#3b82f6"
                                : "#10b981"
                              : "var(--border-light)",
                            transition: "all 0.3s ease"
                          }}
                        />
                      );
                    })}
                  </div>
                  <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Strength: {calculatePasswordStrength(password) <= 1 ? "Weak" : calculatePasswordStrength(password) === 2 ? "Fair" : calculatePasswordStrength(password) === 3 ? "Good" : "Strong"}
                  </span>
                </div>
              )}
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.5, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                style={{ marginTop: "0.15rem" }}
              />
              <span>I agree to NIYARA's Terms of Service and Privacy Policy for archive membership.</span>
            </label>

            {errorMessage && (
              <div style={{ background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.4)", padding: "0.875rem 1rem", borderRadius: "4px", display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.75rem", color: "#f87171" }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <button type="submit" className="btn-camel" style={{ width: "100%", padding: "1rem" }} disabled={isLoading}>
              {isLoading ? (
                <>PROCESSING... <RefreshCw size={16} className="spin" /></>
              ) : (
                <>SEND VERIFICATION OTP <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD - EMAIL INPUT */}
        {authMode === "reset_email" && (
          <form onSubmit={handleResetEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, textAlign: "center" }}>
              Enter your registered email address below. We will send a 6-digit Security OTP code to verify your identity.
            </p>

            <div>
              <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                REGISTERED EMAIL ADDRESS
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-minimal"
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", padding: "1rem" }}>
              REQUEST RESET CODE <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => { setAuthMode("login"); setErrorMessage(""); }}
              style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer" }}
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* 4. OTP 6-DIGIT VERIFICATION VIEW */}
        {authMode === "otp" && (
          <form onSubmit={handleOtpSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "rgba(197, 160, 114, 0.15)", color: "var(--accent-camel)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                <KeyRound size={24} />
              </div>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                We've dispatched a 6-digit security code to your email <br />
                <strong style={{ color: "var(--text-primary)" }}>{activeOtpSession?.email || email}</strong>
              </p>
            </div>

            {/* 6 OTP Input Boxes */}
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
                    width: "48px",
                    height: "54px",
                    textAlign: "center",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    borderRadius: "4px",
                    border: digit ? "2px solid var(--accent-camel)" : "1px solid var(--border-light)",
                    background: "var(--bg-surface)",
                    color: "var(--text-primary)",
                    outline: "none",
                    transition: "all 0.2s ease"
                  }}
                />
              ))}
            </div>

            <button type="submit" className="btn-camel" style={{ width: "100%", padding: "1rem" }}>
              VERIFY & CONTINUE
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              <span>Didn't receive code?</span>
              {resendTimer > 0 ? (
                <span>Resend in {resendTimer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setResendTimer(30);
                    showToast(`New code re-sent to ${email}`);
                  }}
                  style={{ background: "none", border: "none", color: "var(--accent-camel)", cursor: "pointer", fontWeight: 600 }}
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        )}

        {/* 5. NEW PASSWORD INPUT (RESET MODE) */}
        {authMode === "reset_new_password" && (
          <form onSubmit={handleNewPasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, textAlign: "center" }}>
              Identity verified! Create your new secure password.
            </p>

            <div>
              <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                NEW PASSWORD
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-minimal"
                required
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-secondary)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                CONFIRM NEW PASSWORD
              </label>
              <input
                type="password"
                placeholder="Retype new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-minimal"
                required
              />
            </div>

            <button type="submit" className="btn-camel" style={{ width: "100%", padding: "1rem" }}>
              SAVE NEW PASSWORD & LOGIN
            </button>
          </form>
        )}

        {/* Social Dividers (only on login/signup) */}
        {(authMode === "login" || authMode === "signup") && (
          <>
            <div style={{ textAlign: "center", margin: "1.5rem 0 1.25rem", position: "relative" }}>
              <span style={{ background: "var(--bg-card)", padding: "0 0.75rem", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--text-muted)", position: "relative", zIndex: 1 }}>
                OR CONTINUE WITH
              </span>
              <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "var(--border-light)" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <button
                type="button"
                onClick={() => showToast("Google sign-in coming soon.")}
                className="btn-secondary"
                style={{ fontSize: "0.7rem", padding: "0.75rem" }}
              >
                GOOGLE
              </button>
              <button
                type="button"
                onClick={() => showToast("Apple sign-in coming soon.")}
                className="btn-secondary"
                style={{ fontSize: "0.7rem", padding: "0.75rem" }}
              >
                APPLE
              </button>
            </div>
          </>
        )}

        {/* Footer info */}
        <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--border-light)", paddingTop: "1rem", display: "flex", justifyContent: "center", gap: "1.5rem", fontSize: "0.65rem", color: "var(--text-muted)" }}>
          <span>Privacy Policy</span>
          <span>Security Protocol</span>
          <span>Concierge</span>
        </div>
      </div>
    </div>
  );
};
