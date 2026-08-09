/**
 * NIYARA Admin API Client (Frontend Storefront Module)
 * Handles all admin operations with JWT Bearer Token headers.
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

const getAdminToken = () => {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("niyara_admin_jwt") ||
    localStorage.getItem("niyara_jwt_token") ||
    null
  );
};

const authHeaders = () => {
  const token = getAdminToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const apiRequest = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || data.message || `API Error (${res.status})` };
    }
    return data;
  } catch (err) {
    return { success: false, error: err.message || "Network request failed" };
  }
};

export const adminApi = {
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

  deleteCategory: async (id) => {
    return await apiRequest(`/categories/${id}`, {
      method: "DELETE",
      headers: authHeaders()
    });
  },

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
  }
};

export default adminApi;
