import React, { useState } from "react";
import { UserCog, AlertCircle, CheckCircle, Search, Loader } from "lucide-react";
import { authApi } from "../../api/authApi";

const ROLES = ["member", "admin", "vip", "staff"];

export const UpdateUserPage = ({ onNavigate }) => {
  const [searchEmail, setSearchEmail] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("member");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchEmail.trim()) { setError("Please enter an email to search."); return; }
    setError("");
    setFoundUser(null);
    setSuccess("");
    setLoading(true);
    try {
      const data = await authApi.getUser(searchEmail.trim());
      if (data.success) {
        const u = data.user || (data.users && data.users[0]);
        if (u) {
          setFoundUser(u);
          setName(u.name || "");
          setRole(u.role || "member");
          setPhone(u.phone || "");
        } else {
          setError("No user found with that email.");
        }
      } else {
        setError(data.error || "User not found.");
      }
    } catch {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!foundUser) return;
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const userId = foundUser._id || foundUser.id;
      const data = await authApi.updateUser(userId, { name, role, phone });
      if (data.success) {
        setSuccess("User updated successfully!");
        setFoundUser({ ...foundUser, name, role, phone });
      } else {
        setError(data.error || "Update failed.");
      }
    } catch {
      setError("Failed to update user.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="auth-page-wrapper auth-page-wrapper-wide">
      <div className="auth-page-card auth-admin-card animate-fade-in">
        <div className="auth-admin-header">
          <div className="auth-admin-icon"><UserCog size={22} /></div>
          <div>
            <span className="auth-brand-label">ADMIN PANEL</span>
            <h1 className="auth-page-title" style={{ fontSize: "1.75rem" }}>Update User</h1>
            <p className="auth-page-subtitle">Search for a member and modify their profile</p>
          </div>
        </div>

        {error && <div className="auth-error-banner"><AlertCircle size={15} /><span>{error}</span></div>}
        {success && <div className="auth-success-banner"><CheckCircle size={15} /><span>{success}</span></div>}

        {/* Search */}
        <form onSubmit={handleSearch} className="auth-form auth-search-form">
          <div className="auth-input-wrap" style={{ flex: 1 }}>
            <Search size={15} className="auth-input-icon" />
            <input
              id="update-user-search"
              type="text"
              placeholder="Enter member email to search..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="auth-input auth-input-icon-left"
            />
          </div>
          <button type="submit" className="auth-btn-primary auth-search-btn" disabled={loading}>
            {loading ? <Loader size={15} className="spin" /> : <><Search size={15} /> FIND</>}
          </button>
        </form>

        {/* Edit Form */}
        {foundUser && (
          <form onSubmit={handleUpdate} className="auth-form auth-update-form">
            <div className="auth-update-found-banner">
              <span className="auth-label">EDITING</span>
              <span className="auth-user-email-chip">{foundUser.email}</span>
            </div>

            <div className="auth-field-row">
              <div className="auth-field">
                <label className="auth-label">FULL NAME</label>
                <input
                  id="update-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-input"
                  placeholder="Full name"
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">PHONE NUMBER</label>
                <input
                  id="update-phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="auth-input"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">MEMBER ROLE</label>
              <div className="auth-role-grid">
                {ROLES.map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`auth-role-option ${role === r ? "auth-role-selected" : ""}`}
                  >
                    <span className={`auth-role-badge auth-role-${r}`}>{r}</span>
                    {role === r && <CheckCircle size={13} className="auth-role-check" />}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="auth-btn-camel" disabled={saving}>
              {saving ? <span className="auth-spinner auth-spinner-dark" /> : "SAVE CHANGES"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
