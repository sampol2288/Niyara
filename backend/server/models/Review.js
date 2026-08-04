import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    email: { type: String, default: "" },
    product: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    status: { type: String, default: "PENDING" }
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
