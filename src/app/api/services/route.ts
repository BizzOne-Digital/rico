import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Service } from "@/models";
import { errorResponse, jsonResponse, serializeDoc, withAdmin } from "@/lib/api-helpers";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin");
    const filter = admin ? {} : { active: true };
    const services = await Service.find(filter).sort({ displayOrder: 1 });
    return jsonResponse({ success: true, data: serializeDoc(services) });
  } catch {
    return errorResponse("Failed to fetch services", 500);
  }
}

export async function POST(request: NextRequest) {
  const result = await withAdmin(async () => {
    const body = await request.json();
    await connectDB();
    const service = await Service.create({
      ...body,
      slug: body.slug || slugify(body.title),
    });
    return jsonResponse({ success: true, data: serializeDoc(service) }, 201);
  });
  return result;
}
