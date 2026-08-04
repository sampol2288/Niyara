import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import reviewRoutes from "./routes/reviews.js";
import discountRoutes from "./routes/discounts.js";
import userRoutes from "./routes/users.js";
import categoryRoutes from "./routes/categories.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

// Root Health Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "NIYARA Full Fashion E-Commerce Backend API",
    mongodb: "Connected (Cluster0)",
    endpoints: [
      "/api/auth",
      "/api/products",
      "/api/orders",
      "/api/reviews",
      "/api/discounts",
      "/api/users",
      "/api/categories"
    ],
    timestamp: new Date().toISOString()
  });
});

// Initialize DB & Start Server
const startServer = async () => {
  console.log("Starting NIYARA Backend Server with MongoDB Integration...");
  const dbResult = await connectDB();
  app.listen(PORT, () => {
    console.log(`[Express Server] Running on http://localhost:${PORT}`);
    console.log(`[MongoDB Status] ${dbResult.status} (${dbResult.host || "Atlas Cluster"})`);
  });
};

startServer();
