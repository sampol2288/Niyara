import React, { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { inputStyle, iconStyle } from "./styles";

export const LoginForm = ({ setAuthMode, setIsLoading, isLoading, setIsAuthModalOpen }) => {
  const { loginUser, showToast } = useApp();
  const [formData, setFormData] = useState({ email: "", password: "" });

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
      setFormData({ email: "", password: "" });
    } else {
      showToast(res.error || "Login failed");
    }
  };

  return (
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
  );
};
