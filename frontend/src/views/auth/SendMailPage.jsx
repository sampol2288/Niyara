import React, { useState } from "react";
import { Send, Mail, User, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { authApi } from "../../api/authApi";

const TEMPLATES = [
  { label: "Welcome", subject: "Welcome to NIYARA Archive", body: "Dear {name},\n\nWelcome to the NIYARA Archive — your exclusive member portal for archival releases and bespoke concierge services.\n\nWarm regards,\nThe NIYARA Team" },
  { label: "OTP Reminder", subject: "Your NIYARA Verification Code", body: "Dear {name},\n\nYour 6-digit verification code is: {code}\n\nThis code expires in 10 minutes.\n\nDo not share this code with anyone.\n\nNIYARA Security Team" },
  { label: "Order Update", subject: "Your NIYARA Order Has Been Updated", body: "Dear {name},\n\nYour recent NIYARA order has been updated. Please log in to your member portal to view the latest status.\n\nThank you for your continued patronage.\n\nNIYARA Concierge" },
];

export const SendMailPage = ({ onNavigate }) => {
  const [to, setTo] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const applyTemplate = (tpl) => {
    setSubject(tpl.subject);
    setBody(tpl.body.replace("{name}", recipientName || "Member"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!to || !subject || !body) { setError("Please fill in all required fields."); return; }
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const data = await authApi.sendMail(to.trim(), recipientName.trim() || "Member", subject.trim(), body.trim());
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || "Failed to send email.");
      }
    } catch {
      setError("Server connection failed. Ensure backend email service is configured.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper auth-page-wrapper-wide">
      <div className="auth-page-card auth-admin-card animate-fade-in">
        <div className="auth-admin-header">
          <div className="auth-admin-icon auth-admin-icon-green"><Send size={22} /></div>
          <div>
            <span className="auth-brand-label">ADMIN TOOL</span>
            <h1 className="auth-page-title" style={{ fontSize: "1.75rem" }}>Send Mail</h1>
            <p className="auth-page-subtitle">Compose and dispatch emails via the NIYARA email service</p>
          </div>
        </div>

        {error && <div className="auth-error-banner"><AlertCircle size={15} /><span>{error}</span></div>}

        {/* Quick Templates */}
        <div className="auth-template-row">
          <span className="auth-label">QUICK TEMPLATES</span>
          <div className="auth-template-btns">
            {TEMPLATES.map(tpl => (
              <button key={tpl.label} type="button" onClick={() => applyTemplate(tpl)} className="auth-template-pill">
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Recipient row */}
          <div className="auth-field-row">
            <div className="auth-field">
              <label className="auth-label">TO (EMAIL) *</label>
              <div className="auth-input-wrap">
                <Mail size={15} className="auth-input-icon" />
                <input
                  id="mail-to"
                  type="email"
                  placeholder="recipient@example.com"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="auth-input auth-input-icon-left"
                  required
                />
              </div>
            </div>
            <div className="auth-field">
              <label className="auth-label">RECIPIENT NAME</label>
              <div className="auth-input-wrap">
                <User size={15} className="auth-input-icon" />
                <input
                  id="mail-recipient-name"
                  type="text"
                  placeholder="Display name (optional)"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="auth-input auth-input-icon-left"
                />
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="auth-field">
            <label className="auth-label">SUBJECT LINE *</label>
            <div className="auth-input-wrap">
              <FileText size={15} className="auth-input-icon" />
              <input
                id="mail-subject"
                type="text"
                placeholder="Email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="auth-input auth-input-icon-left"
                required
              />
            </div>
          </div>

          {/* Body */}
          <div className="auth-field">
            <label className="auth-label">MESSAGE BODY *</label>
            <textarea
              id="mail-body"
              rows={8}
              placeholder="Write your email content here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="auth-textarea"
              required
            />
            <span className="auth-char-count">{body.length} characters</span>
          </div>

          <button type="submit" className="auth-btn-camel" disabled={loading}>
            {loading
              ? <span className="auth-spinner auth-spinner-dark" />
              : <><Send size={15} /> SEND EMAIL</>}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className="auth-otp-result animate-fade-in">
            <div className="auth-otp-result-header">
              <CheckCircle size={18} style={{ color: "#10b981" }} />
              <span>Email Dispatched Successfully</span>
            </div>
            <p className="auth-result-message">{result.message}</p>
            {result.previewUrl && (
              <div className="auth-email-preview">
                <p className="auth-label">NODEMAILER PREVIEW</p>
                <a href={result.previewUrl} target="_blank" rel="noopener noreferrer" className="auth-preview-link">
                  {result.previewUrl}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
