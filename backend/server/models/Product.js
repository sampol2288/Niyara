import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, default: "Outerwear" },
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    status: { type: String, default: "In Stock" },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    colors: [
      {
        name: { type: String, default: "Standard" },
        hex: { type: String, default: "#1a1a1a" },
        image: { type: String, default: "" }
      }
    ],
    sizes: { type: [String], default: ["XS", "S", "M", "L", "XL"] },
    description: { type: String, default: "" },
    materials: { type: [String], default: [] },
    shippingInfo: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
