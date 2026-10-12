import { NextResponse } from "next/server";
import { getAdminData } from "@/lib/admin/serverStore";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { data } = await getAdminData();
    const { searchParams } = new URL(request.url);

    let items = (data.menuItems || []).filter((item) => item.isAvailable);

    const category = searchParams.get("category");
    if (category && category !== "All") {
      items = items.filter((item) => item.category === category);
    }

    const outlet = searchParams.get("outlet");
    if (outlet && outlet !== "ALL") {
      items = items.filter((item) => item.outlet === outlet || item.outlet === "ALL");
    }

    return NextResponse.json({
      success: true,
      categories: data.categories || [],
      items,
    });
  } catch (err) {
    console.error("[API: /api/menu] GET error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load public menu" },
      { status: 500 }
    );
  }
}
