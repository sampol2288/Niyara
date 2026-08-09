import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { protectJWT } from "./auth.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

// GET all users — Admin only
router.get("/", protectJWT, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE user account — Admin only
router.post("/", protectJWT, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: "Name and email are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ success: false, error: "User with this email already exists." });
    }

    // Always hash passwords — never store plain text
    const rawPassword = password || "Niyara@2026";
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: role || "member",
      phone: phone || "",
      isVerified: true
    });

    return res.status(201).json({ success: true, user: user.toJSON() });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE user role — Admin only
router.patch("/:id/role", protectJWT, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ success: false, error: "Role parameter is required." });
    }

    const validRoles = ["member", "admin", "vip"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, error: `Invalid role. Must be one of: ${validRoles.join(", ")}` });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, error: "User not found." });

    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE user account — Admin only
router.delete("/:id", protectJWT, adminOnly, async (req, res) => {
  try {
    // Prevent self-deletion
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, error: "You cannot delete your own account." });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: "User not found." });

    return res.json({ success: true, message: "User account deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
