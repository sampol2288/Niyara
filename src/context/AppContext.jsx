import React, { createContext, useContext, useState, useEffect } from "react";
import { PRODUCTS, MOCK_ORDERS } from "../data/products";

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
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [theme, setTheme] = useState("dark"); // 'dark' | 'light'

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

  // Initial cart with items from prompt text
  const [cart, setCart] = useState([
    {
      product: PRODUCTS[0], // Merino Wool Wrap Coat
      color: "Camel",
      size: "M",
      qty: 1
    },
    {
      product: PRODUCTS[2], // Ribbed Architectural Knit
      color: "Oatmeal Melange",
      size: "S",
      qty: 1
    }
  ]);

  // --- AUTHENTICATION & USER MANAGEMENT ---
  const DEFAULT_USERS = [
    {
      name: "Julian Vanderveld",
      email: "julian.v@aether.com",
      password: "password123",
      isVerified: true,
      phone: "+1 (555) 000-0000",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"
    },
    {
      name: "Elena Rostova",
      email: "elena.r@niyara.com",
      password: "password123",
      isVerified: true,
      phone: "+1 (555) 987-6543",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop"
    }
  ];

  const getInitialUser = () => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("niyara_active_user");
      if (!stored || stored === "null") return null;
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  };

  const getRegisteredUsers = () => {
    if (typeof window === "undefined") return DEFAULT_USERS;
    try {
      const stored = localStorage.getItem("niyara_registered_users");
      return stored ? JSON.parse(stored) : DEFAULT_USERS;
    } catch (e) {
      return DEFAULT_USERS;
    }
  };

  const [registeredUsers, setRegisteredUsers] = useState(getRegisteredUsers);
  const [user, setUserInternal] = useState(getInitialUser);
  const [activeOtpSession, setActiveOtpSession] = useState(null); // { email, code: '882194', purpose: 'signup'|'reset', payload: {} }

  const setUser = (newUser) => {
    setUserInternal(newUser);
    if (typeof window !== "undefined") {
      if (newUser) {
        localStorage.setItem("niyara_active_user", JSON.stringify(newUser));
      } else {
        localStorage.setItem("niyara_active_user", "null");
      }
    }
  };

  const updateRegisteredUsers = (newUsersList) => {
    setRegisteredUsers(newUsersList);
    if (typeof window !== "undefined") {
      localStorage.setItem("niyara_registered_users", JSON.stringify(newUsersList));
    }
  };

  const loginUser = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (found) {
      setUser(found);
      showToast(`Welcome back, ${found.name.split(" ")[0]}!`);
      return { success: true, user: found };
    } else {
      const emailExists = registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail);
      if (emailExists) {
        return { success: false, error: "Incorrect password. Please try again." };
      }
      return { success: false, error: "No account found with this email address." };
    }
  };

  const startSignupOtp = (name, email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const exists = registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, error: "An account with this email address already exists." };
    }

    const generatedCode = "882194";
    const otpSession = {
      email: cleanEmail,
      code: generatedCode,
      purpose: "signup",
      payload: {
        name,
        email: cleanEmail,
        password,
        isVerified: true,
        phone: "+1 (555) 000-0000",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"
      }
    };
    setActiveOtpSession(otpSession);
    showToast(`Verification code sent to ${cleanEmail}`);
    return { success: true, otpCode: generatedCode };
  };

  const startResetOtp = (email) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { success: false, error: "No registered account found with this email." };
    }

    const generatedCode = "882194";
    const otpSession = {
      email: cleanEmail,
      code: generatedCode,
      purpose: "reset",
      payload: { email: cleanEmail }
    };
    setActiveOtpSession(otpSession);
    showToast(`Password reset code sent to ${cleanEmail}`);
    return { success: true, otpCode: generatedCode };
  };

  const verifyOtpCode = (enteredCode) => {
    if (!activeOtpSession) {
      return { success: false, error: "No active verification session found." };
    }

    if (enteredCode !== activeOtpSession.code && enteredCode !== "123456") {
      return { success: false, error: "Invalid verification code. Use demo code 882194 or 123456." };
    }

    if (activeOtpSession.purpose === "signup") {
      const newUser = activeOtpSession.payload;
      const updatedList = [...registeredUsers, newUser];
      updateRegisteredUsers(updatedList);
      setUser(newUser);
      setActiveOtpSession(null);
      showToast("Account verified & created successfully!");
      return { success: true, user: newUser, nextStep: "complete" };
    }

    if (activeOtpSession.purpose === "reset") {
      return { success: true, nextStep: "new_password" };
    }

    return { success: true };
  };

  const completePasswordReset = (newPassword) => {
    if (!activeOtpSession || activeOtpSession.purpose !== "reset") {
      return { success: false, error: "Session expired. Please request a new reset code." };
    }

    const email = activeOtpSession.email;
    const updatedList = registeredUsers.map((u) => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return { ...u, password: newPassword };
      }
      return u;
    });

    updateRegisteredUsers(updatedList);
    const updatedUser = updatedList.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (updatedUser) setUser(updatedUser);
    setActiveOtpSession(null);
    showToast("Password updated successfully! You are now logged in.");
    return { success: true };
  };

  const logoutUser = () => {
    setUser(null);
    showToast("Signed out of NIYARA.");
  };

  const updateUserProfile = (updatedFields) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);

    const updatedList = registeredUsers.map((u) => {
      if (u.email.toLowerCase() === user.email.toLowerCase()) {
        return { ...u, ...updatedFields };
      }
      return u;
    });
    updateRegisteredUsers(updatedList);
    showToast("Profile settings saved successfully.");
  };

  const [wishlist, setWishlist] = useState(["technical-archetype-trench", "atmosphere-sneaker", "sculptural-wool-trouser"]);
  const [currency, setCurrency] = useState("USD"); // USD ($) or EUR (€)

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // login, signup, otp, reset_email, reset_new_password
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [toast, setToast] = useState(null);

  const FREE_SHIPPING_THRESHOLD = 200;

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

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
    const newOrder = {
      id: `#AE-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "PREPARING SHIPMENT",
      statusStep: 1,
      total: orderData.total,
      trackingNumber: `AE${Math.floor(1000000000 + Math.random() * 9000000000)}SE`,
      carrier: "PostNord Global",
      estimatedDelivery: "3-5 business days",
      trackingMessage: "We're getting your items ready for their journey.",
      items: cart.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        color: item.color,
        size: item.size,
        qty: item.qty,
        price: item.product.price,
        image: item.product.colors.find((c) => c.name === item.color)?.image || item.product.images[0]
      })),
      shippingAddress: orderData.shippingAddress
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
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

  const [auditLogs, setAuditLogs] = useState([
    {
      id: "LOG-1001",
      timestamp: "Today, 14:10:02",
      actor: "Julian Vanderveld",
      role: "Super Admin",
      action: "ADMIN_EMAIL_AUTHENTICATED",
      severity: "INFO",
      ip: "192.168.1.104",
      details: "Session unlocked via Email & Encrypted Password (admin@NIYARA.com)"
    },
    {
      id: "LOG-1000",
      timestamp: "Today, 12:45:18",
      actor: "System Audit",
      role: "SYSTEM",
      action: "SECURITY_RULES_ENFORCED",
      severity: "INFO",
      ip: "127.0.0.1",
      details: "Encrypted AES-256 vault active; RBAC policies enforced"
    },
    {
      id: "LOG-999",
      timestamp: "Yesterday, 18:22:00",
      actor: "Elena Rostova",
      role: "Senior Manager",
      action: "ORDER_REFUNDED",
      severity: "WARN",
      ip: "192.168.1.118",
      details: "Processed return refund for #ORD-88216 ($320.00)"
    }
  ]);

  const logSecurityEvent = (action, severity = "INFO", details = "") => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }) + ", " + new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      actor: adminSession.user || "Unknown Admin",
      role: adminSession.role || "Admin",
      action,
      severity,
      ip: "192.168.1.104",
      details
    };
    setAuditLogs((prev) => [newLog, ...prev]);
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
        `Authenticated as ${account.name} (${account.role}) via Email (${account.email})`
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
      setIsAdminAuthenticated(true);
      setFailedPinAttempts(0);
      setAdminSession({
        role: selectedRole,
        user: selectedRole === "Super Admin" ? "Julian Vanderveld" : selectedRole === "Senior Manager" ? "Elena Rostova" : "Marcus Vance",
        email: selectedRole === "Super Admin" ? "admin@NIYARA.com" : selectedRole === "Senior Manager" ? "elena.r@NIYARA.com" : "marcus.v@NIYARA.com",
        ip: "192.168.1.104 (TLS 1.3)",
        authenticatedAt: new Date().toLocaleTimeString()
      });

      logSecurityEvent(
        "ADMIN_LOGIN_SUCCESS",
        "INFO",
        `Authenticated as ${selectedRole} (${enteredPin === "8890" ? "PIN" : "Master Passcode"})`
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
        authenticateAdmin,
        authenticateAdminWithEmail,
        lockAdminSession,
        updateAdminPinCode,
        logSecurityEvent,
        failedPinAttempts,
        lockoutTime
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

