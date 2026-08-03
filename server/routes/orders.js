import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// GET /api/orders - Fetch all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/orders - Place & persist new customer order
router.post("/", async (req, res) => {
  try {
    const { id, customer, email, items, total, paymentStatus, fulfillmentStatus, shippingAddress } = req.body;
    if (!customer || !email || !total) {
      return res.status(400).json({ success: false, error: "Customer details and total are required" });
    }

    const orderId = id || `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = await Order.create({
      id: orderId,
      customer,
      email,
      items: items || [],
      total: parseFloat(total),
      paymentStatus: paymentStatus || "PAID",
      fulfillmentStatus: fulfillmentStatus || "UNFULFILLED",
      shippingAddress: shippingAddress || ""
    });

    res.json({ success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/orders/:id/status - Update order status (Fulfillment / Payment)
router.patch("/:id/status", async (req, res) => {
  try {
    const { fulfillmentStatus, paymentStatus, trackingNumber } = req.body;
    const updateData = {};
    if (fulfillmentStatus) updateData.fulfillmentStatus = fulfillmentStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    const order = await Order.findOneAndUpdate({ id: req.params.id }, updateData, { new: true });
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
