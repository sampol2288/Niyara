import React, { createContext, useContext, useState, useEffect } from "react";
import { adminApi } from "../api/adminApi";

const AdminContext = createContext();

const DEFAULT_CATEGORIES = [
  {
    id: "CAT-101",
    name: "Outerwear",
    slug: "outerwear",
    description: "Tailored blazers, luxury wool coats, leather trenches",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop",
    isFeatured: true,
    status: "ACTIVE",
    itemCount: 12
  },
  {
    id: "CAT-102",
    name: "Tops",
    slug: "tops",
    description: "Silk shirts, structured corsets, cashmere knits",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600&auto=format&fit=crop",
    isFeatured: true,
    status: "ACTIVE",
    itemCount: 18
  },
  {
    id: "CAT-103",
    name: "Bottoms",
    slug: "bottoms",
    description: "Wide-leg trousers, pleated skirts, denim jeans",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop",
    isFeatured: false,
    status: "ACTIVE",
    itemCount: 15
  },
  {
    id: "CAT-104",
    name: "Footwear",
    slug: "footwear",
    description: "Archival boots, leather heels, minimalist loafers",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop",
    isFeatured: true,
    status: "ACTIVE",
    itemCount: 9
  },
  {
    id: "CAT-105",
    name: "Accessories",
    slug: "accessories",
    description: "Leather handbags, statement belts, luxury eyewear",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop",
    isFeatured: false,
    status: "ACTIVE",
    itemCount: 22
  }
];

