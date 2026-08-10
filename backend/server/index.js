import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import fs from "fs";
import { connectDB, getDBStatus } from "./config/db.js";
import authRoutes, { ensureDefaultAdminAccount } from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import reviewRoutes from "./routes/reviews.js";
import discountRoutes from "./routes/discounts.js";
import userRoutes from "./routes/users.js";
import categoryRoutes from "./routes/categories.js";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load backend/.env relative to index.js file location
const backendEnvPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath });
} else {
  const envCandidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "backend/.env"),
    path.resolve(process.cwd(), "../.env")
  ];
  const envPath = envCandidates.find((p) => fs.existsSync(p));
  if (envPath) {
    dotenv.config({ path: envPath });
  } else {
    dotenv.config();
  }
}

// Validate required environment variables
const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET"];
const missingVars = REQUIRED_ENV.filter((v) => !process.env[v]);
if (missingVars.length > 0) {
  console.error(`[FATAL] Missing required environment variables: ${missingVars.join(", ")}`);
  console.error("[FATAL] Please set these in your .env file. See .env.example for reference.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ─── Proxy Configuration (Crucial for Render rate limiting) ─────────────
app.set("trust proxy", 1);

// ─── Security Headers ────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP to allow the root HTML status page
}));

// ─── CORS Configuration ───────────────────────────────────────────────────────
const parseOrigins = (val) => {
  if (!val) return [];
  return val.split(",").map((s) => s.trim().replace(/\/$/, "")).filter(Boolean);
};

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  ...parseOrigins(process.env.FRONTEND_URL),
  ...parseOrigins(process.env.ADMIN_URL),
  ...parseOrigins(process.env.CORS_ORIGIN)
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, "");
    if (ALLOWED_ORIGINS.includes(cleanOrigin)) return callback(null, true);
    if (cleanOrigin.endsWith(".vercel.app") || cleanOrigin.endsWith(".onrender.com")) return callback(null, true);
    if (NODE_ENV === "development") return callback(null, true);
    callback(new Error(`CORS: Origin '${origin}' is not allowed.`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests. Please try again later." }
});

// Strict limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many authentication attempts. Please wait 15 minutes." }
});

app.use(globalLimiter);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

// ─── Health Endpoint ──────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "NIYARA Full Fashion E-Commerce Backend API",
    mongodb: getDBStatus().state,
    environment: NODE_ENV,
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

// ─── Root Landing Page ────────────────────────────────────────────────────────
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
        .endpoint-item a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>NIYARA</h1>
        <p class="subtitle">Archival Fashion API Concierge</p>
        <div class="badge">● ONLINE &amp; OPERATIONAL</div>
        <p style="color: #a1a1aa; font-size: 0.9rem;">
          MongoDB Atlas: <strong style="color: ${dbStatus.isOnline ? '#10b981' : '#c5a072'};">${dbStatus.state}</strong>
        </p>
        <div class="grid">
          <div class="endpoint-item"><a href="/api/health" target="_blank">GET /api/health</a></div>
          <div class="endpoint-item"><a href="/api/categories" target="_blank">GET /api/categories</a></div>
          <div class="endpoint-item"><a href="/api/products" target="_blank">GET /api/products</a></div>
          <div class="endpoint-item"><a href="/api/reviews" target="_blank">GET /api/reviews</a></div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[Unhandled Error]:", err.message);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: NODE_ENV === "production" ? "An internal server error occurred." : err.message
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
  console.log(`[NIYARA] Starting Backend Server (${NODE_ENV} mode)...`);
  const dbResult = await connectDB();
  if (dbResult && dbResult.status.startsWith("Connected")) {
    await ensureDefaultAdminAccount();
  }
  const server = app.listen(PORT, () => {
    console.log(`[Express] Running on http://localhost:${PORT}`);
    console.log(`[MongoDB] ${dbResult.status} ${dbResult.host ? `(${dbResult.host})` : ""}`);
    console.log(`[CORS]    Allowed origins: ${ALLOWED_ORIGINS.join(", ")}`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n[NIYARA] Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log("[NIYARA] HTTP server closed.");
      process.exit(0);
    });
    setTimeout(() => {
      console.error("[NIYARA] Forced shutdown after timeout.");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

startServer();
