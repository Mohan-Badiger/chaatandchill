import { NextResponse } from "next/server";
import { getAdminData, syncAdminData, resetDatabaseToDefaults } from "@/lib/admin/serverStore";
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

    const { version, lastModified, etag, data } = await getAdminData();

    // Check client ETag for 304 Not Modified cache optimization
    const ifNoneMatch = request.headers.get("if-none-match");
    if (ifNoneMatch && ifNoneMatch === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": "private, no-cache, must-revalidate",
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        version,
        lastModified,
        data,
      },
      {
        headers: {
          ETag: etag,
          "Cache-Control": "private, no-cache, must-revalidate",
        },
      }
    );
  } catch (err) {
    console.error("[API: /api/admin/data] GET error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve admin data" },
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

    if (body.action === "reset") {
      // Security Guard: Prevent accidental data wipe in production
      const isProd = process.env.NODE_ENV === "production";
      const resetSecret = process.env.ADMIN_RESET_SECRET;

      if (isProd) {
        if (!resetSecret || body.resetSecret !== resetSecret) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Factory reset is restricted in production. Set ADMIN_RESET_SECRET and provide resetSecret to proceed.",
            },
            { status: 403 }
          );
        }
      }

      const result = await resetDatabaseToDefaults();
      return NextResponse.json({
        success: true,
        version: result.version,
        lastModified: result.lastModified,
        message: "Database reset to factory seeds",
      });
    }

    const result = await syncAdminData(body);
    return NextResponse.json(
      {
        success: true,
        version: result.version,
        lastModified: result.lastModified,
      },
      {
        headers: {
          ETag: result.etag,
        },
      }
    );
  } catch (err) {
    console.error("[API: /api/admin/data] POST error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to sync admin data" },
      { status: 500 }
    );
  }
}
