import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { ProductCategory } from "@/models";
import { errorResponse, jsonResponse, serializeDoc, withAdmin } from "@/lib/api-helpers";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin");
    const filter = admin ? {} : { active: true };
    const categories = await ProductCategory.find(filter).sort({ displayOrder: 1 });
    return jsonResponse({ success: true, data: serializeDoc(categories) });
  } catch {
    return errorResponse("Failed to fetch categories", 500);
  }
}

export async function POST(request: NextRequest) {
  const result = await withAdmin(async () => {
    const body = await request.json();
    await connectDB();
    const category = await ProductCategory.create({
      ...body,
      slug: body.slug || slugify(body.name),
    });
    return jsonResponse({ success: true, data: serializeDoc(category) }, 201);
  });
  return result;
}
