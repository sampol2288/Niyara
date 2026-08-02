import React from "react";
import { useApp } from "../context/AppContext";
import { Check, Info } from "lucide-react";

export const NotificationToast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 9999,
        background: "rgba(24, 24, 28, 0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid var(--accent-camel)",
        padding: "0.875rem 1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        color: "var(--text-primary)",
        fontSize: "0.8125rem",
        letterSpacing: "0.03em",
        boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        animation: "fadeIn 0.3s ease"
      }}
    >
      <div style={{ background: "var(--accent-camel)", color: "#ffffff", padding: "0.3rem", display: "flex", borderRadius: "2px" }}>
        <Check size={14} strokeWidth={2.5} color="#ffffff" />
      </div>
      <span>{toast}</span>
    </div>
  );
};
