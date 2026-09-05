import React, { useState } from "react";
import { Mail } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { inputStyle, iconStyle } from "./styles";

export const ForgotPassword = ({ setAuthMode, setIsLoading, isLoading }) => {
  const { startResetOtp, showToast } = useApp();
  const [email, setEmail] = useState("");

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    if (!email) return showToast("Please enter your email.");
    
    setIsLoading(true);
    try {
      const res = await startResetOtp(email);
      if (res.success) {
        setAuthMode("otp");
      } else {
        showToast(res.error || "Failed to send reset link");
      }
    } catch (err) {
      showToast(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ textAlign: "center" }}>
      <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Reset Password</h3>
      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
        Enter your email address and we'll send you a link to reset your password.
      </p>
      <form onSubmit={handleSendResetEmail} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ position: "relative" }}>
          <Mail size={16} style={iconStyle} />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required style={{...inputStyle, textAlign: "left"}} />
        </div>
        <button type="submit" className="btn-camel" disabled={isLoading} style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem" }}>
          {isLoading ? "SENDING..." : "SEND RESET CODE"}
        </button>
      </form>
      <button onClick={() => setAuthMode("login")} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer", marginTop: "1.5rem" }}>
        Back to Login
      </button>
    </div>
  );
};
