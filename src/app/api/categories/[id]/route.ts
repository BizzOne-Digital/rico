import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { ProductCategory } from "@/models";
import { errorResponse, jsonResponse, serializeDoc, withAdmin } from "@/lib/api-helpers";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await withAdmin(async () => {
    const { id } = await params;
    const body = await request.json();
    await connectDB();
    const category = await ProductCategory.findByIdAndUpdate(id, body, { new: true });
    if (!category) return errorResponse("Category not found", 404);
    return jsonResponse({ success: true, data: serializeDoc(category) });
  });
  return result;
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await withAdmin(async () => {
    const { id } = await params;
    await connectDB();
    const category = await ProductCategory.findByIdAndDelete(id);
    if (!category) return errorResponse("Category not found", 404);
    return jsonResponse({ success: true });
  });
  return result;
}
