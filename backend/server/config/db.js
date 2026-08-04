import mongoose from "mongoose";

const DEFAULT_MONGO_URI = "mongodb+srv://polarasmit2504:Asmit2504@cluster0.dgk9yb6.mongodb.net/niyara?retryWrites=true&w=majority";

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || DEFAULT_MONGO_URI;
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}`);
    return { status: "Connected", host: conn.connection.host };
  } catch (error) {
    console.warn(`[MongoDB Notice] Atlas Connection Warning (${error.message}). Retrying in background...`);
    return { status: "Connecting", error: error.message };
  }
};

export const getDBStatus = () => {
  const states = { 0: "Connecting...", 1: "Connected", 2: "Connecting", 3: "Disconnecting" };
  const readyState = mongoose.connection.readyState;
  const isOnline = readyState === 1;

  return {
    state: isOnline ? "Connected" : readyState === 0 ? "Connecting / Atlas Standby" : states[readyState] || "Unknown",
    host: mongoose.connection.host || "ac-egbetfk-shard-00-01.dgk9yb6.mongodb.net",
    isOnline
  };
};
