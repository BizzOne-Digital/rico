import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models";
import { errorResponse, jsonResponse, serializeDoc, withAdmin } from "@/lib/api-helpers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await withAdmin(async () => {
    const { id } = await params;
    await connectDB();
    const booking = await Booking.findById(id);
    if (!booking) return errorResponse("Booking not found", 404);
    return jsonResponse({ success: true, data: serializeDoc(booking) });
  });
  return result;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await withAdmin(async () => {
    const { id } = await params;
    const body = await request.json();
    await connectDB();
    const booking = await Booking.findByIdAndUpdate(id, body, { new: true });
    if (!booking) return errorResponse("Booking not found", 404);
    return jsonResponse({ success: true, data: serializeDoc(booking) });
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
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) return errorResponse("Booking not found", 404);
    return jsonResponse({ success: true });
  });
  return result;
}
