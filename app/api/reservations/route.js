import { NextResponse } from "next/server";
import { createReservationServer, getAdminData } from "@/lib/admin/serverStore";
import { getAuthenticatedAdmin } from "@/lib/auth/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    const { searchParams } = new URL(request.url);
    const bookingCode = searchParams.get("code") || searchParams.get("bookingCode");
    const phone = searchParams.get("phone");

    // 1. If administrator is logged in, return full reservation list
    if (admin) {
      const { data } = await getAdminData();
      return NextResponse.json({
        success: true,
        reservations: data.reservations || [],
      });
    }

    // 2. If customer is querying their own reservation with verified code and phone
    if (bookingCode && phone) {
      const { data } = await getAdminData();
      const match = (data.reservations || []).find(
        (r) =>
          r.bookingCode?.toUpperCase() === bookingCode.toUpperCase() &&
          r.phone?.replace(/\D/g, "").slice(-10) === phone.replace(/\D/g, "").slice(-10)
      );

      if (match) {
        return NextResponse.json({
          success: true,
          reservation: {
            bookingCode: match.bookingCode,
            name: match.name,
            date: match.date,
            time: match.time,
            guests: match.guests,
            status: match.status,
            outlet: match.outlet,
          },
        });
      }

      return NextResponse.json(
        { success: false, error: "No reservation found matching this booking code and phone number." },
        { status: 404 }
      );
    }

    // 3. Block unauthorized public scraping of customer names and phone numbers
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized: Administrator credentials required to view customer reservation lists.",
      },
      { status: 401 }
    );
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

    // Basic sanitization
    const sanitizedBody = {
      name: String(body.name).slice(0, 80).trim(),
      phone: String(body.phone).slice(0, 20).trim(),
      email: body.email ? String(body.email).slice(0, 100).trim() : "",
      guests: Math.min(Math.max(Number(body.guests) || 2, 1), 20),
      date: body.date,
      time: body.time,
      outlet: body.outlet || "Jamakhandi",
      notes: body.notes ? String(body.notes).slice(0, 200).trim() : "",
    };

    const result = await createReservationServer(sanitizedBody);
    const createdBooking = result.data.reservations?.[0];

    return NextResponse.json({
      success: true,
      message: "Reservation successfully recorded",
      bookingCode: createdBooking?.bookingCode,
      data: createdBooking,
    });
  } catch (err) {
    console.error("[API: /api/reservations] POST error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to process reservation" },
      { status: 500 }
    );
  }
}
