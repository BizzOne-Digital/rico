import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Service } from "@/models";
import { errorResponse, jsonResponse, serializeDoc, withAdmin } from "@/lib/api-helpers";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await withAdmin(async () => {
    const { id } = await params;
    const body = await request.json();
    await connectDB();
    const service = await Service.findByIdAndUpdate(id, body, { new: true });
    if (!service) return errorResponse("Service not found", 404);
    return jsonResponse({ success: true, data: serializeDoc(service) });
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
    const service = await Service.findByIdAndDelete(id);
    if (!service) return errorResponse("Service not found", 404);
    return jsonResponse({ success: true });
  });
  return result;
}
