import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    customer: { type: String, required: true },
    email: { type: String, required: true },
    items: [
      {
        id: String,
        title: String,
        price: Number,
        quantity: Number,
        image: String
      }
    ],
    total: { type: Number, required: true },
    paymentStatus: { type: String, default: "PAID" },
    fulfillmentStatus: { type: String, default: "UNFULFILLED" },
    trackingNumber: { type: String, default: "" },
    shippingAddress: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
