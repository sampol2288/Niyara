import express from "express";
import Discount from "../models/Discount.js";

const router = express.Router();

// GET all promo vouchers created by admin
router.get("/", async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    return res.json({ success: true, discounts });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE promo code by admin
router.post("/", async (req, res) => {
  try {
    const { code, type, value, usageCap, expires } = req.body;
    if (!code || !value) {
      return res.status(400).json({ success: false, error: "Code and value are required" });
    }

    const discount = await Discount.create({
      id: `DISC-${Date.now()}`,
      code: code.toUpperCase().trim(),
      type: type || "Percentage",
      value: parseFloat(value),
      usage: `0 / ${usageCap || 100}`,
      status: "ACTIVE",
      expires: expires || "Dec 31, 2026"
    });

    return res.json({ success: true, discount });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE promo code by admin
router.delete("/:id", async (req, res) => {
  try {
    await Discount.findOneAndDelete({ id: req.params.id });
    return res.json({ success: true, message: "Discount code deleted from database" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
