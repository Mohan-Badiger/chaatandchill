import { NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  createAdminSessionToken,
  getSessionCookieOptions,
} from "@/lib/auth/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
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
