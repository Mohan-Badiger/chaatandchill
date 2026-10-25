import mongoose from "mongoose";
import dns from "node:dns";

// Configure reliable DNS resolvers to fix Windows/local ISP SRV query refusal (ECONNREFUSED)
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (e) {
  // Gracefully fallback if custom DNS servers cannot be set
}

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global cache across hot-reloads and serverless invocations.
 * Prevents multiple connections to MongoDB in development and serverless lambdas.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongooseInstance) => {
        console.log("[MongoDB] Connected successfully to persistent database cluster.");
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        console.error("[MongoDB] Connection failure:", err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export function isMongoConfigured() {
  return Boolean(process.env.MONGODB_URI);
}
