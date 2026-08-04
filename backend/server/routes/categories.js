import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// GET all categories created by admin
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE or UPDATE category by admin
router.post("/", async (req, res) => {
  try {
    const { id, name, description, image, isFeatured, status } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: "Category name is required" });
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

// UPDATE category status (ACTIVE / INACTIVE) by admin
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const category = await Category.findOneAndUpdate({ id: req.params.id }, { status }, { new: true });
    if (!category) return res.status(404).json({ success: false, error: "Category not found" });
    return res.json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE category by admin
router.delete("/:id", async (req, res) => {
  try {
    await Category.findOneAndDelete({ id: req.params.id });
    return res.json({ success: true, message: "Category deleted from database" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
