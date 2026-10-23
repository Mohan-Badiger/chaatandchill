import { NextResponse } from "next/server";
import { getAdminData, updateCmsContentServer } from "@/lib/admin/serverStore";
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
      cmsContent: data.cmsContent,
    });
  } catch (err) {
    console.error("[API: /api/admin/content] GET error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve CMS content." },
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
        { success: false, error: "Invalid CMS content payload." },
        { status: 400 }
      );
    }

    const updatedData = await updateCmsContentServer(body);

    return NextResponse.json({
      success: true,
      cmsContent: updatedData.data.cmsContent,
      message: "Website content saved and published live.",
    });
  } catch (err) {
    console.error("[API: /api/admin/content] POST error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to persist CMS content." },
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
