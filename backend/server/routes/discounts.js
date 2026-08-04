import express from "express";
import Discount from "../models/Discount.js";

const router = express.Router();

// GET /api/discounts - Get all discount promo codes
router.get("/", async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.json({ success: true, discounts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/discounts - Create promo code
router.post("/", async (req, res) => {
  try {
    const { code, type, value, usageCap, expires } = req.body;
    if (!code || !value) {
      return res.status(400).json({ success: false, error: "Code and value are required" });
    }

    const discount = await Discount.create({
      id: `DISC-${Date.now()}`,
      code: code.toUpperCase(),
      type: type || "Percentage",
      value,
      usage: `0 / ${usageCap || 100}`,
      status: "ACTIVE",
      expires: expires || "Dec 31, 2026"
    });

    res.json({ success: true, discount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/discounts/:id - Delete promo code
router.delete("/:id", async (req, res) => {
  try {
    await Discount.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: "Discount code deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
