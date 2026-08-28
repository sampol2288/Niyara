/**
 * NIYARA Admin Seed Script
 * Run once to create/update the admin account in MongoDB Atlas.
 * Usage: node backend/seed-admin.js
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error("MONGO_URI not set in backend/.env"); process.exit(1); }

const ADMIN_EMAIL    = "admin123@gmail.com";
const ADMIN_PASSWORD = "Niyara123$";
const ADMIN_NAME     = "Admin";

const UserSchema = new mongoose.Schema({
  name:       String,
  email:      { type: String, unique: true },
  password:   String,
  role:       { type: String, default: "member" },
  isVerified: { type: Boolean, default: false },
  phone:      String,
  avatar:     String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB Atlas");

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

  const existing = await User.findOne({ email: ADMIN_EMAIL });

  if (existing) {
    existing.password   = hashedPassword;
    existing.role       = "admin";
    existing.isVerified = true;
    existing.name       = ADMIN_NAME;
    await existing.save();
    console.log("Admin account UPDATED: " + ADMIN_EMAIL);
  } else {
    await User.create({
      name:       ADMIN_NAME,
      email:      ADMIN_EMAIL,
      password:   hashedPassword,
      role:       "admin",
      isVerified: true
    });
    console.log("Admin account CREATED: " + ADMIN_EMAIL);
  }

  console.log("Login credentials:");
  console.log("  Email   : " + ADMIN_EMAIL);
  console.log("  Password: " + ADMIN_PASSWORD);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
