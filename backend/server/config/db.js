import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/niyara";
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}`);
    return { status: "Connected", host: conn.connection.host };
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to Atlas DB (${error.message}). Falling back to local mode.`);
    return { status: "Offline Fallback", error: error.message };
  }
};

export const getDBStatus = () => {
  const states = { 0: "Disconnected", 1: "Connected", 2: "Connecting", 3: "Disconnecting" };
  return {
    state: states[mongoose.connection.readyState] || "Unknown",
    host: mongoose.connection.host || "Atlas Cluster0"
  };
};
