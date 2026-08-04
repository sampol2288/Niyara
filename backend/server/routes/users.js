import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

// GET all users created/registered in database
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE user account by admin
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: "Name and email are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ success: false, error: "User with this email already exists" });
    }

    const defaultPassword = password || "Niyara@2026";
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: defaultPassword,
      role: role || "member",
      phone: phone || "+1 (555) 000-0000",
      isVerified: true
    });

    return res.json({ success: true, user: user.toJSON() });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE user role by admin
router.patch("/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ success: false, error: "Role parameter is required" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE user account by admin
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "User account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
