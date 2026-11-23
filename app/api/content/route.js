import { NextResponse } from "next/server";
import { connectToDatabase, isMongoConfigured } from "@/lib/db/mongodb";
import { SystemDocModel } from "@/lib/db/models";
import { INITIAL_CMS_CONTENT } from "@/lib/admin/seedData";

export const dynamic = "force-dynamic";

// High-speed in-memory cache for CMS text (60s TTL)
let contentMemoryCache = null;
let contentCacheExpiresAt = 0;

export function invalidateContentCache() {
  contentMemoryCache = null;
  contentCacheExpiresAt = 0;
}

export async function GET() {
  try {
    const now = Date.now();
    if (contentMemoryCache && now < contentCacheExpiresAt) {
      return NextResponse.json(contentMemoryCache, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          "X-Cache": "HIT",
        },
      });
    }

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

    const payload = {
      success: true,
      cmsContent,
    };

    contentMemoryCache = payload;
    contentCacheExpiresAt = now + 60 * 1000;

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "X-Cache": "MISS",
      },
    });
  } catch (err) {
    console.error("[API: /api/content] GET error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}
