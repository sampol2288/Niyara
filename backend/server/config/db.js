import mongoose from "mongoose";

const DEFAULT_MONGO_URI = "mongodb+srv://polarasmit2504:Asmit2504@cluster0.mongodb.net/niyara?retryWrites=true&w=majority";

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || DEFAULT_MONGO_URI;
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}`);
    return { status: "Connected", host: conn.connection.host };
  } catch (error) {
    console.warn(`[MongoDB Warning] Atlas connection error (${error.message}).`);
    return { status: "Connection Error", error: error.message };
  }
};

export const getDBStatus = () => {
  const states = { 0: "Disconnected", 1: "Connected", 2: "Connecting", 3: "Disconnecting" };
  return {
    state: states[mongoose.connection.readyState] || "Unknown",
    host: mongoose.connection.host || "Atlas Cluster0"
  };
};
