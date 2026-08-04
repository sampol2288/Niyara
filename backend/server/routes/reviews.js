import express from "express";
import Review from "../models/Review.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { author, email, product, rating, comment } = req.body;
    if (!author || !product || !comment) {
      return res.status(400).json({ success: false, error: "Author, product, and comment are required" });
    }

    const review = await Review.create({
      id: `REV-${Math.floor(100 + Math.random() * 900)}`,
      author,
      email: email || "",
      product,
      rating: parseInt(rating) || 5,
      comment,
      status: "APPROVED"
    });

    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const review = await Review.findOneAndUpdate({ id: req.params.id }, { status }, { new: true });
    if (!review) return res.status(404).json({ success: false, error: "Review not found" });

    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Review.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
