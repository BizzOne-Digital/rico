import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models";
import { errorResponse, jsonResponse, serializeDoc, withAdmin } from "@/lib/api-helpers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const order = await Order.findOne({ $or: [{ _id: id }, { orderNumber: id }] });
    if (!order) return errorResponse("Order not found", 404);
    return jsonResponse({ success: true, data: serializeDoc(order) });
  } catch {
    return errorResponse("Failed to fetch order", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await withAdmin(async () => {
    const { id } = await params;
    const body = await request.json();
    await connectDB();
    const order = await Order.findByIdAndUpdate(
      id,
      {
        ...body,
        ...(body.fulfillmentStatus && {
          $push: { timeline: { status: body.fulfillmentStatus, note: body.internalNotes || "", date: new Date() } },
        }),
      },
      { new: true }
    );
    if (!order) return errorResponse("Order not found", 404);
    return jsonResponse({ success: true, data: serializeDoc(order) });
  });
  return result;
}
