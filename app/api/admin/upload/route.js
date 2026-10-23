import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth/adminAuth";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: Administrator session required." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") || formData.get("image");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "No image file provided in form submission." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file type (${file.type}). Allowed types: JPG, PNG, WEBP, AVIF, GIF.`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Image size exceeds 5MB limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine extension
    const extMap = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/avif": "avif",
      "image/gif": "gif",
    };
    const ext = extMap[file.type] || "jpg";
    const filename = `dish_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");

    try {
      await fs.mkdir(uploadDir, { recursive: true });
      const targetPath = path.join(uploadDir, filename);
      await fs.writeFile(targetPath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${filename}`,
        filename,
      });
    } catch (fsErr) {
      // Ephemeral / Serverless runtime fallback (read-only filesystem)
      if (fsErr.code === "EROFS" || fsErr.code === "EACCES") {
        console.warn("[Upload] Serverless read-only filesystem detected. Returning optimized Data URL.");
        const base64Data = buffer.toString("base64");
        const dataUrl = `data:${file.type};base64,${base64Data}`;
        return NextResponse.json({
          success: true,
          url: dataUrl,
          filename,
          isDataUrl: true,
        });
      }
      throw fsErr;
    }
  } catch (err) {
    console.error("[API: /api/admin/upload] POST error:", err);
    return NextResponse.json(
      { success: false, error: "Image upload failed. Please try again." },
      { status: 500 }
    );
  }
}
