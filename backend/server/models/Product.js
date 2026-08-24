import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "Outerwear" },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    status: { type: String, default: "In Stock" },
    image: { type: String, default: "" },
    images: [{ type: String }],
    colors: [{ name: String, hex: String, image: String }],
    sizes: [{ type: String }],
    description: { type: String, default: "" },
    materials: [{ type: String }],
    shippingInfo: { type: String, default: "" }
  },
  { timestamps: true }
);

// Indexes for fast retrieval
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
