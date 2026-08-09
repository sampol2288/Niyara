/**
 * NIYARA Admin API Client
 * All mutating requests include the JWT Bearer token from localStorage.
 */

const getApiBase = () => {
  let raw = (import.meta.env.VITE_API_URL || "").trim().replace(/\/$/, "");
  if (!raw) return "http://localhost:5000/api";
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
  return localStorage.getItem("niyara_admin_jwt") || null;
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
 */
const apiRequest = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE}${endpoint}`, options);

  if (res.status === 401 || res.status === 403) {
    // Token expired or unauthorized — clear stored auth
    localStorage.removeItem("niyara_admin_jwt");
    localStorage.removeItem("niyara_admin_authenticated");
    localStorage.removeItem("niyara_admin_session");
    // Signal that re-authentication is needed
    window.dispatchEvent(new CustomEvent("niyara:admin:unauthorized"));
  }

  return await res.json();
};

export const adminApi = {
  // ─── Health & Auth ─────────────────────────────────────────────────────────
  getHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
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
