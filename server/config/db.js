import mongoose from "mongoose";
import dns from "dns";

// Fix Node.js SRV record resolution issues on Windows by using reliable DNS resolvers
try {
  dns.setDefaultResultOrder?.("ipv4first");
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (e) {
  // Ignore DNS configuration errors if unsupported
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://polarasmit:BKpniiIOBPArNOXv@cluster0.dgk9yb6.mongodb.net/?appName=Cluster0";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: "fashion_niyara",
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000
    });
    console.log(`[MongoDB Atlas] Connected successfully to host: ${conn.connection.host}`);
    return { success: true, host: conn.connection.host, status: "Connected" };
  } catch (error) {
    console.error(`[MongoDB Atlas] Connection Error: ${error.message}`);
    return { success: false, error: error.message, status: "Disconnected" };
  }
};

export const getDBStatus = () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting"
  };
  return {
    stateCode: state,
    status: states[state] || "Unknown",
    host: mongoose.connection.host || "cluster0.dgk9yb6.mongodb.net",
    dbName: mongoose.connection.name || "fashion_niyara"
  };
};
