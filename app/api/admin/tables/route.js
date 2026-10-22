import { NextResponse } from "next/server";
import { getAdminData, updateTableStatus } from "@/lib/admin/serverStore";
import { getAuthenticatedAdmin } from "@/lib/auth/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: Administrator session required." },
        { status: 401 }
      );
    }

    const { data } = await getAdminData();
    return NextResponse.json({
      success: true,
      tables: data.tables || [],
    });
  } catch (err) {
    console.error("[API: /api/admin/tables] GET error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve tables" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: Administrator session required." },
        { status: 401 }
      );
    }

    const { tableId, status, payload } = await request.json();
    if (!tableId || !status) {
      return NextResponse.json(
        { success: false, error: "tableId and status are required" },
        { status: 400 }
      );
    }

    const result = await updateTableStatus(tableId, status, payload || {});
    return NextResponse.json({
      success: true,
      version: result.version,
      message: `Table ${tableId} updated to ${status}`,
    });
  } catch (err) {
    console.error("[API: /api/admin/tables] PATCH error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update table" },
      { status: 500 }
    );
  }
}
