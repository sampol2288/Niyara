import express from "express";
import Product from "../models/Product.js";
import { protectJWT } from "./auth.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

// GET all products — Public read access
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET single product by ID — Public read access
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ success: false, error: "Product not found." });
    return res.json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE or UPDATE product SKU — Admin only
router.post("/", protectJWT, adminOnly, async (req, res) => {
  try {
    const { id, title, category, sku, price, stock, status, image, images, colors, sizes, description, materials, shippingInfo } = req.body;
    if (!title || price === undefined || stock === undefined) {
      return res.status(400).json({ success: false, error: "Title, price, and stock are required." });
    }

    const prodId = id || `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
    const productData = {
      id: prodId,
      title: title.trim(),
      category: category || "Outerwear",
      sku: sku || `NYR-${Math.floor(1000 + Math.random() * 9000)}`,
      price: parseFloat(price),
      stock: parseInt(stock),
      status: status || (parseInt(stock) > 10 ? "In Stock" : parseInt(stock) > 0 ? "Low Stock" : "Out of Stock"),
      image: image || "",
      images: Array.isArray(images) ? images : image ? [image] : [],
      colors: Array.isArray(colors) ? colors : [],
      sizes: Array.isArray(sizes) ? sizes : ["XS", "S", "M", "L", "XL"],
      description: description || "",
      materials: Array.isArray(materials) ? materials : [],
      shippingInfo: shippingInfo || ""
    };

    const product = await Product.findOneAndUpdate({ id: prodId }, productData, { upsert: true, new: true });
    return res.json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE product — Admin only
router.put("/:id", protectJWT, adminOnly, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!product) return res.status(404).json({ success: false, error: "Product not found." });
    return res.json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE product — Admin only
router.delete("/:id", protectJWT, adminOnly, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) return res.status(404).json({ success: false, error: "Product not found." });
    return res.json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
