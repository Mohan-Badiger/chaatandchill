import { NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  createAdminSessionToken,
  getSessionCookieOptions,
} from "@/lib/auth/adminAuth";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    // Rate limit: 5 login attempts per 15 minutes per IP
    const limitCheck = rateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000);
    if (!limitCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many failed login attempts. Please wait 15 minutes before trying again.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "900",
          },
        }
      );
    }

    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const adminUser = verifyAdminCredentials(email, password);

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "Invalid email or administrator password" },
        { status: 401 }
      );
    }

    // Generate signed, tamper-proof session JWT
    const token = await createAdminSessionToken(adminUser);
    const cookieOpts = getSessionCookieOptions();

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: adminUser,
    });

    // Set secure HttpOnly cookie
    response.cookies.set(cookieOpts.name, token, cookieOpts);

    return response;
  } catch (err) {
    console.error("[API: /api/admin/login] Login error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error during authentication" },
      { status: 500 }
    );
  }
}
