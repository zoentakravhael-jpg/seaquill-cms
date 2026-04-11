import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml",
  "video/mp4", "video/webm", "video/ogg",
];
const MAX_SIZE_IMAGE = 5 * 1024 * 1024; // 5MB
const MAX_SIZE_VIDEO = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipe file tidak diizinkan. Gunakan JPG, PNG, WebP, GIF, SVG, MP4, WebM, atau OGG." },
        { status: 400 }
      );
    }

    const isVideo = file.type.startsWith("video/");
    const maxSize = isVideo ? MAX_SIZE_VIDEO : MAX_SIZE_IMAGE;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `Ukuran file maksimal ${isVideo ? "50MB" : "5MB"}.` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = path.extname(file.name) || `.${file.type.split("/")[1]}`;
    const hash = crypto.randomBytes(8).toString("hex");
    const filename = `${Date.now()}-${hash}${ext}`;

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(UPLOAD_DIR, filename);
    await writeFile(filePath, buffer);

    const url = `/uploads/${filename}`;

    // Save to database
    await prisma.mediaFile.create({
      data: {
        filename: file.name,
        url,
        mimeType: file.type,
        size: file.size,
      },
    });

    return NextResponse.json({ url, filename });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Gagal mengupload file." },
      { status: 500 }
    );
  }
}
