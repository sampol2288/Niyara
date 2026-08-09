import React, { useState } from "react";
import { Search, User, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { authApi } from "../../api/authApi";

export const GetUserPage = ({ onNavigate }) => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) { setError("Please enter an email or user ID."); return; }
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const data = await authApi.getUser(query.trim());
      if (data.success) {
        setResult(data.user || data.users);
      } else {
        setError(data.error || "User not found.");
      }
    } catch {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const users = Array.isArray(result) ? result : result ? [result] : [];

  return (
    <div className="auth-page-wrapper auth-page-wrapper-wide">
      <div className="auth-page-card auth-admin-card animate-fade-in">
        {/* Header */}
        <div className="auth-admin-header">
          <div className="auth-admin-icon"><User size={22} /></div>
          <div>
            <span className="auth-brand-label">ADMIN PANEL</span>
            <h1 className="auth-page-title" style={{ fontSize: "1.75rem" }}>Get User</h1>
            <p className="auth-page-subtitle">Look up a registered member by email or ID</p>
          </div>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSearch} className="auth-form auth-search-form">
          <div className="auth-input-wrap" style={{ flex: 1 }}>
            <Search size={15} className="auth-input-icon" />
            <input
              id="get-user-query"
              type="text"
              placeholder="Enter email address or user ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="auth-input auth-input-icon-left"
            />
          </div>
          <button type="submit" className="auth-btn-primary auth-search-btn" disabled={loading}>
            {loading ? <Loader size={15} className="spin" /> : <><Search size={15} /> SEARCH</>}
          </button>
        </form>

        {/* Also fetch all users */}
        <button
          className="auth-btn-secondary"
          onClick={async () => {
            setError("");
            setLoading(true);
            try {
              const data = await authApi.getUser("");
              if (data.success) setResult(data.users || []);
              else setError(data.error || "Failed to fetch users.");
            } catch { setError("Server connection failed."); }
            finally { setLoading(false); }
          }}
        >
          FETCH ALL USERS
        </button>

        {/* Results */}
        {users.length > 0 && (
          <div className="auth-results-wrap">
            <p className="auth-results-count">{users.length} user{users.length > 1 ? "s" : ""} found</p>
            <div className="auth-user-list">
              {users.map((u, i) => (
                <div key={u._id || u.id || i} className="auth-user-card">
                  <div className="auth-user-avatar">
                    {u.avatar
                      ? <img src={u.avatar} alt={u.name} className="auth-avatar-img" />
                      : <User size={18} />}
                  </div>
                  <div className="auth-user-info">
                    <p className="auth-user-name">{u.name}</p>
                    <p className="auth-user-email">{u.email}</p>
                    <p className="auth-user-meta">
                      <span className={`auth-role-badge auth-role-${u.role}`}>{u.role}</span>
                      {u.isVerified && (
                        <span className="auth-verified-badge">
                          <CheckCircle size={11} /> Verified
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="auth-user-id">
                    <span className="auth-label">ID</span>
                    <code className="auth-code">{(u._id || u.id || "—").toString().slice(0, 16)}…</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
