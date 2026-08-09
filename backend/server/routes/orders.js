import express from "express";
import Order from "../models/Order.js";
import { protectJWT, optionalJWT } from "./auth.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

// GET all orders — Admin only
router.get("/", protectJWT, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE order — Members & Guests
router.post("/", optionalJWT, async (req, res) => {
  try {
    const { id, customer, email, items, total, paymentStatus, fulfillmentStatus, shippingAddress } = req.body;
    if (!customer || !email || !total) {
      return res.status(400).json({ success: false, error: "Customer details and total are required." });
    }

    const orderId = id || `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = await Order.create({
      id: orderId,
      customer: customer.trim(),
      email: email.trim().toLowerCase(),
      items: items || [],
      total: parseFloat(total),
      paymentStatus: paymentStatus || "PAID",
      fulfillmentStatus: fulfillmentStatus || "UNFULFILLED",
      shippingAddress: shippingAddress || ""
    });

    return res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE order status — Admin only
router.patch("/:id/status", protectJWT, adminOnly, async (req, res) => {
  try {
    const { fulfillmentStatus, paymentStatus, trackingNumber } = req.body;
    const updateData = {};
    if (fulfillmentStatus) updateData.fulfillmentStatus = fulfillmentStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    const order = await Order.findOneAndUpdate({ id: req.params.id }, updateData, { new: true });
    if (!order) return res.status(404).json({ success: false, error: "Order not found." });

    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
