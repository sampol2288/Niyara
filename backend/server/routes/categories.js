import express from "express";
import Category from "../models/Category.js";
import { protectJWT } from "./auth.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

// GET all categories — Public read access
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE or UPDATE category — Admin only
router.post("/", protectJWT, adminOnly, async (req, res) => {
  try {
    const { id, name, description, image, isFeatured, status } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: "Category name is required." });
    }

    const catId = id || `CAT-${Math.floor(100 + Math.random() * 900)}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const categoryData = {
      id: catId,
      name: name.trim(),
      slug,
      description: description || "",
      image: image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
      isFeatured: Boolean(isFeatured),
      status: status || "ACTIVE"
    };

    const category = await Category.findOneAndUpdate({ id: catId }, categoryData, { upsert: true, new: true });
    return res.json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE category status — Admin only
router.patch("/:id/status", protectJWT, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: "Status is required." });
    }

    const category = await Category.findOneAndUpdate({ id: req.params.id }, { status }, { new: true });
    if (!category) return res.status(404).json({ success: false, error: "Category not found." });
    return res.json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE category — Admin only
router.delete("/:id", protectJWT, adminOnly, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ id: req.params.id });
    if (!category) return res.status(404).json({ success: false, error: "Category not found." });
    return res.json({ success: true, message: "Category deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
