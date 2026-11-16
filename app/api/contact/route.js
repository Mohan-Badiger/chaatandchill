import { NextResponse } from "next/server";
import { createCustomerReviewOrInquiry } from "@/lib/admin/serverStore";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    // Rate limit: 5 contact messages per 10 minutes per IP
    const limitCheck = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
    if (!limitCheck.success) {
      return NextResponse.json(
        { success: false, error: "Too many submissions. Please wait a few minutes before trying again." },
        { status: 429, headers: { "Retry-After": "600" } }
      );
    }

    const body = await request.json();

    if (!body.name || !body.message) {
      return NextResponse.json(
        { success: false, error: "Name and message are required" },
        { status: 400 }
      );
    }

    // Input sanitization
    const sanitized = {
      name: String(body.name).slice(0, 80).trim(),
      email: body.email ? String(body.email).slice(0, 100).trim() : "",
      phone: body.phone ? String(body.phone).slice(0, 20).trim() : "",
      inquiryType: body.inquiryType ? String(body.inquiryType).slice(0, 100).trim() : "Website Feedback",
      message: String(body.message).slice(0, 1000).trim(),
      outlet: body.outlet ? String(body.outlet).slice(0, 50).trim() : "Jamakhandi",
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
    };

    await createCustomerReviewOrInquiry(sanitized);

    return NextResponse.json({
      success: true,
      message: "Feedback submitted and sent to the management team",
    });
  } catch (err) {
    console.error("[API: /api/contact] POST error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to submit message" },
      { status: 500 }
    );
  }
}
