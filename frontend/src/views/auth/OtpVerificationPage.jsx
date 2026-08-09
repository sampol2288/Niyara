import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { KeyRound, AlertCircle, RefreshCw } from "lucide-react";

export const OtpVerificationPage = ({ onNavigate }) => {
  const { activeOtpSession, verifyOtpCode, startSignupOtp, startResetOtp, showToast, setView } = useApp();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const refs = useRef([]);

  useEffect(() => {
    setResendTimer(30);
    setTimeout(() => refs.current[0]?.focus(), 150);
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer(p => p - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...digits];
    next[i] = val.slice(-1);
    setDigits(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      setDigits(pasted.split(""));
      refs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    if (isResending || !activeOtpSession) return;
    setIsResending(true);
    try {
      if (activeOtpSession.purpose === "signup" && activeOtpSession.payload) {
        await startSignupOtp(activeOtpSession.payload.name, activeOtpSession.email, activeOtpSession.payload.password);
      } else if (activeOtpSession.purpose === "reset") {
        await startResetOtp(activeOtpSession.email);
      } else {
        showToast("New code sent!");
      }
      setResendTimer(30);
      setDigits(["", "", "", "", "", ""]);
      setTimeout(() => refs.current[0]?.focus(), 100);
    } catch {
      showToast("Failed to resend. Try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const code = digits.join("");
    if (code.length < 6) { setError("Please enter the complete 6-digit code."); return; }
    const result = await verifyOtpCode(code);
    if (result.success) {
      if (result.nextStep === "new_password") {
        onNavigate("reset-password");
      } else {
        showToast("Verified successfully! Welcome.");
        setView("account");
      }
    } else {
      setError(result.error || "Invalid code. Please try again.");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-page-card animate-fade-in">
        {/* Icon */}
        <div className="auth-icon-badge">
          <KeyRound size={28} />
        </div>

        <div className="auth-page-brand">
          <span className="auth-brand-label">OTP VERIFICATION</span>
          <h1 className="auth-page-title">Enter Security Code</h1>
          <p className="auth-page-subtitle">
            6-digit code dispatched to{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              {activeOtpSession?.email || "your email"}
            </strong>
          </p>
        </div>

        {/* No OTP helper shown — code is sent via email only */}

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* OTP Boxes */}
          <div className="auth-otp-grid" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => refs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className="auth-otp-box"
                style={{
                  borderColor: d ? "var(--accent-camel)" : undefined,
                  borderWidth: d ? "2px" : "1px"
                }}
              />
            ))}
          </div>

          <button type="submit" className="auth-btn-camel">
            VERIFY &amp; CONTINUE
          </button>

          {/* Resend */}
          <div className="auth-resend-row">
            <span>Didn't receive code?</span>
            {resendTimer > 0 ? (
              <span className="auth-resend-timer">Resend in {resendTimer}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="auth-link-btn"
              >
                {isResending ? <><RefreshCw size={13} className="spin" /> Sending...</> : "Resend OTP"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
