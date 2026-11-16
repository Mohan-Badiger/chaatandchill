import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth/adminAuth";
import { rateLimit } from "@/lib/rateLimit";
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

function isValidImageMagicBytes(buffer, type) {
  if (buffer.length < 4) return false;
  // JPEG: FF D8 FF
  if (type === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  // PNG: 89 50 4E 47
  if (type === "image/png") {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  }
  // GIF: 47 49 46
  if (type === "image/gif") {
    return buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46;
  }
  // WEBP: RIFF....WEBP
  if (type === "image/webp") {
    return (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer.length >= 12 &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }
  // AVIF: ....ftyp
  if (type === "image/avif") {
    return buffer.length >= 12 && buffer.subarray(4, 12).toString("ascii").includes("ftyp");
  }
  return false;
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

    // Rate limit uploads: 20 uploads per minute per admin
    const limitCheck = rateLimit(`admin-upload:${admin.id}`, 20, 60 * 1000);
    if (!limitCheck.success) {
      return NextResponse.json(
        { success: false, error: "Upload rate limit reached. Please wait a moment." },
        { status: 429 }
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

    // Validate magic bytes to prevent MIME spoofing
    if (!isValidImageMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        { success: false, error: "File contents do not match the expected image signature." },
        { status: 400 }
      );
    }

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
        if (file.size > 1.5 * 1024 * 1024) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Direct serverless upload exceeds 1.5MB in read-only environment. Please configure external cloud storage (S3/Cloudinary) for large media.",
            },
            { status: 413 }
          );
        }
        console.warn("[Upload] Serverless read-only filesystem detected. Returning Data URL.");
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
