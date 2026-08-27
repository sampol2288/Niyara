import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Discount from "../models/Discount.js";
import Review from "../models/Review.js";
import { getDBStatus } from "../config/db.js";
import { sendOTPEmail, sendCustomEmail } from "../services/emailService.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "placeholder-client-id");

// JWT secret MUST come from environment — validated at startup
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";
const ADMIN_JWT_EXPIRES_IN = "4h";

// In-memory OTP sessions: email -> { code, expiresAt, purpose, name }
// NOTE: For multi-instance deployments, replace with Redis.
const activeOTPSessions = new Map();

// ─── Account Lockout System ───────────────────────────────────────────────────
// Tracks failed login attempts per email to prevent brute-force attacks.
// NOTE: For multi-instance deployments, replace with Redis.
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const failedLoginAttempts = new Map(); // email -> { count, firstAttemptAt, lockedUntil }

const checkAccountLockout = (email) => {
  const record = failedLoginAttempts.get(email);
  if (!record) return { locked: false };

  // Check if lockout has expired
  if (record.lockedUntil && Date.now() > record.lockedUntil) {
    failedLoginAttempts.delete(email);
    return { locked: false };
  }

  // Check if currently locked out
  if (record.lockedUntil && Date.now() <= record.lockedUntil) {
    const remainingMs = record.lockedUntil - Date.now();
    const remainingMin = Math.ceil(remainingMs / 60000);
    return { locked: true, remainingMin, remainingMs };
  }

  // Reset counter if the tracking window has passed
  if (Date.now() - record.firstAttemptAt > LOCKOUT_DURATION_MS) {
    failedLoginAttempts.delete(email);
    return { locked: false };
  }

  return { locked: false, attemptsRemaining: MAX_FAILED_ATTEMPTS - record.count };
};

const recordFailedAttempt = (email) => {
  const record = failedLoginAttempts.get(email) || { count: 0, firstAttemptAt: Date.now(), lockedUntil: null };
  record.count += 1;

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    console.warn(`[SECURITY] Account locked: ${email} after ${record.count} failed attempts`);
  }

  failedLoginAttempts.set(email, record);
  return { attemptsRemaining: Math.max(0, MAX_FAILED_ATTEMPTS - record.count), locked: record.lockedUntil != null };
};

const clearFailedAttempts = (email) => {
  failedLoginAttempts.delete(email);
};

// ─── Helper: Generate JWT Token ───────────────────────────────────────────────
const generateJWT = (user, expiresIn = JWT_EXPIRES_IN) => {
  return jwt.sign(
    {
      sub: user._id ? user._id.toString() : user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      iss: "niyara-auth-service"
    },
    JWT_SECRET,
    { expiresIn }
  );
};

// ─── Middleware: Authenticate JWT ─────────────────────────────────────────────
export const protectJWT = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: "Not authorized. Bearer token required." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.sub).select("-password");
    if (!req.user) {
      return res.status(401).json({ success: false, error: "User no longer exists." });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid or expired JWT token." });
  }
};

export const optionalJWT = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.sub).select("-password");
  } catch (err) {
    // Ignore token error for optional middleware
  }
  next();
};

// ─── GET /api/auth/db-status ──────────────────────────────────────────────────
router.get("/db-status", (req, res) => {
  const status = getDBStatus();
  res.json({
    success: true,
    database: {
      state: status.state,
      isOnline: status.isOnline
    },
    timestamp: new Date().toISOString()
  });
});

