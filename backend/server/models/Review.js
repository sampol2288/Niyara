import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    email: { type: String, default: "" },
    product: { type: String, required: true },
    rating: { type: Number, default: 5 },
    comment: { type: String, required: true },
    status: { type: String, default: "APPROVED" }
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
