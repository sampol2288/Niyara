import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    code: { type: String, required: true, uppercase: true },
    type: { type: String, default: "Percentage" },
    value: { type: Number, required: true },
    usage: { type: String, default: "0 / 100" },
    status: { type: String, default: "ACTIVE" },
    expires: { type: String, default: "Dec 31, 2026" }
  },
  { timestamps: true }
);

const Discount = mongoose.model("Discount", discountSchema);
export default Discount;
