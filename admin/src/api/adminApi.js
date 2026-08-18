/**
 * NIYARA Admin API Client
 * All mutating requests include the JWT Bearer token from localStorage.
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
 * Get stored admin JWT token
 */
const getAdminToken = () => {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("niyara_admin_jwt") ||
    localStorage.getItem("niyara_jwt_token") ||
    null
  );
};

/**
 * Build authenticated headers
 */
const authHeaders = () => {
  const token = getAdminToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

/**
 * Helper: make a request and handle 401 by clearing auth state
 * Includes localhost fallback if primary backend (e.g. Render) is offline or sleeping
 */
const apiRequest = async (endpoint, options = {}) => {
  const primaryUrl = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(primaryUrl, options);

    if (res.status === 401 || res.status === 403) {
      // Token expired or unauthorized — clear stored auth
      localStorage.removeItem("niyara_admin_jwt");
      localStorage.removeItem("niyara_admin_authenticated");
      localStorage.removeItem("niyara_admin_session");
      // Signal that re-authentication is needed
      window.dispatchEvent(new CustomEvent("niyara:admin:unauthorized"));
      return { success: false, error: "Session expired. Please log in again.", unauthorized: true, status: res.status };
    }

    return await res.json();
  } catch (err) {
    // Attempt local backend server fallback if running on localhost and primary URL failed
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
      const localBase = "http://localhost:5000/api";
      if (!primaryUrl.startsWith(localBase)) {
        try {
          const localRes = await fetch(`${localBase}${endpoint}`, options);
          if (localRes.status === 401 || localRes.status === 403) {
            localStorage.removeItem("niyara_admin_jwt");
            localStorage.removeItem("niyara_admin_authenticated");
            localStorage.removeItem("niyara_admin_session");
            window.dispatchEvent(new CustomEvent("niyara:admin:unauthorized"));
            return { success: false, error: "Session expired. Please log in again.", unauthorized: true, status: localRes.status };
          }
          return await localRes.json();
        } catch (localErr) {
          // Local fallback also unreachable
        }
      }
    }
    return { success: false, error: err.message || "Network error" };
  }
};

export const adminApi = {
  // ─── Health & Auth ─────────────────────────────────────────────────────────
  getHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/admin-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  },

  verifySession: async () => {
    const token = getAdminToken();
    if (!token) return { success: false, error: "No token found" };
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401 || res.status === 403) {
        return { success: false, error: "Token expired or invalid" };
      }
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message || "Network error" };
    }
  },

  // ─── Products ──────────────────────────────────────────────────────────────
  getProducts: async () => {
    const res = await fetch(`${API_BASE}/products`);
    return await res.json();
  },

  saveProduct: async (productData) => {
    return await apiRequest("/products", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(productData)
    });
  },

  updateProduct: async (id, updateData) => {
    return await apiRequest(`/products/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(updateData)
    });
  },

  deleteProduct: async (id) => {
    return await apiRequest(`/products/${id}`, {
      method: "DELETE",
      headers: authHeaders()
    });
  },

  // ─── Orders ────────────────────────────────────────────────────────────────
  getOrders: async () => {
    return await apiRequest("/orders", {
      headers: authHeaders()
    });
  },

  updateOrderStatus: async (id, statusData) => {
    return await apiRequest(`/orders/${id}/status`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(statusData)
    });
  },

  // ─── Users / Customers ─────────────────────────────────────────────────────
  getUsers: async () => {
    return await apiRequest("/users", {
      headers: authHeaders()
    });
  },

  createUser: async (userData) => {
    return await apiRequest("/users", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(userData)
    });
  },

  updateUserRole: async (id, role) => {
    return await apiRequest(`/users/${id}/role`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ role })
    });
  },

  deleteUser: async (id) => {
    return await apiRequest(`/users/${id}`, {
      method: "DELETE",
      headers: authHeaders()
    });
  },

  // ─── Discounts ─────────────────────────────────────────────────────────────
  getDiscounts: async () => {
    return await apiRequest("/discounts", {
      headers: authHeaders()
    });
  },

  createDiscount: async (discountData) => {
    return await apiRequest("/discounts", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(discountData)
    });
  },

  deleteDiscount: async (id) => {
    return await apiRequest(`/discounts/${id}`, {
      method: "DELETE",
      headers: authHeaders()
    });
  },

  // ─── Reviews ───────────────────────────────────────────────────────────────
  getReviews: async () => {
    return await apiRequest("/reviews/all", {
      headers: authHeaders()
    });
  },

  updateReviewStatus: async (id, status) => {
    return await apiRequest(`/reviews/${id}/status`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ status })
    });
  },

  deleteReview: async (id) => {
    return await apiRequest(`/reviews/${id}`, {
      method: "DELETE",
      headers: authHeaders()
    });
  },

  // ─── Categories ────────────────────────────────────────────────────────────
  getCategories: async () => {
    const res = await fetch(`${API_BASE}/categories`);
    return await res.json();
  },

  saveCategory: async (categoryData) => {
    return await apiRequest("/categories", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(categoryData)
    });
  },

  updateCategoryStatus: async (id, status) => {
    return await apiRequest(`/categories/${id}/status`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ status })
    });
  },

  deleteCategory: async (id) => {
    return await apiRequest(`/categories/${id}`, {
      method: "DELETE",
      headers: authHeaders()
    });
  }
};
