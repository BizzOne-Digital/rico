import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { FAQ } from "@/models";
import { errorResponse, jsonResponse, serializeDoc, withAdmin } from "@/lib/api-helpers";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await withAdmin(async () => {
    const { id } = await params;
    const body = await request.json();
    await connectDB();
    const faq = await FAQ.findByIdAndUpdate(id, body, { new: true });
    if (!faq) return errorResponse("FAQ not found", 404);
    return jsonResponse({ success: true, data: serializeDoc(faq) });
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
    const faq = await FAQ.findByIdAndDelete(id);
    if (!faq) return errorResponse("FAQ not found", 404);
    return jsonResponse({ success: true });
  });
  return result;
}
