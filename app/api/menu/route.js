import { NextResponse } from "next/server";
import { connectToDatabase, isMongoConfigured } from "@/lib/db/mongodb";
import { MenuItemModel, CategoryModel } from "@/lib/db/models";
import { INITIAL_MENU_ITEMS, INITIAL_CATEGORIES } from "@/lib/admin/seedData";
import { getMenuCache, setMenuCache, invalidateMenuCache } from "@/lib/cache/menuCache";

export const dynamic = "force-dynamic";

export { invalidateMenuCache };

function sanitizePublicItem(item) {
  if (!item) return null;
  // Ensure sensitive wholesale pricing/cost margins are never exposed publicly
  const { costPrice, _id, __v, ...rest } = item;
  return { ...rest, id: rest.id || _id?.toString() };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const outlet = searchParams.get("outlet");

    const isDefaultRequest = (!category || category === "All") && (!outlet || outlet === "ALL");

    // 1. Fast in-memory hit for standard catalog (0ms database overhead for 5,000+ users)
    if (isDefaultRequest) {
      const cached = getMenuCache();
      if (cached) {
        return NextResponse.json(cached, {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
            "X-Cache": "HIT",
          },
        });
      }
    }

    let categories = [];
    let items = [];

    if (isMongoConfigured()) {
      try {
        await connectToDatabase();

        const query = { isAvailable: true };
        if (category && category !== "All") {
          query.category = category;
        }
        if (outlet && outlet !== "ALL") {
          query.$or = [{ outlet }, { outlet: "ALL" }];
        }

        // Parallel indexed queries utilizing compound indexes
        const [catDocs, itemDocs] = await Promise.all([
          CategoryModel.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
          MenuItemModel.find(query).select("-costPrice -__v").lean(),
        ]);

        categories = catDocs.map((c) => ({ id: c.id, name: c.name }));
        items = itemDocs.map(sanitizePublicItem);
      } catch (dbErr) {
        console.warn("[API: /api/menu] Database fetch fallback:", dbErr.message);
      }
    }

    // Fallback to initial seeds if MongoDB is unconfigured or empty
    if (items.length === 0 && categories.length === 0) {
      let seedItems = INITIAL_MENU_ITEMS.filter((item) => item.isAvailable).map(sanitizePublicItem);
      if (category && category !== "All") {
        seedItems = seedItems.filter((item) => item.category === category);
      }
      if (outlet && outlet !== "ALL") {
        seedItems = seedItems.filter((item) => item.outlet === outlet || item.outlet === "ALL");
      }
      items = seedItems;
      categories = INITIAL_CATEGORIES;
    }

    const payload = {
      success: true,
      categories,
      items,
    };

    // Store in-memory cache for default catalog hits
    if (isDefaultRequest && items.length > 0) {
      setMenuCache(payload, 60000); // 60s in-memory TTL
    }

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "X-Cache": "MISS",
      },
    });
  } catch (err) {
    console.error("[API: /api/menu] GET error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load public menu" },
      { status: 500 }
    );
  }
}
