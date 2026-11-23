import mongoose from "mongoose";
import dns from "node:dns";

// Configure custom DNS resolvers ONLY during local development if needed,
// preventing network resolution failures in serverless / cloud container environments.
if (process.env.NODE_ENV !== "production" && process.platform === "win32") {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
  } catch (e) {
    // Gracefully ignore if custom DNS cannot be set
  }
}

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
      maxPoolSize: 5, // Serverless-optimized: prevents connection pool exhaustion under 5,000+ users
      minPoolSize: 0, // Allows idle connections to close cleanly
      maxIdleTimeMS: 15000, // Closes idle connections after 15 seconds
      socketTimeoutMS: 20000,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongooseInstance) => {
        console.log("[MongoDB] Connected successfully to database cluster.");
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
