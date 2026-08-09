import mongoose from "mongoose";
import dns from "dns";

/**
 * Connect to MongoDB Atlas using the MONGO_URI environment variable.
 * Includes DNS fallback (8.8.8.8 / 1.1.1.1) to resolve Windows querySrv ECONNREFUSED errors.
 */
export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error("MONGO_URI environment variable is not defined.");
  }

  // Prefer IPv4 resolution order
  if (typeof dns.setDefaultResultOrder === "function") {
    try {
      dns.setDefaultResultOrder("ipv4first");
    } catch (e) {}
  }

  const attemptConnection = async (targetURI, overrideDNS = false) => {
    if (overrideDNS) {
      try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
      } catch (e) {}
    }
    return await mongoose.connect(targetURI, {
      serverSelectionTimeoutMS: 8000,
      family: 4
    });
  };

  try {
    const conn = await attemptConnection(mongoURI, false);
    console.log(`[MongoDB] Connected to host: ${conn.connection.host}`);
    return { status: "Connected", host: conn.connection.host };
  } catch (firstError) {
    if (firstError.message.includes("querySrv") || firstError.message.includes("ECONNREFUSED")) {
      console.warn(`[MongoDB] Primary DNS attempt failed (${firstError.message}). Retrying with Google Public DNS (8.8.8.8)...`);
      try {
        const conn = await attemptConnection(mongoURI, true);
        console.log(`[MongoDB] Connected via DNS fallback to host: ${conn.connection.host}`);
        return { status: "Connected", host: conn.connection.host };
      } catch (dnsErr) {
        console.warn(`[MongoDB] Atlas Connection Error: ${dnsErr.message}`);
      }
    } else {
      console.warn(`[MongoDB] Connection attempt failed: ${firstError.message}`);
    }

    // Try local MongoDB instance as fallback if Atlas auth or network fails
    try {
      console.log("[MongoDB] Attempting fallback to local MongoDB instance (mongodb://127.0.0.1:27017/niyara)...");
      const localConn = await mongoose.connect("mongodb://127.0.0.1:27017/niyara", {
        serverSelectionTimeoutMS: 3000
      });
      console.log(`[MongoDB] Connected to local MongoDB host: ${localConn.connection.host}`);
      return { status: "Connected (Local Fallback)", host: localConn.connection.host };
    } catch (localErr) {
      console.warn("[MongoDB] Local MongoDB fallback not active.");
      console.warn("[MongoDB Diagnostic] MongoDB Atlas returned 'bad auth'. Atlas Service Account keys (mdb_sa_sk_...) are API management keys. Please create a standard Database User in Atlas under Security -> Database Access and use its username & password in backend/.env.");
      return { status: "Disconnected", error: firstError.message };
    }
  }
};

export const getDBStatus = () => {
  const states = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting"
  };
  const readyState = mongoose.connection.readyState;
  const isOnline = readyState === 1;

  return {
    state: states[readyState] || "Unknown",
    host: mongoose.connection.host || null,
    isOnline
  };
};
