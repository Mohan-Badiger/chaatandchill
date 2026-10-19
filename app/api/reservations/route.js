import { NextResponse } from "next/server";
import { createReservationServer, getAdminData } from "@/lib/admin/serverStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data } = await getAdminData();
    return NextResponse.json({
      success: true,
      reservations: data.reservations || [],
    });
  } catch (err) {
    console.error("[API: /api/reservations] GET error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone || !body.time) {
      return NextResponse.json(
        { success: false, error: "Missing required booking details (name, phone, time)" },
        { status: 400 }
      );
    }

    const result = await createReservationServer(body);

    return NextResponse.json({
      success: true,
      message: "Reservation successfully recorded",
      bookingCode: body.bookingCode,
      data: result.data.reservations?.[0],
    });
  } catch (err) {
    console.error("[API: /api/reservations] POST error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to process reservation" },
      { status: 500 }
    );
  }
}
