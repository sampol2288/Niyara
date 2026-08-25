import React, { useState } from "react";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { inputStyle, iconStyle } from "./styles";

export const SignupForm = ({ setAuthMode, setIsLoading, isLoading }) => {
  const { startSignupOtp, showToast } = useApp();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  return (
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
  );
};
