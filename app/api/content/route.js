import { NextResponse } from "next/server";
import { getAdminData } from "@/lib/admin/serverStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data } = await getAdminData();
    return NextResponse.json(
      {
        success: true,
        cmsContent: data.cmsContent,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
        },
      }
    );
  } catch (err) {
    console.error("[API: /api/content] GET error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}