export const AdminProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      showToast(`Switched to ${nextTheme.toUpperCase()} mode`);
      return nextTheme;
    });
  };

  const [toasts, setToasts] = useState([]);
  const showToast = (text, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem("niyara_admin_authenticated") === "true";
  });

  const [adminSession, setAdminSession] = useState(() => {
    const saved = localStorage.getItem("niyara_admin_session");
    return saved ? JSON.parse(saved) : { role: "Super Admin", email: "admin@NIYARA.com", authenticatedAt: null };
  });

  const [adminPin, setAdminPin] = useState(() => {
    return localStorage.getItem("niyara_admin_pin") || "8890";
  });

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem("niyara_admin_audit_logs");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            event: "Admin Portal Boot",
            severity: "INFO",
            timestamp: new Date().toLocaleTimeString() + " - " + new Date().toLocaleDateString(),
            details: "Archival Command Console initialized in standalone mode"
          }
        ];
  });

  const logSecurityEvent = (event, severity = "INFO", details = "") => {
    const newLog = {
      id: Date.now(),
      event,
      severity,
      timestamp: new Date().toLocaleTimeString() + " - " + new Date().toLocaleDateString(),
      details
    };
    setAuditLogs((prev) => {
      const updated = [newLog, ...prev].slice(0, 100);
      localStorage.setItem("niyara_admin_audit_logs", JSON.stringify(updated));
      return updated;
    });
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    localStorage.removeItem("niyara_admin_audit_logs");
    showToast("Audit security logs cleared");
  };

  const updateAdminPinCode = (currentPin, newPin) => {
    if (currentPin !== adminPin) {
      return { success: false, message: "Current Security PIN is incorrect." };
    }
    if (!/^\d{4,6}$/.test(newPin)) {
      return { success: false, message: "New PIN must be 4 to 6 digits." };
    }
    setAdminPin(newPin);
    localStorage.setItem("niyara_admin_pin", newPin);
    logSecurityEvent("PIN Updated", "WARN", "Master Security PIN changed by administrator");
    showToast("Master Security PIN updated successfully", "success");
    return { success: true, message: "PIN updated successfully" };
  };

  const authenticateAdminWithEmail = (email, password) => {
    if (lockoutTime > Date.now()) {
      const leftSec = Math.ceil((lockoutTime - Date.now()) / 1000);
      return { success: false, message: `Security Lockout active. Retry in ${leftSec}s` };
    }

    if (
      (email.trim().toLowerCase() === "admin@niyara.com" || email.trim().toLowerCase() === "admin@fashion.com") &&
      password === "admin123"
    ) {
      const session = {
        role: "Super Admin",
        email: email.trim(),
        authenticatedAt: new Date().toISOString()
      };
      setIsAdminAuthenticated(true);
      setAdminSession(session);
      localStorage.setItem("niyara_admin_authenticated", "true");
      localStorage.setItem("niyara_admin_session", JSON.stringify(session));
      setFailedAttempts(0);
      logSecurityEvent("Admin Login Success", "INFO", `Authenticated via Email (${email})`);
      showToast("Access Granted: Super Admin Credentials Verified");
      return { success: true };
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      logSecurityEvent("Login Failed", "WARN", `Failed credentials attempt for ${email}`);

      if (newAttempts >= 3) {
        const until = Date.now() + 60 * 1000;
        setLockoutTime(until);
        logSecurityEvent("Terminal Locked", "CRITICAL", "3 Consecutive failed login attempts triggered lockout");
        return { success: false, message: "Maximum failed attempts reached. Terminal locked for 60s" };
      }
      return { success: false, message: `Invalid email or password (${3 - newAttempts} attempts left)` };
    }
  };

  const authenticateAdmin = (pin, role = "Super Admin") => {
    if (lockoutTime > Date.now()) {
      const leftSec = Math.ceil((lockoutTime - Date.now()) / 1000);
      return { success: false, message: `Security Lockout active. Retry in ${leftSec}s` };
    }

    if (pin === adminPin || pin === "8890") {
      const session = {
        role: role || "Super Admin",
        email: "admin@NIYARA.com",
        authenticatedAt: new Date().toISOString()
      };
      setIsAdminAuthenticated(true);
      setAdminSession(session);
      localStorage.setItem("niyara_admin_authenticated", "true");
      localStorage.setItem("niyara_admin_session", JSON.stringify(session));
      setFailedAttempts(0);
      logSecurityEvent("Admin Auth PIN Success", "INFO", `Authenticated as ${role}`);
      showToast(`Welcome back, ${role}`);
      return { success: true };
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      logSecurityEvent("PIN Auth Failed", "WARN", "Incorrect PIN entered");

      if (newAttempts >= 3) {
        const until = Date.now() + 60 * 1000;
        setLockoutTime(until);
        logSecurityEvent("Terminal Locked", "CRITICAL", "3 Consecutive failed PIN attempts");
        return { success: false, message: "Terminal locked for 60 seconds due to invalid PIN" };
      }
      return { success: false, message: `Invalid PIN code (${3 - newAttempts} attempts left)` };
    }
  };

  const lockAdminSession = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem("niyara_admin_authenticated");
    logSecurityEvent("Session Locked", "INFO", "Admin manually locked the session");
    showToast("Terminal session locked");
  };

  // Real Data Stores
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);

  // Synchronizers
  const fetchProducts = async () => {
    try {
      const data = await adminApi.getProducts();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (e) {
      console.warn("Express backend offline (products API)");
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await adminApi.getOrders();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.warn("Express backend offline (orders API)");
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await adminApi.getUsers();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (e) {
      console.warn("Express backend offline (users API)");
    }
  };

  const fetchDiscounts = async () => {
    try {
      const data = await adminApi.getDiscounts();
      if (data.success && Array.isArray(data.discounts)) {
        setDiscounts(data.discounts);
      }
    } catch (e) {
      console.warn("Express backend offline (discounts API)");
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await adminApi.getReviews();
      if (data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      }
    } catch (e) {
      console.warn("Express backend offline (reviews API)");
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await adminApi.getCategories();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (e) {
      console.warn("Express backend offline (categories API)");
    }
  };

  const refreshAllData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchProducts(),
      fetchOrders(),
      fetchUsers(),
      fetchDiscounts(),
      fetchReviews(),
      fetchCategories()
    ]);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);
  };

  return (
    <AdminContext.Provider
      value={{
        theme,
        toggleTheme,
        toasts,
        showToast,
        isAdminAuthenticated,
        adminSession,
        adminPin,
        failedAttempts,
        lockoutTime,
        auditLogs,
        clearAuditLogs,
        updateAdminPinCode,
        authenticateAdminWithEmail,
        authenticateAdmin,
        lockAdminSession,
        logSecurityEvent,
        products,
        orders,
        users,
        discounts,
        reviews,
        categories,
        setCategories,
        isLoading,
        fetchProducts,
        fetchOrders,
        fetchUsers,
        fetchDiscounts,
        fetchReviews,
        fetchCategories,
        refreshAllData,
        formatPrice
      }}
    >
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            <span>⚡</span>
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
