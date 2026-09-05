import React, { useState } from "react";
import { Lock } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { inputStyle, iconStyle } from "./styles";

export const ResetPassword = ({ setAuthMode, setIsLoading, isLoading }) => {
  const { completePasswordReset, showToast } = useApp();
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return showToast("Please enter a new password.");
    
    setIsLoading(true);
    try {
      const res = await completePasswordReset(newPassword);
      if (res.success) {
        setAuthMode("login");
        setNewPassword("");
      } else {
        showToast(res.error || "Failed to reset password");
      }
    } catch (err) {
      showToast(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ textAlign: "center" }}>
      <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Create New Password</h3>
      <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ position: "relative" }}>
          <Lock size={16} style={iconStyle} />
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" required style={{...inputStyle, textAlign: "left"}} />
        </div>
        <button type="submit" className="btn-camel" disabled={isLoading} style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem" }}>
          {isLoading ? "UPDATING..." : "UPDATE PASSWORD"}
        </button>
      </form>
    </div>
  );
};
