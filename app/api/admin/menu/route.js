import { NextResponse } from "next/server";
import {
  getAdminData,
  addMenuItemServer,
  updateMenuItemServer,
  deleteMenuItemServer,
  toggleMenuItemAvailabilityServer,
} from "@/lib/admin/serverStore";
import { getAuthenticatedAdmin } from "@/lib/auth/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { data } = await getAdminData();
    const { searchParams } = new URL(request.url);

    let items = data.menuItems || [];

    const category = searchParams.get("category");
    if (category && category !== "All") {
      items = items.filter((item) => item.category === category);
    }

    const outlet = searchParams.get("outlet");
    if (outlet && outlet !== "ALL") {
      items = items.filter((item) => item.outlet === outlet || item.outlet === "ALL");
    }

    const availability = searchParams.get("availability");
    if (availability === "in_stock") {
      items = items.filter((item) => item.isAvailable);
    } else if (availability === "sold_out") {
      items = items.filter((item) => !item.isAvailable);
    }

    const search = searchParams.get("search");
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      total: items.length,
      menuItems: items,
    });
  } catch (err) {
    console.error("[API: /api/admin/menu] GET error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve menu items" },
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

    const payload = await request.json();
    if (!payload.title || payload.price === undefined) {
      return NextResponse.json(
        { success: false, error: "Dish title and price are required" },
        { status: 400 }
      );
    }

    const result = await addMenuItemServer(payload);
    const createdItem = result.data.menuItems[0];

    return NextResponse.json({
      success: true,
      version: result.version,
      item: createdItem,
    });
  } catch (err) {
    console.error("[API: /api/admin/menu] POST error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create menu item" },
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

    const body = await request.json();
    const { id, action, ...fields } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Menu item id is required" },
        { status: 400 }
      );
    }

    let result;
    if (action === "toggle") {
      result = await toggleMenuItemAvailabilityServer(id);
    } else {
      result = await updateMenuItemServer(id, fields);
    }

    return NextResponse.json({
      success: true,
      version: result.version,
      message: `Menu item ${id} updated`,
    });
  } catch (err) {
    console.error("[API: /api/admin/menu] PATCH error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update menu item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: Administrator session required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {
        // no body provided
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Menu item id is required" },
        { status: 400 }
      );
    }

    const result = await deleteMenuItemServer(id);

    return NextResponse.json({
      success: true,
      version: result.version,
      message: `Menu item ${id} deleted`,
    });
  } catch (err) {
    console.error("[API: /api/admin/menu] DELETE error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete menu item" },
      { status: 500 }
    );
  }
}
