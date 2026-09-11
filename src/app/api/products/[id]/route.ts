import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models";
import { errorResponse, jsonResponse, serializeDoc, withAdmin } from "@/lib/api-helpers";
import { productSchema } from "@/lib/validators";
import { logActivity } from "@/models/ActivityLog";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const product = await Product.findOne({ $or: [{ _id: id }, { slug: id }] }).populate("category");
    if (!product) return errorResponse("Product not found", 404);
    return jsonResponse({ success: true, data: serializeDoc(product) });
  } catch {
    return errorResponse("Failed to fetch product", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await withAdmin(async (user) => {
    const { id } = await params;
    const body = await request.json();
    const parsed = productSchema.partial().safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0].message);

    await connectDB();
    const product = await Product.findByIdAndUpdate(id, parsed.data, { new: true }).populate("category");
    if (!product) return errorResponse("Product not found", 404);

    await logActivity("update", "product", id, product.name, user.id);
    return jsonResponse({ success: true, data: serializeDoc(product) });
  });
  return result;
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await withAdmin(async (user) => {
    const { id } = await params;
    await connectDB();
    const product = await Product.findByIdAndDelete(id);
    if (!product) return errorResponse("Product not found", 404);
    await logActivity("delete", "product", id, product.name, user.id);
    return jsonResponse({ success: true });
  });
  return result;
}
