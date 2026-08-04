import express from "express";
import Review from "../models/Review.js";

const router = express.Router();

const DEFAULT_REVIEWS = [
  {
    id: "REV-101",
    author: "Sophie Laurent",
    product: "Archival Wool Trench Coat",
    rating: 5,
    comment: "Exceptional tailoring and silhouette. Impeccable weight and finish.",
    status: "APPROVED"
  }
];

router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).maxTimeMS(5000);
    return res.json({ success: true, reviews });
  } catch (error) {
    return res.json({ success: true, reviews: DEFAULT_REVIEWS, mode: "Standby Fallback" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { author, email, product, rating, comment } = req.body;
    if (!author || !product || !comment) {
      return res.status(400).json({ success: false, error: "Author, product, and comment are required" });
    }

    const reviewData = {
      id: `REV-${Math.floor(100 + Math.random() * 900)}`,
      author,
      email: email || "",
      product,
      rating: parseInt(rating) || 5,
      comment,
      status: "APPROVED"
    };

    let review;
    try {
      review = await Review.create(reviewData);
    } catch (dbErr) {
      review = reviewData;
    }

    return res.json({ success: true, review });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    let review;
    try {
      review = await Review.findOneAndUpdate({ id: req.params.id }, { status }, { new: true });
    } catch (dbErr) {
      review = { id: req.params.id, status };
    }
    return res.json({ success: true, review });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    try {
      await Review.findOneAndDelete({ id: req.params.id });
    } catch (dbErr) {
      console.warn("DB offline during review deletion");
    }
    return res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
