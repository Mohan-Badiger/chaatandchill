import mongoose from "mongoose";

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
