import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    code: { type: String, required: true, uppercase: true, unique: true },
    type: { type: String, default: "Percentage" },
    value: { type: String, required: true },
    usage: { type: String, default: "0 / 100" },
    status: { type: String, default: "ACTIVE" },
    expires: { type: String, default: "No Expiry" }
  },
  { timestamps: true }
);

export default mongoose.model("Discount", discountSchema);
