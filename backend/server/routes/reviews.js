import express from "express";
import Review from "../models/Review.js";
import { protectJWT } from "./auth.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

// GET all approved reviews — Public read access
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({ status: "APPROVED" }).sort({ createdAt: -1 });
    return res.json({ success: true, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET all reviews (including pending) — Admin only
router.get("/all", protectJWT, adminOnly, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.json({ success: true, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE review — Authenticated users only
router.post("/", protectJWT, async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    if (!product || !comment) {
      return res.status(400).json({ success: false, error: "Product and comment are required." });
    }

    const review = await Review.create({
      id: `REV-${Math.floor(100 + Math.random() * 900)}`,
      author: req.user.name,
      email: req.user.email,
      product: product.trim(),
      rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
      comment: comment.trim(),
      status: "APPROVED" // Auto-approve; change to "PENDING" to enable moderation
    });

    return res.status(201).json({ success: true, review });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE review status — Admin only
router.patch("/:id/status", protectJWT, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["APPROVED", "REJECTED", "PENDING"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: `Status must be one of: ${validStatuses.join(", ")}` });
    }

    const review = await Review.findOneAndUpdate({ id: req.params.id }, { status }, { new: true });
    if (!review) return res.status(404).json({ success: false, error: "Review not found." });
    return res.json({ success: true, review });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE review — Admin only
router.delete("/:id", protectJWT, adminOnly, async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ id: req.params.id });
    if (!review) return res.status(404).json({ success: false, error: "Review not found." });
    return res.json({ success: true, message: "Review deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
