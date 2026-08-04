import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

const DEFAULT_CATEGORIES = [
  {
    id: "CAT-101",
    name: "Outerwear",
    slug: "outerwear",
    description: "Tailored blazers, luxury wool coats, leather trenches",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop",
    isFeatured: true,
    status: "ACTIVE",
    itemCount: 12
  },
  {
    id: "CAT-102",
    name: "Tops",
    slug: "tops",
    description: "Silk shirts, structured corsets, cashmere knits",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600&auto=format&fit=crop",
    isFeatured: true,
    status: "ACTIVE",
    itemCount: 18
  },
  {
    id: "CAT-103",
    name: "Bottoms",
    slug: "bottoms",
    description: "Wide-leg trousers, pleated skirts, denim jeans",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop",
    isFeatured: false,
    status: "ACTIVE",
    itemCount: 15
  },
  {
    id: "CAT-104",
    name: "Footwear",
    slug: "footwear",
    description: "Archival boots, leather heels, minimalist loafers",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop",
    isFeatured: true,
    status: "ACTIVE",
    itemCount: 9
  },
  {
    id: "CAT-105",
    name: "Accessories",
    slug: "accessories",
    description: "Leather handbags, statement belts, luxury eyewear",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop",
    isFeatured: false,
    status: "ACTIVE",
    itemCount: 22
  }
];

router.get("/", async (req, res) => {
  try {
    let categories = await Category.find().sort({ createdAt: -1 });
    if (categories.length === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES);
      categories = await Category.find().sort({ createdAt: -1 });
    }
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

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
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const category = await Category.findOneAndUpdate({ id: req.params.id }, { status }, { new: true });
    if (!category) return res.status(404).json({ success: false, error: "Category not found" });

    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Category.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
