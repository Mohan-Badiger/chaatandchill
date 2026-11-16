import { NextResponse } from "next/server";
import { createReservationServer, getAdminData } from "@/lib/admin/serverStore";
import { getAuthenticatedAdmin } from "@/lib/auth/adminAuth";
import { connectToDatabase, isMongoConfigured } from "@/lib/db/mongodb";
import { ReservationModel } from "@/lib/db/models";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

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
      const ip = getClientIp(request);
      // Rate limit query lookups to prevent brute force code guessing: 10 queries per minute per IP
      const limitCheck = rateLimit(`res-lookup:${ip}`, 10, 60 * 1000);
      if (!limitCheck.success) {
        return NextResponse.json(
          { success: false, error: "Too many lookup attempts. Please wait a moment." },
          { status: 429 }
        );
      }

      const cleanCode = bookingCode.trim().toUpperCase();
      const cleanPhone = phone.replace(/\D/g, "").slice(-10);

      let match = null;

      if (isMongoConfigured()) {
        try {
          await connectToDatabase();
          const doc = await ReservationModel.findOne({ bookingCode: cleanCode }).lean();
          if (doc && doc.phone?.replace(/\D/g, "").slice(-10) === cleanPhone) {
            match = doc;
          }
        } catch (dbErr) {
          console.warn("[Reservation Lookup] DB query error:", dbErr.message);
        }
      }

      if (!match) {
        // Fallback to in-memory/disk store if MongoDB wasn't connected
        const { data } = await getAdminData();
        match = (data.reservations || []).find(
          (r) =>
            r.bookingCode?.toUpperCase() === cleanCode &&
            r.phone?.replace(/\D/g, "").slice(-10) === cleanPhone
        );
      }

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
    const ip = getClientIp(request);
    // Rate limit: 5 reservations per 10 minutes per IP
    const limitCheck = rateLimit(`res-create:${ip}`, 5, 10 * 60 * 1000);
    if (!limitCheck.success) {
      return NextResponse.json(
        { success: false, error: "Too many reservation attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": "600" } }
      );
    }

    const body = await request.json();

    if (!body.name || !body.phone || !body.time) {
      return NextResponse.json(
        { success: false, error: "Missing required booking details (name, phone, time)" },
        { status: 400 }
      );
    }

    // Input sanitization
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