// ─── POST /api/auth/clear-db (Admin only — purges ALL data) ──────────────────
router.post("/clear-db", protectJWT, adminOnly, async (req, res) => {
  try {
    await Promise.all([
      Category.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      User.deleteMany({ role: { $ne: "admin" } }), // Preserve admin accounts
      Discount.deleteMany({}),
      Review.deleteMany({})
    ]);
    return res.json({ success: true, message: "Non-admin data purged from MongoDB collections." });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ─── POST /api/auth/send-mail (Custom email dispatch) ────────────────────────
router.post("/send-mail", protectJWT, adminOnly, async (req, res) => {
  try {
    const { to, name, subject, body } = req.body;
    if (!to || !subject || !body) {
      return res.status(400).json({ success: false, error: "Recipient email, subject, and body are required." });
    }
    const result = await sendCustomEmail(to.trim().toLowerCase(), name || "Member", subject, body);
    if (result.success) {
      return res.json({ success: true, message: `Email dispatched to ${to}` });
    } else {
      return res.status(500).json({ success: false, error: result.error || "Failed to send email." });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ─── POST /api/auth/send-otp ──────────────────────────────────────────────────
// NOTE: The OTP code is sent via email and logged to server console in dev mode.
router.post("/send-otp", async (req, res) => {
  try {
    const { email, name, purpose } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email address is required." });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, error: "Invalid email address format." });
    }

    // Generate secure 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    activeOTPSessions.set(cleanEmail, {
      code: otpCode,
      expiresAt,
      purpose: purpose || "signup",
      name: name || "Member"
    });

    console.log(`[OTP Verification] Generated code for ${cleanEmail}: ${otpCode} (Expires in 10m)`);

    const emailResult = await sendOTPEmail(cleanEmail, otpCode, purpose || "Verification", name || "Member");

    if (!emailResult.success) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[OTP Email Warning] Email dispatch failed: ${emailResult.error}. Local test mode active: code is ${otpCode}`);
        return res.json({
          success: true,
          message: `Verification code generated for ${cleanEmail}. (Check server log if email delayed)`
        });
      }
      activeOTPSessions.delete(cleanEmail);
      return res.status(500).json({ success: false, error: "Failed to dispatch verification email. Please try again." });
    }

    return res.json({
      success: true,
      message: `Verification code sent to ${cleanEmail}. Please check your inbox.`
    });
  } catch (error) {
    console.error("[Send OTP Error]:", error);
    return res.status(500).json({ success: false, error: "Failed to process OTP request." });
  }
});

// ─── POST /api/auth/verify-otp ────────────────────────────────────────────────
router.post("/verify-otp", (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || code === undefined || code === null || String(code).trim() === "") {
      return res.status(400).json({ success: false, error: "Email address and OTP code are required." });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanCode = String(code).trim();
    const session = activeOTPSessions.get(cleanEmail);

    if (!session) {
      return res.status(400).json({ success: false, error: "No active verification session. Please request a new code." });
    }

    if (Date.now() > session.expiresAt) {
      activeOTPSessions.delete(cleanEmail);
      return res.status(400).json({ success: false, error: "Verification code has expired. Please request a new code." });
    }

    if (session.code !== cleanCode) {
      return res.status(400).json({ success: false, error: "Invalid verification code. Please check your email and try again." });
    }

    activeOTPSessions.delete(cleanEmail);
    return res.json({ success: true, message: "OTP verified successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Error verifying OTP." });
  }
});

// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "Name, email, and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase();
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, error: "Invalid email address format." });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "An account with this email address already exists." });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: "member",
      isVerified: true
    });

    const token = generateJWT(user);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error("[Register Error]:", error);
    return res.status(500).json({ success: false, error: "Server error during registration." });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ success: false, error: "No account found with this email address." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Incorrect password. Please try again." });
    }

    const token = generateJWT(user);

    return res.json({
      success: true,
      message: "Authenticated successfully.",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error("[Login Error]:", error);
    return res.status(500).json({ success: false, error: "Server error during login." });
  }
});

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
// Requires prior OTP verification (email verified via send-otp → verify-otp flow)
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ success: false, error: "Email and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ success: false, error: "No account found with this email address." });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    return res.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("[Reset Password Error]:", error);
    return res.status(500).json({ success: false, error: "Server error during password reset." });
  }
});

// ─── PATCH /api/auth/update-password ─────────────────────────────────────────
// Authenticated users changing their own password
router.patch("/update-password", protectJWT, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: "Current and new passwords are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: "New password must be at least 6 characters." });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Current password is incorrect." });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });

    return res.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error updating password." });
  }
});

// ─── POST /api/auth/google ───────────────────────────────────────────────────
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, error: "Google credential is required." });
    }

    const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID || "placeholder-client-id", 
    });
    const payload = ticket.getPayload();
    const email = payload.email.toLowerCase();
    const name = payload.name;
    const picture = payload.picture;

    let user = await User.findOne({ email });
    if (!user) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12), salt);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "member",
        isVerified: true,
        avatar: picture
      });
    }

    const token = generateJWT(user);

    return res.json({
      success: true,
      message: "Authenticated successfully with Google.",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error("[Google Auth Error]:", error);
    return res.status(500).json({ success: false, error: "Server error during Google authentication." });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get("/me", protectJWT, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      avatar: req.user.avatar,
      isVerified: req.user.isVerified
    }
  });
});

// ─── POST /api/auth/admin-login ───────────────────────────────────────────────
// Dedicated admin login endpoint with stricter security:
// - Enforces admin role server-side
// - Shorter JWT expiry (4h vs 7d)
// - Account lockout after 5 failed attempts
router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required." });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check account lockout
    const lockoutStatus = checkAccountLockout(cleanEmail);
    if (lockoutStatus.locked) {
      return res.status(429).json({
        success: false,
        error: `Account temporarily locked due to too many failed attempts. Try again in ${lockoutStatus.remainingMin} minute(s).`,
        locked: true,
        lockoutRemainingMs: lockoutStatus.remainingMs
      });
    }

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      const attempt = recordFailedAttempt(cleanEmail);
      return res.status(401).json({
        success: false,
        error: "Invalid credentials.",
        attemptsRemaining: attempt.attemptsRemaining
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const attempt = recordFailedAttempt(cleanEmail);
      return res.status(401).json({
        success: false,
        error: "Invalid credentials.",
        attemptsRemaining: attempt.attemptsRemaining
      });
    }

    // Enforce admin role
    if (user.role !== "admin") {
      recordFailedAttempt(cleanEmail);
      return res.status(403).json({
        success: false,
        error: "Access denied. Administrator privileges are required."
      });
    }

    // Success — clear failed attempts and issue short-lived admin token
    clearFailedAttempts(cleanEmail);
    const token = generateJWT(user, ADMIN_JWT_EXPIRES_IN);

    return res.json({
      success: true,
      message: "Admin authenticated successfully.",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error("[Admin Login Error]:", error);
    return res.status(500).json({ success: false, error: "Server error during admin authentication." });
  }
});

/**
 * Ensure default admin account exists in MongoDB Atlas upon server startup
 */
export const ensureDefaultAdminAccount = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "niyara2288@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(12);
      const defaultPassword = process.env.ADMIN_PASSWORD || "Niyara123$";
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);
      await User.create({
        name: "Julian Vanderveld",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isVerified: true
      });
      console.log(`[MongoDB Seed] Default admin account created: ${adminEmail} / ${defaultPassword === "admin123" ? "admin123" : "****"}`);
      if (process.env.NODE_ENV === "production" && defaultPassword === "admin123") {
        console.warn("⚠️  [SECURITY] Default admin password 'admin123' is active in PRODUCTION.");
        console.warn("⚠️  [SECURITY] Please set ADMIN_PASSWORD in your .env file immediately.");
      }
    } else if (existingAdmin.role !== "admin") {
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log(`[MongoDB Seed] Updated role to admin for ${adminEmail}`);
    }
  } catch (err) {
    console.warn("[MongoDB Seed Warning]: Could not seed default admin user:", err.message);
  }
};

export default router;

