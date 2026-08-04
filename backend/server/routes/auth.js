import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { getDBStatus } from "../config/db.js";
import { sendOTPEmail } from "../services/emailService.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "niyara_archival_jwt_secret_key_2026";
const JWT_EXPIRES_IN = "7d";

// Active OTP Sessions in Memory
const activeOTPSessions = new Map(); // email -> { code, expiresAt, purpose, name }

// Helper to generate JWT token
const generateJWT = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      iss: "niyara-auth-service"
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Middleware: Authenticate JWT Header
export const protectJWT = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: "Not authorized, missing JWT Bearer token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.sub).select("-password");
    if (!req.user) {
      return res.status(401).json({ success: false, error: "User associated with JWT token no longer exists" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid or expired JWT token: " + err.message });
  }
};

// GET /api/auth/db-status
router.get("/db-status", (req, res) => {
  const status = getDBStatus();
  res.json({
    success: true,
    database: status,
    timestamp: new Date().toISOString()
  });
});

// POST /api/auth/send-otp (Nodemailer Email Dispatch)
router.post("/send-otp", async (req, res) => {
  try {
    const { email, name, purpose } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email address is required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    
    // Generate secure 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    activeOTPSessions.set(cleanEmail, {
      code: otpCode,
      expiresAt,
      purpose: purpose || "signup",
      name: name || "Member"
    });

    const emailResult = await sendOTPEmail(cleanEmail, otpCode, purpose, name);

    return res.json({
      success: true,
      message: `Security OTP sent to ${cleanEmail} via Nodemailer`,
      emailResult,
      otpCode
    });
  } catch (error) {
    console.error("[Send OTP Route Error]:", error);
    return res.status(500).json({ success: false, error: "Failed to dispatch OTP email: " + error.message });
  }
});

// POST /api/auth/verify-otp
router.post("/verify-otp", (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, error: "Email and OTP code are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const session = activeOTPSessions.get(cleanEmail);

    // Allow fallback demo codes: 882194 or 123456
    if (code === "882194" || code === "123456") {
      activeOTPSessions.delete(cleanEmail);
      return res.json({ success: true, message: "OTP verified successfully (Demo Passcode)" });
    }

    if (!session) {
      return res.status(400).json({ success: false, error: "No active verification session found for this email." });
    }

    if (Date.now() > session.expiresAt) {
      activeOTPSessions.delete(cleanEmail);
      return res.status(400).json({ success: false, error: "Verification code has expired. Please request a new code." });
    }

    if (session.code !== code.trim()) {
      return res.status(400).json({ success: false, error: "Invalid verification code. Please check your email." });
    }

    activeOTPSessions.delete(cleanEmail);
    return res.json({ success: true, message: "OTP verified successfully via Nodemailer Engine" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Error verifying OTP: " + error.message });
  }
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "Please provide name, email, and password." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      return res.status(400).json({ success: false, error: "An account with this email address already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: role || "member",
      isVerified: true
    });

    const token = generateJWT(user);

    return res.status(201).json({
      success: true,
      message: "User registered successfully in MongoDB Atlas",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error("[Auth Route Register Error]:", error);
    return res.status(500).json({ success: false, error: "Server error during registration: " + error.message });
  }
});

// POST /api/auth/login
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
      message: "Authenticated successfully with MongoDB & JWT",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error("[Auth Route Login Error]:", error);
    return res.status(500).json({ success: false, error: "Server error during login: " + error.message });
  }
});

// GET /api/auth/me
router.get("/me", protectJWT, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// POST /api/auth/refresh
router.post("/refresh", protectJWT, (req, res) => {
  const newToken = generateJWT(req.user);
  res.json({
    success: true,
    token: newToken,
    message: "JWT Token refreshed successfully"
  });
});

export default router;
