import React from "react";
import { Shield, ExternalLink, ArrowRight, Lock } from "lucide-react";

export const AdminView = () => {
  return (
    <div
      style={{
        minHeight: "75vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1rem"
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          width: "100%",
          padding: "3rem 2rem",
          background: "var(--bg-secondary, #121215)",
          border: "1px solid var(--accent-gold, #c5a072)",
          borderRadius: "1rem",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            margin: "0 auto 1.5rem",
            borderRadius: "1rem",
            background: "rgba(197, 160, 114, 0.15)",
            border: "1px solid #c5a072",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#c5a072"
          }}
        >
          <Shield size={32} />
        </div>

        <h2 style={{ fontFamily: "Cinzel, serif", fontSize: "1.5rem", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
          STANDALONE ADMIN PORTAL
        </h2>
        <p style={{ color: "#a1a1aa", fontSize: "0.9rem", marginBottom: "2rem", lineHeight: 1.6 }}>
          The NIYARA Archival Command & Admin Console is hosted in a separate dedicated application (folder: <code>fashion/admin</code>).
        </p>

        <a
          href="http://localhost:5174"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            width: "100%",
            padding: "0.85rem 1.5rem",
            background: "linear-gradient(135deg, #c5a072 0%, #a37c4c 100%)",
            color: "#000",
            fontWeight: 700,
            borderRadius: "0.5rem",
            textDecoration: "none",
            fontSize: "0.95rem"
          }}
        >
          <Lock size={18} /> OPEN ADMIN PORTAL (PORT 5174) <ExternalLink size={18} />
        </a>

        <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: "0.8rem", color: "#71717a" }}>
          Or run <code>npm run admin</code> in terminal
        </div>
      </div>
    </div>
  );
};

export default AdminView;
