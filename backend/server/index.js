import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { connectDB, getDBStatus } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import reviewRoutes from "./routes/reviews.js";
import discountRoutes from "./routes/discounts.js";
import userRoutes from "./routes/users.js";
import categoryRoutes from "./routes/categories.js";

// Ensure .env is loaded cleanly regardless of cwd
const envPath = fs.existsSync(path.resolve(process.cwd(), ".env"))
  ? path.resolve(process.cwd(), ".env")
  : fs.existsSync(path.resolve(process.cwd(), "backend/.env"))
  ? path.resolve(process.cwd(), "backend/.env")
  : path.resolve(process.cwd(), "../.env");

dotenv.config({ path: envPath });

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

// Root Landing Page HTML Response
app.get("/", (req, res) => {
  const dbStatus = getDBStatus();
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>NIYARA — API Concierge Backend</title>
      <style>
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background-color: #09090b;
          color: #f4f4f5;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 1.5rem;
        }
        .card {
          background: rgba(22, 22, 26, 0.85);
          border: 1px solid #c5a072;
          border-radius: 16px;
          padding: 2.5rem;
          max-width: 540px;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          text-align: center;
        }
        h1 {
          font-family: Georgia, serif;
          letter-spacing: 0.15em;
          color: #c5a072;
          margin-bottom: 0.25rem;
          font-size: 2.25rem;
        }
        p.subtitle {
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          color: #a1a1aa;
          text-transform: uppercase;
          margin-top: 0;
          margin-bottom: 2rem;
        }
        .badge {
          display: inline-block;
          padding: 0.4rem 1rem;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 0.8rem;
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
          margin-bottom: 1.5rem;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          text-align: left;
          margin-top: 1.5rem;
        }
        .endpoint-item {
          background: #121215;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.85rem;
        }
        .endpoint-item a {
          color: #c5a072;
          text-decoration: none;
          font-family: monospace;
          font-weight: bold;
        }
        .endpoint-item a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>NIYARA</h1>
        <p class="subtitle">Archival Fashion API Concierge</p>
        <div class="badge">● ONLINE & OPERATIONAL</div>
        <p style="color: #a1a1aa; font-size: 0.9rem;">
          MongoDB Atlas: <strong style="color: ${dbStatus.isOnline ? '#10b981' : '#c5a072'};">${dbStatus.state}</strong> (${dbStatus.host})
        </p>
        <div class="grid">
          <div class="endpoint-item"><a href="/api/health" target="_blank">GET /api/health</a></div>
          <div class="endpoint-item"><a href="/api/categories" target="_blank">GET /api/categories</a></div>
          <div class="endpoint-item"><a href="/api/products" target="_blank">GET /api/products</a></div>
          <div class="endpoint-item"><a href="/api/orders" target="_blank">GET /api/orders</a></div>
          <div class="endpoint-item"><a href="/api/users" target="_blank">GET /api/users</a></div>
          <div class="endpoint-item"><a href="/api/discounts" target="_blank">GET /api/discounts</a></div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Root Health Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "NIYARA Full Fashion E-Commerce Backend API",
    mongodb: getDBStatus().state,
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
  console.log("Starting NIYARA Backend Server with Gmail & MongoDB Integration...");
  const dbResult = await connectDB();
  app.listen(PORT, () => {
    console.log(`[Express Server] Running on http://localhost:${PORT}`);
    console.log(`[MongoDB Status] ${dbResult.status} (${dbResult.host || "Atlas Cluster"})`);
    console.log(`[Gmail Engine] Ready (Account: ${process.env.SMTP_USER || "polarasmit2504@gmail.com"})`);
  });
};

startServer();
