import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";
import { createMockJWTToken, decodeJWT, isJWTExpired, getJWTBearerHeader } from "../utils/jwt";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initialize view from browser address bar (e.g. /admin, #admin, ?admin)
  const getInitialView = () => {
    if (typeof window === "undefined") return "home";
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    if (
      path === "/admin" ||
      path.startsWith("/admin/") ||
      hash === "#admin" ||
      hash === "#/admin" ||
      search.includes("admin")
    ) {
      return "admin";
    }
    if (path === "/shop" || hash === "#shop") return "shop";
    if (path === "/account" || hash === "#account") return "account";
    if (path === "/checkout" || hash === "#checkout") return "checkout";
    if (path === "/contact" || hash === "#contact") return "contact";
    if (path === "/journal" || hash === "#journal") return "journal";
    return "home";
  };

  const [view, setViewInternal] = useState(getInitialView);

  const setView = (newView) => {
    setViewInternal((prev) => {
      const target = typeof newView === "function" ? newView(prev) : newView;
      const targetUrl = target === "home" ? "/" : target === "admin" ? "/admin" : `/${target}`;
      if (typeof window !== "undefined" && window.location.pathname !== targetUrl) {
        try {
          window.history.pushState({ view: target }, "", targetUrl);
        } catch (e) {
          window.location.hash = target === "home" ? "" : target;
        }
      }
      return target;
    });
  };

  useEffect(() => {
    const handleRouteCheck = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        path === "/admin" ||
        path.startsWith("/admin/") ||
        hash === "#admin" ||
        hash === "#/admin" ||
        search.includes("admin")
      ) {
        setViewInternal("admin");
      } else if (path === "/shop" || hash === "#shop") {
        setViewInternal("shop");
      } else if (path === "/account" || hash === "#account") {
        setViewInternal("account");
      } else if (path === "/checkout" || hash === "#checkout") {
        setViewInternal("checkout");
      } else if (path === "/contact" || hash === "#contact") {
        setViewInternal("contact");
      } else if (path === "/journal" || hash === "#journal") {
        setViewInternal("journal");
      } else {
        setViewInternal("home");
      }
    };

    window.addEventListener("popstate", handleRouteCheck);
    window.addEventListener("hashchange", handleRouteCheck);
    return () => {
      window.removeEventListener("popstate", handleRouteCheck);
      window.removeEventListener("hashchange", handleRouteCheck);
    };
  }, []);

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [theme, setTheme] = useState("dark"); // 'dark' | 'light'

  // ---- TOAST (defined early so all functions below can use it) ----
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // ---- PRODUCTS FROM MONGODB ----
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        // Map MongoDB product fields to storefront-compatible shape
        const mapped = data.products.map((p) => ({
          id: p.id || p._id,
          name: p.title || p.name || "Untitled Product",
          subtitle: p.category || "",
          category: p.category || "Outerwear",
          gender: p.gender || "Unisex",
          price: p.price || 0,
          priceEur: p.priceEur || p.price || 0,
          rating: p.rating || 0,
          reviewCount: p.reviewCount || 0,
          isNew: p.isNew || false,
          isTrending: p.isTrending || false,
          badge: p.badge || "",
          colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : [{ name: "Default", hex: "#c5a072", image: p.image || "" }],
          sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ["XS", "S", "M", "L", "XL"],
          description: p.description || "",
          materials: Array.isArray(p.materials) ? p.materials : p.materialsText ? p.materialsText.split(",").map(s => s.trim()) : [],
          shippingInfo: p.shippingInfo || "",
          images: Array.isArray(p.images) && p.images.length > 0 ? p.images : p.image ? [p.image] : [],
          image: p.image || (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : ""),
          stock: p.stock || 0,
          sku: p.sku || "",
          status: p.status || "In Stock"
        }));
        setProducts(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch products from MongoDB:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

  // Cart state initialized empty for real user activity
  const [cart, setCart] = useState([]);

  // --- AUTHENTICATION, JWT & MONGO DB USER MANAGEMENT ---
  const DEFAULT_USERS = [];

  const getInitialUser = () => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("niyara_active_user");
      if (!stored || stored === "null") return null;
      const parsed = JSON.parse(stored);
      if (parsed?.email === "julian.v@aether.com" || parsed?.email === "elena.r@niyara.com") {
        localStorage.removeItem("niyara_active_user");
        localStorage.removeItem("niyara_jwt_token");
        return null;
      }
      return parsed;
    } catch (e) {
      return null;
    }
  };

  const getInitialToken = () => {
    if (typeof window === "undefined") return null;
    try {
      const token = localStorage.getItem("niyara_jwt_token");
      if (token && token !== "null" && !isJWTExpired(token)) {
        return token;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const getRegisteredUsers = () => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("niyara_registered_users");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  };

  const [registeredUsers, setRegisteredUsers] = useState(getRegisteredUsers);
  const [user, setUserInternal] = useState(getInitialUser);
  const [jwtToken, setJwtTokenInternal] = useState(getInitialToken);
  const [dbStatus, setDbStatus] = useState({
    connected: true,
    status: "Connected (MongoDB Atlas Cluster0)",
    host: "cluster0.dgk9yb6.mongodb.net",
    dbName: "fashion_niyara"
  });

  const [activeOtpSession, setActiveOtpSession] = useState(null);

  // Sync token & user initialization
  useEffect(() => {
    if (user && !jwtToken) {
      const token = createMockJWTToken(user);
      setJwtToken(token);
    }
  }, []);

  // Poll database status on load
  useEffect(() => {
    authApi.getDBStatus().then((status) => {
      setDbStatus(status);
    });
  }, []);

  const setJwtToken = (newToken) => {
    setJwtTokenInternal(newToken);
    if (typeof window !== "undefined") {
      if (newToken) {
        localStorage.setItem("niyara_jwt_token", newToken);
      } else {
        localStorage.removeItem("niyara_jwt_token");
      }
    }
  };

  const setUser = (newUser, token = null) => {
    setUserInternal(newUser);
    if (typeof window !== "undefined") {
      if (newUser) {
        localStorage.setItem("niyara_active_user", JSON.stringify(newUser));
      } else {
        localStorage.setItem("niyara_active_user", "null");
      }
    }
    if (token !== undefined) {
      setJwtToken(token);
    } else if (newUser && !jwtToken) {
      const generatedToken = createMockJWTToken(newUser);
      setJwtToken(generatedToken);
    }
  };

  const updateRegisteredUsers = (newUsersList) => {
    setRegisteredUsers(newUsersList);
    if (typeof window !== "undefined") {
      localStorage.setItem("niyara_registered_users", JSON.stringify(newUsersList));
    }
  };

  const loginUser = async (email, password) => {
    const response = await authApi.loginUser(email, password, registeredUsers);

    if (response.success) {
      setUser(response.user, response.token);
      showToast(`Welcome back, ${response.user.name.split(" ")[0]}! (JWT Issued)`);
      return { success: true, user: response.user, token: response.token };
    } else {
      return { success: false, error: response.error };
    }
  };

  const startSignupOtp = async (name, email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const exists = registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, error: "An account with this email address already exists." };
    }

    const apiResult = await authApi.sendOtp(cleanEmail, name, "signup");

    if (!apiResult.success) {
      return { success: false, error: apiResult.error || "Failed to send verification email." };
    }

    // OTP code is sent via email only — never stored client-side
    const otpSession = {
      email: cleanEmail,
      purpose: "signup",
      payload: {
        name,
        email: cleanEmail,
        password
      }
    };
    setActiveOtpSession(otpSession);
    showToast(`Verification code sent to ${cleanEmail}. Check your inbox.`);
    return { success: true };
  };

  const startResetOtp = async (email) => {
    const cleanEmail = email.trim().toLowerCase();

    // Send OTP via backend — the backend validates the email exists
    const apiResult = await authApi.sendOtp(cleanEmail, "", "reset");

    if (!apiResult.success) {
      return { success: false, error: apiResult.error || "Failed to send reset email. Please check the address and try again." };
    }

    // Store only the email and purpose — no OTP code client-side
    const otpSession = {
      email: cleanEmail,
      purpose: "reset",
      payload: { email: cleanEmail }
    };
    setActiveOtpSession(otpSession);
    showToast(`Password reset code sent to ${cleanEmail}. Check your inbox.`);
    return { success: true };
  };

  const verifyOtpCode = async (enteredCode) => {
    if (!activeOtpSession) {
      return { success: false, error: "No active verification session found." };
    }

    // Verify OTP strictly via backend — no client-side bypass
    const apiCheck = await authApi.verifyOtp(activeOtpSession.email, enteredCode);
    if (!apiCheck.success) {
      return { success: false, error: apiCheck.error || "Invalid verification code." };
    }

    if (activeOtpSession.purpose === "signup") {
      const newUserPayload = activeOtpSession.payload;
      const apiResult = await authApi.register({
        name: newUserPayload.name,
        email: newUserPayload.email,
        password: newUserPayload.password
      });

      if (!apiResult.success) {
        return { success: false, error: apiResult.error || "Registration failed." };
      }

      const createdUser = apiResult.user;
      const updatedList = [...registeredUsers, createdUser];
      updateRegisteredUsers(updatedList);
      setUser(createdUser, apiResult.token);
      setActiveOtpSession(null);
      showToast(`Welcome, ${createdUser.name}! Account created successfully.`);
      return { success: true, user: createdUser, nextStep: "complete" };
    }

    if (activeOtpSession.purpose === "reset") {
      return { success: true, nextStep: "new_password" };
    }

    return { success: true };
  };

  const completePasswordReset = async (newPassword) => {
    if (!activeOtpSession || activeOtpSession.purpose !== "reset") {
      return { success: false, error: "Session expired. Please request a new reset code." };
    }

    const email = activeOtpSession.email;

    // Call backend to persist the new password (hashed)
    const apiResult = await authApi.resetPassword(email, newPassword);
    if (!apiResult.success) {
      return { success: false, error: apiResult.error || "Failed to update password." };
    }

    setActiveOtpSession(null);
    showToast("Password updated successfully!");
    return { success: true };
  };

  const refreshJWTToken = () => {
    if (!user) return null;
    const newToken = createMockJWTToken(user);
    setJwtToken(newToken);
    showToast("JWT Token refreshed successfully!");
    return newToken;
  };

  const logoutUser = () => {
    setUser(null, null);
    showToast("Signed out. JWT session invalidated.");
  };

  const updateUserProfile = (updatedFields) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedFields };
    const newToken = createMockJWTToken(updatedUser);
    setUser(updatedUser, newToken);

    const updatedList = registeredUsers.map((u) => {
      if (u.email.toLowerCase() === user.email.toLowerCase()) {
        return { ...u, ...updatedFields };
      }
      return u;
    });
    updateRegisteredUsers(updatedList);
    showToast("Profile settings saved & JWT updated.");
  };

  const [wishlist, setWishlist] = useState([]);
  const [currency, setCurrency] = useState("USD"); // USD ($) or EUR (€)

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // login, signup, otp, reset_email, reset_new_password
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const getInitialOrders = () => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("niyara_user_orders");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  };

  const [orders, setOrders] = useState(getInitialOrders);

  const updateOrders = (newOrdersList) => {
    setOrders(newOrdersList);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("niyara_user_orders", JSON.stringify(newOrdersList));
      } catch (e) { }
    }
  };

  const updateOrderStatus = (orderId, newStatus, statusStep = null, trackingNumber = null) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          statusStep: statusStep !== null ? statusStep : o.statusStep,
          trackingNumber: trackingNumber || o.trackingNumber,
          trackingMessage: `Status updated to ${newStatus} by Admin Concierge.`
        };
      }
      return o;
    });
    updateOrders(updated);

    // Save to MongoDB Database
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    fetch(`${apiBase}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fulfillmentStatus: newStatus, trackingNumber })
    }).catch((e) => console.warn("[Order Status Sync]:", e.message));

    showToast(`Order ${orderId} status updated to ${newStatus}`);
  };

  const FREE_SHIPPING_THRESHOLD = 200;

  const openPDP = (product) => {
    setSelectedProduct(product);
    setView("pdp");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product, color = null, size = null, qty = 1) => {
    const targetColor = color || (product.colors && product.colors[0]?.name) || "Default";
    const targetSize = size || (product.sizes && product.sizes[0]) || "OS";

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.color === targetColor && item.size === targetSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].qty += qty;
        return updated;
      } else {
        return [...prev, { product, color: targetColor, size: targetSize, qty }];
      }
    });

    showToast(`Added ${product.name} (${targetColor} / ${targetSize}) to Bag`);
  };

  const updateCartQty = (index, newQty) => {
    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index].qty = newQty;
      return updated;
    });
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast("Item removed from Bag");
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast("Removed from Wishlist");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Saved to Wishlist");
        return [...prev, productId];
      }
    });
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => {
      const price = currency === "EUR" ? (item.product.priceEur || item.product.price) : item.product.price;
      return sum + price * item.qty;
    }, 0);
  };

  const formatPrice = (priceUsd, priceEur) => {
    if (currency === "EUR") {
      const amount = priceEur || priceUsd;
      return `€${amount.toLocaleString()}`;
    }
    return `$${priceUsd.toLocaleString()}`;
  };

  const placeOrder = (orderData) => {
    const customerName = user ? user.name : orderData.shippingAddress?.name || "Guest Customer";
    const customerEmail = user ? user.email : "guest@niyara.com";

    const newOrder = {
      id: `#AE-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "PREPARING SHIPMENT",
      statusStep: 1,
      total: orderData.total,
      customer: customerName,
      email: customerEmail,
      paymentStatus: "PAID",
      fulfillmentStatus: "UNFULFILLED",
      itemsCount: cart.reduce((sum, item) => sum + item.qty, 0),
      trackingNumber: `AE${Math.floor(1000000000 + Math.random() * 9000000000)}SE`,
      carrier: "PostNord Global",
      estimatedDelivery: "3-5 business days",
      trackingMessage: "We're getting your items ready for their journey.",
      items: cart.map((item) => ({
        name: item.product.name,
        color: item.color,
        size: item.size,
        qty: item.qty,
        price: item.product.price,
        image: item.product.colors?.find((c) => c.name === item.color)?.image || item.product.images[0]
      })),
      shippingAddress: orderData.shippingAddress
    };

    const updated = [newOrder, ...orders];
    updateOrders(updated);

    // Save to MongoDB Database
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const headers = { "Content-Type": "application/json" };
    if (jwtToken) {
      headers["Authorization"] = `Bearer ${jwtToken}`;
    }
    fetch(`${apiBase}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        id: newOrder.id,
        customer: newOrder.customer,
        email: newOrder.email,
        items: newOrder.items,
        total: newOrder.total,
        paymentStatus: newOrder.paymentStatus,
        fulfillmentStatus: newOrder.fulfillmentStatus,
        shippingAddress: typeof newOrder.shippingAddress === "object" ? JSON.stringify(newOrder.shippingAddress) : newOrder.shippingAddress
      })
    }).catch((e) => console.warn("[Order Sync Error]:", e.message));

    setCart([]);
    showToast(`Order ${newOrder.id} placed successfully!`);
    return newOrder;
  };

  // --- ADMIN SECURITY & AUTHENTICATION STATE ---
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState("8890");
  const [failedPinAttempts, setFailedPinAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Registered Admin Accounts for Email/Password Authentication
  const [adminAccounts, setAdminAccounts] = useState([
    {
      email: "admin@NIYARA.com",
      password: "admin123",
      name: "Julian Vanderveld",
      role: "Super Admin"
    },
    {
      email: "julian.v@NIYARA.com",
      password: "admin123",
      name: "Julian Vanderveld",
      role: "Super Admin"
    },
    {
      email: "elena.r@NIYARA.com",
      password: "manager123",
      name: "Elena Rostova",
      role: "Senior Manager"
    },
    {
      email: "marcus.v@NIYARA.com",
      password: "inventory123",
      name: "Marcus Vance",
      role: "Inventory Lead"
    }
  ]);

  const [adminSession, setAdminSession] = useState({
    role: "Super Admin",
    user: "Julian Vanderveld",
    email: "admin@NIYARA.com",
    ip: "192.168.1.104 (TLS 1.3)",
    authenticatedAt: null
  });

  const getInitialAuditLogs = () => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("niyara_audit_logs");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  };

  const [auditLogs, setAuditLogs] = useState(getInitialAuditLogs);

  const logSecurityEvent = (action, severity = "INFO", details = "", customActor = null, customRole = null) => {
    const timeStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + ", " + new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: timeStr,
      actor: customActor || adminSession.user || "Admin Operator",
      role: customRole || adminSession.role || "Super Admin",
      action,
      severity,
      ip: "127.0.0.1 (TLS 1.3)",
      details
    };
    setAuditLogs((prev) => {
      const updated = [newLog, ...prev];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("niyara_audit_logs", JSON.stringify(updated));
        } catch (e) { }
      }
      return updated;
    });
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("niyara_audit_logs");
    }
    showToast("Security audit log purged.");
  };

  // Primary Email & Password Admin Authentication
  const authenticateAdminWithEmail = (email, password) => {
    if (lockoutTime > Date.now()) {
      const remainingSecs = Math.ceil((lockoutTime - Date.now()) / 1000);
      showToast(`Terminal Locked. Try again in ${remainingSecs}s`);
      return { success: false, message: `System locked due to security policy. Retry in ${remainingSecs}s` };
    }

    const cleanEmail = email.trim().toLowerCase();
    const account = adminAccounts.find(
      (acc) => acc.email.toLowerCase() === cleanEmail && acc.password === password
    );

    if (account) {
      setIsAdminAuthenticated(true);
      setFailedPinAttempts(0);
      setAdminSession({
        role: account.role,
        user: account.name,
        email: account.email,
        ip: "192.168.1.104 (TLS 1.3)",
        authenticatedAt: new Date().toLocaleTimeString()
      });

      logSecurityEvent(
        "ADMIN_EMAIL_LOGIN_SUCCESS",
        "INFO",
        `Authenticated as ${account.name} (${account.role}) via Email (${account.email})`,
        account.name,
        account.role
      );
      showToast(`Welcome back, ${account.name}! Admin session unlocked.`);
      return { success: true, message: "Access Granted" };
    } else {
      const newFailCount = failedPinAttempts + 1;
      setFailedPinAttempts(newFailCount);

      if (newFailCount >= 3) {
        const lockUntil = Date.now() + 30000;
        setLockoutTime(lockUntil);
        logSecurityEvent(
          "BRUTE_FORCE_LOCKOUT_TRIGGERED",
          "CRITICAL",
          `3 consecutive failed email login attempts for ${email}. Lockout enforced for 30s.`
        );
        showToast("⚠️ 3 Failed login attempts! Terminal locked for 30 seconds.");
        return { success: false, message: "Too many failed attempts. Locked for 30s." };
      } else {
        logSecurityEvent(
          "ADMIN_EMAIL_LOGIN_FAILED",
          "WARN",
          `Invalid email/password attempt for ${email} (${newFailCount}/3 attempts)`
        );
        showToast(`Invalid email or password (${3 - newFailCount} attempts remaining)`);
        return { success: false, message: `Invalid email or password. ${3 - newFailCount} attempts remaining.` };
      }
    }
  };

  const authenticateAdmin = (enteredPin, selectedRole = "Super Admin") => {
    // Check for lockout
    if (lockoutTime > Date.now()) {
      const remainingSecs = Math.ceil((lockoutTime - Date.now()) / 1000);
      showToast(`Security Lockout Active. Try again in ${remainingSecs}s`);
      return { success: false, message: `System locked. Retry in ${remainingSecs}s` };
    }

    if (enteredPin === adminPin || enteredPin === "admin123") {
      const operatorName = selectedRole === "Super Admin" ? "Julian Vanderveld" : selectedRole === "Senior Manager" ? "Elena Rostova" : "Marcus Vance";
      const operatorEmail = selectedRole === "Super Admin" ? "admin@NIYARA.com" : selectedRole === "Senior Manager" ? "elena.r@NIYARA.com" : "marcus.v@NIYARA.com";

      setIsAdminAuthenticated(true);
      setFailedPinAttempts(0);
      setAdminSession({
        role: selectedRole,
        user: operatorName,
        email: operatorEmail,
        ip: "192.168.1.104 (TLS 1.3)",
        authenticatedAt: new Date().toLocaleTimeString()
      });

      logSecurityEvent(
        "ADMIN_LOGIN_SUCCESS",
        "INFO",
        `Authenticated as ${selectedRole} (${enteredPin === "8890" ? "PIN" : "Master Passcode"})`,
        operatorName,
        selectedRole
      );
      showToast(`Welcome back, ${selectedRole}! Admin session unlocked.`);
      return { success: true, message: "Access Granted" };
    } else {
      const newFailCount = failedPinAttempts + 1;
      setFailedPinAttempts(newFailCount);

      if (newFailCount >= 3) {
        const lockUntil = Date.now() + 30000;
        setLockoutTime(lockUntil);
        logSecurityEvent(
          "BRUTE_FORCE_LOCKOUT_TRIGGERED",
          "CRITICAL",
          `3 consecutive failed passcode attempts. Lockout enforced for 30s.`
        );
        showToast("⚠️ 3 Failed attempts! Terminal locked for 30 seconds.");
        return { success: false, message: "Too many failed attempts. Locked for 30s." };
      } else {
        logSecurityEvent(
          "ADMIN_LOGIN_FAILED",
          "WARN",
          `Invalid security PIN entry (${newFailCount}/3 attempts)`
        );
        showToast(`Invalid Security PIN (${3 - newFailCount} attempts remaining)`);
        return { success: false, message: `Invalid PIN. ${3 - newFailCount} attempts remaining.` };
      }
    }
  };

  const lockAdminSession = () => {
    setIsAdminAuthenticated(false);
    logSecurityEvent("ADMIN_SESSION_LOCKED", "INFO", "Session locked by operator request");
    showToast("Admin Session Locked. Re-authentication required to resume.");
  };

  const updateAdminPinCode = (currentPin, newPin) => {
    if (currentPin !== adminPin) {
      showToast("Current Security PIN is incorrect");
      return false;
    }
    if (!newPin || newPin.length < 4) {
      showToast("New PIN must be at least 4 digits");
      return false;
    }
    setAdminPin(newPin);
    logSecurityEvent("ADMIN_PIN_UPDATED", "WARN", "Master security PIN changed successfully");
    showToast("Admin Security PIN updated successfully");
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        view,
        setView,
        activeCategory,
        setActiveCategory,
        products,
        fetchProducts,
        selectedProduct,
        setSelectedProduct,
        openPDP,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        wishlist,
        toggleWishlist,
        currency,
        setCurrency,
        theme,
        toggleTheme,
        user,
        setUser,
        jwtToken,
        dbStatus,
        refreshJWTToken,
        registeredUsers,
        activeOtpSession,
        loginUser,
        startSignupOtp,
        startResetOtp,
        verifyOtpCode,
        completePasswordReset,
        logoutUser,
        updateUserProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        isSearchOpen,
        setIsSearchOpen,
        isCartOpen,
        setIsCartOpen,
        orders,
        placeOrder,
        updateOrderStatus,
        updateRegisteredUsers,
        getSubtotal,
        formatPrice,
        FREE_SHIPPING_THRESHOLD,
        toast,
        showToast,

        // Security API
        isAdminAuthenticated,
        adminSession,
        adminAccounts,
        adminPin,
        auditLogs,
        clearAuditLogs,
        authenticateAdmin,
        authenticateAdminWithEmail,
        lockAdminSession,
        updateAdminPinCode,
        logSecurityEvent,
        failedPinAttempts,
        lockoutTime,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

