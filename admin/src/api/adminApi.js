const API_BASE = "http://localhost:5000/api";

export const adminApi = {
  // Health & Database status
  getHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  },

  // Auth & OTP
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  },

  // Products
  getProducts: async () => {
    const res = await fetch(`${API_BASE}/products`);
    return await res.json();
  },

  saveProduct: async (productData) => {
    const res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData)
    });
    return await res.json();
  },

  updateProduct: async (id, updateData) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData)
    });
    return await res.json();
  },

  deleteProduct: async (id) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "DELETE"
    });
    return await res.json();
  },

  // Orders
  getOrders: async () => {
    const res = await fetch(`${API_BASE}/orders`);
    return await res.json();
  },

  updateOrderStatus: async (id, statusData) => {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(statusData)
    });
    return await res.json();
  },

  // Users / Customers
  getUsers: async () => {
    const res = await fetch(`${API_BASE}/users`);
    return await res.json();
  },

  createUser: async (userData) => {
    const res = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
    return await res.json();
  },

  updateUserRole: async (id, role) => {
    const res = await fetch(`${API_BASE}/users/${id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role })
    });
    return await res.json();
  },

  deleteUser: async (id) => {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: "DELETE"
    });
    return await res.json();
  },

  // Discounts
  getDiscounts: async () => {
    const res = await fetch(`${API_BASE}/discounts`);
    return await res.json();
  },

  createDiscount: async (discountData) => {
    const res = await fetch(`${API_BASE}/discounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discountData)
    });
    return await res.json();
  },

  deleteDiscount: async (id) => {
    const res = await fetch(`${API_BASE}/discounts/${id}`, {
      method: "DELETE"
    });
    return await res.json();
  },

  // Reviews
  getReviews: async () => {
    const res = await fetch(`${API_BASE}/reviews`);
    return await res.json();
  },

  updateReviewStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/reviews/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    return await res.json();
  },

  deleteReview: async (id) => {
    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: "DELETE"
    });
    return await res.json();
  },

  // Categories
  getCategories: async () => {
    const res = await fetch(`${API_BASE}/categories`);
    return await res.json();
  },

  saveCategory: async (categoryData) => {
    const res = await fetch(`${API_BASE}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryData)
    });
    return await res.json();
  },

  updateCategoryStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/categories/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    return await res.json();
  },

  deleteCategory: async (id) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: "DELETE"
    });
    return await res.json();
  }
};
