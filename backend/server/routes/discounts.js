import express from "express";
import Discount from "../models/Discount.js";
import { protectJWT } from "./auth.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

// GET all promo vouchers — Admin only (discount codes are sensitive)
router.get("/", protectJWT, adminOnly, async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    return res.json({ success: true, discounts });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// VALIDATE a promo code by code string — Public (used at checkout)
router.post("/validate", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: "Promo code is required." });
    }
    const discount = await Discount.findOne({ code: code.toUpperCase().trim(), status: "ACTIVE" });
    if (!discount) {
      return res.status(404).json({ success: false, error: "Invalid or expired promo code." });
    }
    return res.json({
      success: true,
      discount: {
        code: discount.code,
        type: discount.type,
        value: discount.value,
        expires: discount.expires
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE promo code — Admin only
router.post("/", protectJWT, adminOnly, async (req, res) => {
  try {
    const { code, type, value, usageCap, expires } = req.body;
    if (!code || !value) {
      return res.status(400).json({ success: false, error: "Code and value are required." });
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

    return res.status(201).json({ success: true, discount });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE promo code — Admin only
router.delete("/:id", protectJWT, adminOnly, async (req, res) => {
  try {
    const discount = await Discount.findOneAndDelete({ id: req.params.id });
    if (!discount) return res.status(404).json({ success: false, error: "Discount code not found." });
    return res.json({ success: true, message: "Discount code deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
