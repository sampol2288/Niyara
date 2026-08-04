import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET all products created by admin
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE or UPDATE product SKU by admin
router.post("/", async (req, res) => {
  try {
    const { id, title, category, sku, price, stock, status, image, images, colors, sizes, description, materials, shippingInfo } = req.body;
    if (!title || price === undefined || stock === undefined) {
      return res.status(400).json({ success: false, error: "Title, price, and stock are required" });
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

// UPDATE product by admin
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });
    return res.json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE product by admin
router.delete("/:id", async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.params.id });
    return res.json({ success: true, message: "Product SKU deleted from database" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
