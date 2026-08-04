import express from "express";
import Review from "../models/Review.js";

const router = express.Router();

// GET all customer reviews from database
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.json({ success: true, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE review by customer/admin
router.post("/", async (req, res) => {
  try {
    const { author, email, product, rating, comment } = req.body;
    if (!author || !product || !comment) {
      return res.status(400).json({ success: false, error: "Author, product, and comment are required" });
    }

    const review = await Review.create({
      id: `REV-${Math.floor(100 + Math.random() * 900)}`,
      author: author.trim(),
      email: email || "",
      product: product.trim(),
      rating: parseInt(rating) || 5,
      comment: comment.trim(),
      status: "APPROVED"
    });

    return res.json({ success: true, review });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE review status (APPROVED / REJECTED) by admin
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const review = await Review.findOneAndUpdate({ id: req.params.id }, { status }, { new: true });
    if (!review) return res.status(404).json({ success: false, error: "Review not found" });
    return res.json({ success: true, review });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE review by admin
router.delete("/:id", async (req, res) => {
  try {
    await Review.findOneAndDelete({ id: req.params.id });
    return res.json({ success: true, message: "Review deleted from database" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
