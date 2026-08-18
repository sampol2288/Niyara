import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { adminApi } from "../api/adminApi";

const AdminContext = createContext();

// ─── Idle Timeout Configuration ───────────────────────────────────────────────
const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes of inactivity
const IDLE_ACTIVITY_EVENTS = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];

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

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const [adminSession, setAdminSession] = useState({
    role: null,
    email: null,
    name: null,
    authenticatedAt: null
  });

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

  // ─── JWT Session Validation on App Load ─────────────────────────────────────
  // Immediately validates the stored JWT token on mount. If the token is
  // expired, invalid, or the user is no longer an admin, auth state is cleared.
  useEffect(() => {
    const validateSession = async () => {
      const storedAuth = localStorage.getItem("niyara_admin_authenticated");
      const storedToken = localStorage.getItem("niyara_admin_jwt");

      if (storedAuth !== "true" || !storedToken) {
        setIsAdminAuthenticated(false);
        setIsSessionLoading(false);
        return;
      }

      try {
        const result = await adminApi.verifySession();

        if (result.success && result.user && result.user.role === "admin") {
          const savedSession = localStorage.getItem("niyara_admin_session");
          const session = savedSession
            ? JSON.parse(savedSession)
            : {
                role: result.user.role,
                name: result.user.name,
                email: result.user.email,
                authenticatedAt: new Date().toISOString()
              };
          setAdminSession(session);
          setIsAdminAuthenticated(true);
        } else {
          // Token valid but user is not admin, or token invalid
          localStorage.removeItem("niyara_admin_authenticated");
          localStorage.removeItem("niyara_admin_jwt");
          localStorage.removeItem("niyara_admin_session");
          setIsAdminAuthenticated(false);
          if (result.user && result.user.role !== "admin") {
            logSecurityEvent("Session Rejected", "WARN", "Stored token belongs to non-admin user — session cleared");
          } else {
            logSecurityEvent("Session Expired", "WARN", "Stored JWT token is no longer valid — re-authentication required");
          }
        }
      } catch (err) {
        // Network error — allow offline access if token exists (graceful degradation)
        console.warn("[Session Validation] Could not reach server:", err.message);
        const savedSession = localStorage.getItem("niyara_admin_session");
        if (savedSession) {
          setAdminSession(JSON.parse(savedSession));
          setIsAdminAuthenticated(true);
        }
      }

      setIsSessionLoading(false);
    };

    validateSession();
  }, []);

  // ─── Idle Timeout System ────────────────────────────────────────────────────
  // Auto-locks the admin session after 30 minutes of no user activity.
  const idleTimerRef = useRef(null);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = setTimeout(() => {
      if (isAdminAuthenticated) {
        setIsAdminAuthenticated(false);
        localStorage.removeItem("niyara_admin_authenticated");
        localStorage.removeItem("niyara_admin_jwt");
        localStorage.removeItem("niyara_admin_session");
        logSecurityEvent("Idle Timeout", "WARN", "Session auto-locked after 30 minutes of inactivity");
        showToast("Session locked due to inactivity", "error");
      }
    }, IDLE_TIMEOUT_MS);
  }, [isAdminAuthenticated]);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      return;
    }

    // Start the idle timer
    resetIdleTimer();

    // Reset timer on any user activity
    const handleActivity = () => resetIdleTimer();
    IDLE_ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      IDLE_ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAdminAuthenticated, resetIdleTimer]);

  // ─── Admin Email + Password Authentication ──────────────────────────────────
  const authenticateAdminWithEmail = async (email, password) => {
    try {
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
        logSecurityEvent("Admin Login Success", "INFO", `Authenticated as ${result.user.name} (${result.user.email})`);
        showToast(`Welcome back, ${result.user.name}!`, "success");
        return { success: true };
      } else if (result.locked) {
        logSecurityEvent("Account Locked", "CRITICAL", `Admin login locked for: ${email}`);
        return {
          success: false,
          message: result.error,
          locked: true,
          lockoutRemainingMs: result.lockoutRemainingMs
        };
      } else if (result.error) {
        logSecurityEvent("Login Failed", "WARN", `Failed login attempt for ${email}: ${result.error}`);
        return {
          success: false,
          message: result.error,
          attemptsRemaining: result.attemptsRemaining
        };
      } else {
        return { success: false, message: "Invalid email or password" };
      }
    } catch (err) {
      console.error("[Admin Login Error]:", err);
      return { success: false, message: "Unable to reach the authentication server. Please check your connection." };
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

  // Listen for unauthorized events from API (token expired during a fetch)
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
        isSessionLoading,
        adminSession,
        auditLogs,
        clearAuditLogs,
        authenticateAdminWithEmail,
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
