import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    customer: { type: String, required: true },
    email: { type: String, required: true },
    items: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        selectedColor: String,
        selectedSize: String
      }
    ],
    total: { type: Number, required: true },
    paymentStatus: { type: String, default: "PAID" },
    fulfillmentStatus: { type: String, default: "UNFULFILLED" },
    shippingAddress: { type: String, default: "" },
    trackingNumber: { type: String, default: "" }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
