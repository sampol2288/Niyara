import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { inputStyle } from "./styles";

export const OtpVerification = ({ setAuthMode, setIsLoading, isLoading, setIsAuthModalOpen }) => {
  const { verifyOtpCode, showToast } = useApp();
  const [otpCode, setOtpCode] = useState("");

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode) return showToast("Please enter the verification code.");
    
    setIsLoading(true);
    try {
      const res = await verifyOtpCode(otpCode);
      if (res.success) {
        if (res.nextStep === "new_password") {
          setAuthMode("reset_new_password");
        } else {
          setIsAuthModalOpen(false);
          setOtpCode("");
          setAuthMode("login");
        }
      } else {
        showToast(res.error || "Invalid verification code");
      }
    } catch (err) {
      showToast(err.message || "Failed to verify code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
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
  );
};
