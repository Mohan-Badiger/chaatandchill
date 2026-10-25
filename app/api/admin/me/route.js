import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const admin = await getAuthenticatedAdmin(request);

    if (!admin) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        outlet: admin.outlet || "ALL",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        department: "Owner & Administration",
      },
    });
  } catch (err) {
    console.error("[API: /api/admin/me] Error:", err);
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  }
}
