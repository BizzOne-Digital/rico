import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { StoredUpload } from "@/models";
import { requireAdmin } from "@/lib/auth";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { ALLOWED_MIME_TYPES, MAX_UPLOAD_SIZE, UPLOAD_FOLDERS } from "@/lib/constants";
import { generateRandomHex } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return errorResponse("Unauthorized", 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder");

    await connectDB();
    const filter: Record<string, unknown> = {};
    if (folder) filter.folder = folder;

    const uploads = await StoredUpload.find(filter)
      .select("folder filename mimeType size createdAt")
      .sort({ createdAt: -1 })
      .limit(200);

    const data = uploads.map((u) => ({
      _id: u._id.toString(),
      folder: u.folder,
      filename: u.filename,
      mimeType: u.mimeType,
      size: u.size,
      url: `/api/uploads/${u.folder}/${u.filename}`,
      createdAt: u.createdAt,
    }));

    return jsonResponse({ success: true, data });
  } catch {
    return errorResponse("Failed to fetch uploads", 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return errorResponse("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const { folder, filename } = body;
    if (!folder || !filename) return errorResponse("Missing folder or filename");

    await connectDB();
    const result = await StoredUpload.deleteOne({ folder, filename });
    if (result.deletedCount === 0) return errorResponse("Upload not found", 404);
    return jsonResponse({ success: true });
  } catch {
    return errorResponse("Delete failed", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return errorResponse("Unauthorized", 401);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string;

    if (!file) return errorResponse("No file provided");
    if (!folder || !UPLOAD_FOLDERS.includes(folder as typeof UPLOAD_FOLDERS[number])) {
      return errorResponse("Invalid folder");
    }
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return errorResponse("Invalid file type");
    }
    if (file.size > MAX_UPLOAD_SIZE) {
      return errorResponse("File too large (max 8MB)");
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${Date.now()}-${generateRandomHex()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await connectDB();
    await StoredUpload.create({
      folder,
      filename,
      mimeType: file.type,
      size: file.size,
      data: buffer,
    });

    return jsonResponse({
      success: true,
      url: `/api/uploads/${folder}/${filename}`,
      filename,
      size: file.size,
      folder,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return errorResponse("Upload failed", 500);
  }
}
