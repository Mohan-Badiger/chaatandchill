export const SESSION_COOKIE_NAME = "chaat_admin_session";

// Fallback secret for local development; in production, use a strong 32+ char key
const DEFAULT_SECRET = "chaat-and-chill-super-secret-jwt-key-2026-production-ready";

function uint8ArrayToBase64Url(uint8Array) {
  let binary = "";
  for (let i = 0; i < uint8Array.byteLength; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlToUint8Array(base64Url) {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getCryptoKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// Server-side admin credentials configured via environment variables
export function getAdminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || "admin@cafe.com").toLowerCase().trim(),
    password: process.env.ADMIN_PASSWORD || "admin@123",
    pin: process.env.ADMIN_PIN || "1234",
    name: process.env.ADMIN_NAME || "Mohan",
  };
}

/**
 * Verify administrator credentials on the server
 */
export function verifyAdminCredentials(email, password) {
  const creds = getAdminCredentials();
  const inputEmail = (email || "").toLowerCase().trim();
  const inputPassword = password || "";

  if (
    inputEmail === creds.email &&
    (inputPassword === creds.password || inputPassword === creds.pin)
  ) {
    return {
      id: "admin-master",
      name: creds.name,
      email: creds.email,
      role: "ADMIN",
      outlet: "ALL",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      phone: "+91 98800 11001",
      department: "Owner & Administration",
    };
  }

  return null;
}

/**
 * Sign a secure JWT session token using native Web Crypto API (HMAC-SHA256)
 */
export async function createAdminSessionToken(user) {
  const secret = process.env.JWT_SECRET || DEFAULT_SECRET;
  const key = await getCryptoKey(secret);

  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    outlet: user.outlet,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
  };

  const encodedHeader = uint8ArrayToBase64Url(new TextEncoder().encode(JSON.stringify(header)));
  const encodedPayload = uint8ArrayToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const data = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`);

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);
  const signature = uint8ArrayToBase64Url(new Uint8Array(signatureBuffer));

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verify a JWT session token and return the payload if valid and unexpired
 */
export async function verifyAdminSessionToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const [encodedHeader, encodedPayload, signature] = parts;
    const secret = process.env.JWT_SECRET || DEFAULT_SECRET;
    const key = await getCryptoKey(secret);

    const data = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`);
    const signatureBytes = base64UrlToUint8Array(signature);

    const isValid = await crypto.subtle.verify("HMAC", key, signatureBytes, data);
    if (!isValid) return null;

    const payloadJson = new TextDecoder().decode(base64UrlToUint8Array(encodedPayload));
    const payload = JSON.parse(payloadJson);

    // Check expiration timestamp
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extract and verify admin session from a NextRequest or standard Request
 */
export async function getAuthenticatedAdmin(request) {
  if (!request) return null;

  // 1. Check cookies
  let token = null;
  if (typeof request.cookies?.get === "function") {
    token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  } else if (request.headers?.get) {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`));
    if (match) {
      token = match.split("=")[1];
    }
  }

  // 2. Check Authorization header fallback (Bearer <token>)
  if (!token && request.headers?.get) {
    const authHeader = request.headers.get("authorization") || "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return null;

  return await verifyAdminSessionToken(token);
}

/**
 * Cookie options for setting the session cookie
 */
export function getSessionCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  };
}
