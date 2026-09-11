import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getSiteSettings } from "@/models";
import { errorResponse, jsonResponse, serializeDoc, withAdmin } from "@/lib/api-helpers";

export async function GET() {
  try {
    await connectDB();
    const settings = await getSiteSettings();
    return jsonResponse({ success: true, data: serializeDoc(settings) });
  } catch {
    return errorResponse("Failed to fetch settings", 500);
  }
}

export async function PUT(request: NextRequest) {
  const result = await withAdmin(async () => {
    const body = await request.json();
    await connectDB();
    const settings = await getSiteSettings();
    Object.assign(settings, body);
    await settings.save();
    return jsonResponse({ success: true, data: serializeDoc(settings) });
  });
  return result;
}
