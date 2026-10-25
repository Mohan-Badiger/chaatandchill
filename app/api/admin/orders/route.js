import { NextResponse } from "next/server";
import { getAdminData, createOrder, updateOrderStatus } from "@/lib/admin/serverStore";
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
    const { searchParams } = new URL(request.url);

    let orders = data.orders || [];

    const status = searchParams.get("status");
    if (status && status !== "all") {
      orders = orders.filter((o) => o.status === status);
    }

    const outlet = searchParams.get("outlet");
    if (outlet && outlet !== "ALL") {
      orders = orders.filter((o) => o.outlet === outlet);
    }

    const search = searchParams.get("search");
    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer?.name?.toLowerCase().includes(q) ||
          o.table?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      total: orders.length,
      orders,
    });
  } catch (err) {
    console.error("[API: /api/admin/orders] GET error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve orders" },
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
    if (!payload.items || !payload.total) {
      return NextResponse.json(
        { success: false, error: "Invalid order payload: missing items or total" },
        { status: 400 }
      );
    }

    const result = await createOrder(payload);
    return NextResponse.json({
      success: true,
      version: result.version,
      order: result.data.orders[0],
    });
  } catch (err) {
    console.error("[API: /api/admin/orders] POST error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
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

    const { orderId, status } = await request.json();
    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: "orderId and status are required" },
        { status: 400 }
      );
    }

    const result = await updateOrderStatus(orderId, status);
    return NextResponse.json({
      success: true,
      version: result.version,
      message: `Order ${orderId} updated to ${status}`,
    });
  } catch (err) {
    console.error("[API: /api/admin/orders] PATCH error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
