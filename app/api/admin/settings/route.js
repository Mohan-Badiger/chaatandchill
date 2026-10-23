import { NextResponse } from "next/server";
import { getAdminData, updateSettingsServer } from "@/lib/admin/serverStore";
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
      settings: data.settings,
    });
  } catch (err) {
    console.error("[API: /api/admin/settings] GET error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve store settings." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: Administrator session required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid settings payload." },
        { status: 400 }
      );
    }

    const updatedData = await updateSettingsServer(body);

    return NextResponse.json({
      success: true,
      settings: updatedData.data.settings,
      message: "Store configuration persisted successfully.",
    });
  } catch (err) {
    console.error("[API: /api/admin/settings] POST error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to persist store settings." },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  return POST(request);
}

export async function PATCH(request) {
  return POST(request);
}
