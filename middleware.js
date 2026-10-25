import { NextResponse } from "next/server";
import { verifyAdminSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/adminAuth";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Check for session cookie
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await verifyAdminSessionToken(sessionToken);

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";

  // 2. Protect Admin Web Portal (/admin/...)
  if (pathname.startsWith("/admin")) {
    if (isLoginPage) {
      // If already logged in, redirect away from login page to dashboard
      if (user) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // Unauthenticated access to /admin/* redirects to /admin/login
    if (!user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 3. Protect Admin API Routes (/api/admin/...)
  if (pathname.startsWith("/api/admin")) {
    if (isLoginApi) {
      return NextResponse.next();
    }

    // Check cookie or Bearer header
    let token = sessionToken;
    if (!token) {
      const authHeader = request.headers.get("authorization") || "";
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    const apiUser = await verifyAdminSessionToken(token);
    if (!apiUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Valid administrator session or API key is required.",
        },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
