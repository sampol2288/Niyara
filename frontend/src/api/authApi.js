/**
 * NIYARA Auth API Client
 * Connects to the Express backend for all authentication operations.
 */

const getApiBase = () => {
  let raw = (import.meta.env.VITE_API_URL || "").trim().replace(/\/$/, "");
  if (!raw) {
    if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      return "https://niyara.onrender.com/api";
    }
    return "http://localhost:5000/api";
  }
  if (!raw.endsWith("/api")) {
    raw += "/api";
  }
  return raw;
};

const API_BASE = getApiBase();

/**
 * Helper: Make a JSON API request with standard error handling and 15s timeout
 */
const apiRequest = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      ...options
    };
    const res = await fetch(url, config);
    clearTimeout(timeoutId);

    let data;
    try {
      data = await res.json();
    } catch {
      return {
        success: false,
        error: `Server returned HTTP ${res.status}. Please try again in a moment.`
      };
    }
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`[API Error] Request to ${endpoint} failed:`, error);
    if (error.name === "AbortError") {
      return {
        success: false,
        error: "Request timed out. Please check your internet connection and try again."
      };
    }
    return {
      success: false,
      error: `Unable to connect to server (${API_BASE}). Please ensure the backend server is running.`
    };
  }
};

export const authApi = {
  /**
   * Get backend health / DB status
   */
  getDBStatus: async () => {
    try {
      const data = await apiRequest("/health");
      return {
        connected: data.mongodb === "Connected",
        status: data.mongodb || "Unknown",
        host: "MongoDB Atlas"
      };
    } catch (e) {
      return { connected: false, status: "Unreachable", host: "N/A" };
    }
  },

  /**
   * Send OTP email for email verification.
   * NOTE: The OTP code is sent via email only — it is NOT returned in the API response.
   */
  sendOTP: async (email, name, purpose) => {
    const res = await apiRequest("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email, name, purpose })
    });
    return res;
  },

  // Alias
  sendOtp: async (email, name, purpose) => {
    return await authApi.sendOTP(email, name, purpose);
  },

  /**
   * Verify OTP code entered by user.
   */
  verifyOTP: async (email, code) => {
    const cleanCode = String(code).trim();
    const res = await apiRequest("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, code: cleanCode })
    });
    return res;
  },

  // Alias
  verifyOtp: async (email, code) => {
    return await authApi.verifyOTP(email, code);
  },

  /**
   * Register a new user account (called after OTP verification).
   */
  register: async (userData) => {
    const res = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData)
    });
    return res;
  },

  /**
   * Register a new user account directly without OTP verification.
   * Used when SMTP/email is not configured. Stores user in MongoDB immediately.
   */
  registerDirect: async (userData) => {
    const res = await apiRequest("/auth/register-direct", {
      method: "POST",
      body: JSON.stringify(userData)
    });
    return res;
  },

  /**
   * Login with email and password.
   */
  login: async (credentials, password) => {
    const payload = typeof credentials === "string"
      ? { email: credentials, password }
      : credentials;
    const res = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return res;
  },

  // Alias
  loginUser: async (email, password) => {
    return await authApi.login({ email, password });
  },

  /**
   * Login/Register with Google OAuth credential.
   */
  googleLogin: async (credential) => {
    const res = await apiRequest("/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential })
    });
    return res;
  },

  /**
   * Reset password using email after OTP verification.
   */
  resetPassword: async (email, newPassword) => {
    const res = await apiRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, newPassword })
    });
    return res;
  },

  /**
   * Get user by email or ID (admin lookup).
   */
  getUser: async (emailOrId) => {
    try {
      const data = await apiRequest("/users");
      if (data.success && Array.isArray(data.users)) {
        if (!emailOrId) return data;
        const match = data.users.find(
          (u) =>
            u.email?.toLowerCase() === emailOrId.toLowerCase() ||
            u._id === emailOrId ||
            u.id === emailOrId
        );
        if (match) return { success: true, user: match };
        return { success: false, error: "No user found with that email or ID." };
      }
      return data;
    } catch (e) {
      return { success: false, error: "Failed to connect to server." };
    }
  },

  /**
   * Update user role (admin).
   */
  updateUser: async (userId, fields) => {
    try {
      const { role } = fields;
      const res = await apiRequest(`/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role })
      });
      return res;
    } catch (e) {
      return { success: false, error: "Failed to update user." };
    }
  },

  // Alias for generateOtp
  generateOtp: async (email, name, purpose) => {
    return await authApi.sendOTP(email, name, purpose);
  },

  /**
   * Send custom email via backend — admin only.
   */
  sendMail: async (to, name, subject, body) => {
    try {
      const res = await apiRequest("/auth/send-mail", {
        method: "POST",
        body: JSON.stringify({ to, name, subject, body })
      });
      return res;
    } catch (e) {
      return { success: false, error: "Failed to send email." };
    }
  }
};
