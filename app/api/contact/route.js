import { NextResponse } from "next/server";
import { createCustomerReviewOrInquiry } from "@/lib/admin/serverStore";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || !body.message) {
      return NextResponse.json(
        { success: false, error: "Name and message are required" },
        { status: 400 }
      );
    }

    await createCustomerReviewOrInquiry(body);

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
