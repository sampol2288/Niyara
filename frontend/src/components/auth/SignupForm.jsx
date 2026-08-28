import React, { useState } from "react";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { inputStyle, iconStyle } from "./styles";

export const SignupForm = ({ setAuthMode, setIsLoading, isLoading, setIsAuthModalOpen }) => {
  const { signupDirect, showToast } = useApp();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return showToast("Please fill in all fields.");
    if (formData.password.length < 6) return showToast("Password must be at least 6 characters.");

    setIsLoading(true);
    const res = await signupDirect(formData.name, formData.email, formData.password);
    setIsLoading(false);

    if (res.success) {
      // Close modal and return to shop — user is now logged in
      if (setIsAuthModalOpen) setIsAuthModalOpen(false);
      setAuthMode("login");
    } else {
      showToast(res.error || "Signup failed. Please try again.");
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
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password (min. 6 characters)" required style={inputStyle} />
        </div>
        <button type="submit" className="btn-camel" disabled={isLoading} style={{ width: "100%", padding: "0.85rem", marginTop: "1rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
          {isLoading ? "CREATING ACCOUNT..." : <>"CREATE ACCOUNT" <ArrowRight size={16} /></>}
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
