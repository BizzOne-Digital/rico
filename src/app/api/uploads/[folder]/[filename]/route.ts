import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { StoredUpload } from "@/models";
import { UPLOAD_FOLDERS } from "@/lib/constants";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ folder: string; filename: string }> }
) {
  const { folder, filename } = await params;

  if (!UPLOAD_FOLDERS.includes(folder as typeof UPLOAD_FOLDERS[number])) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (filename.includes("..") || filename.includes("/")) {
    return new NextResponse("Invalid filename", { status: 400 });
  }

  try {
    await connectDB();
    const upload = await StoredUpload.findOne({ folder, filename });
    if (!upload) return new NextResponse("Not found", { status: 404 });

    return new NextResponse(new Uint8Array(upload.data), {
      headers: {
        "Content-Type": upload.mimeType,
        "Content-Length": upload.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Server error", { status: 500 });
  }
}
