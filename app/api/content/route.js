import { NextResponse } from "next/server";
import { connectToDatabase, isMongoConfigured } from "@/lib/db/mongodb";
import { SystemDocModel } from "@/lib/db/models";
import { INITIAL_CMS_CONTENT } from "@/lib/admin/seedData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let cmsContent = INITIAL_CMS_CONTENT;

    if (isMongoConfigured()) {
      try {
        await connectToDatabase();
        const doc = await SystemDocModel.findOne({ key: "cmsContent" }).lean();
        if (doc?.value) {
          cmsContent = doc.value;
        }
      } catch (dbErr) {
        console.warn("[API: /api/content] Database fetch fallback:", dbErr.message);
      }
    }

    return NextResponse.json(
      {
        success: true,
        cmsContent,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
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
