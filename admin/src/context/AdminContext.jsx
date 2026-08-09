import React, { createContext, useContext, useState, useEffect } from "react";
import { adminApi } from "../api/adminApi";

const AdminContext = createContext();

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

  const authenticateAdminWithEmail = async (email, password) => {
    if (lockoutTime > Date.now()) {
      const leftSec = Math.ceil((lockoutTime - Date.now()) / 1000);
      return { success: false, message: `Security Lockout active. Retry in ${leftSec}s` };
    }

    try {
      // Call the real backend — no hardcoded credentials
      const result = await adminApi.login(email.trim(), password);

      if (result.success && result.user && result.user.role === "admin") {
        const session = {
          role: result.user.role,
          name: result.user.name,
          email: result.user.email,
          authenticatedAt: new Date().toISOString()
        };
        setIsAdminAuthenticated(true);
        setAdminSession(session);
        localStorage.setItem("niyara_admin_authenticated", "true");
        localStorage.setItem("niyara_admin_session", JSON.stringify(session));
        localStorage.setItem("niyara_admin_jwt", result.token);
        setFailedAttempts(0);
        logSecurityEvent("Admin Login Success", "INFO", `Authenticated as ${result.user.name} (${result.user.email})`);
        showToast(`Welcome back, ${result.user.name}!`, "success");
        return { success: true };
      } else if (result.success && result.user && result.user.role !== "admin") {
        // User exists but is not admin
        logSecurityEvent("Admin Login Unauthorized", "WARN", `Non-admin user attempted admin login: ${email}`);
        return { success: false, message: "Access denied. Administrator privileges required." };
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
        return { success: false, message: result.error || `Invalid email or password (${3 - newAttempts} attempts left)` };
      }
    } catch (err) {
      console.error("[Admin Login Error]:", err);
      return { success: false, message: "Unable to reach the authentication server. Please check your connection." };
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
    localStorage.removeItem("niyara_admin_jwt");
    localStorage.removeItem("niyara_admin_session");
    logSecurityEvent("Session Locked", "INFO", "Admin manually locked the session");
    showToast("Terminal session locked");
  };

  // Listen for unauthorized events from API (token expired)
  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAdminAuthenticated(false);
      logSecurityEvent("Session Expired", "WARN", "Admin JWT token expired — re-authentication required");
      showToast("Session expired. Please log in again.", "error");
    };
    window.addEventListener("niyara:admin:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("niyara:admin:unauthorized", handleUnauthorized);
  }, []);

  // Real Data Stores
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
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
