import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models";
import { jsonResponse, serializeDoc, withAdmin } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  const result = await withAdmin(async () => {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const filter: Record<string, unknown> = {};
    if (status) filter.paymentStatus = status;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "customer.email": { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
      ];
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(100);
    return jsonResponse({ success: true, data: serializeDoc(orders) });
  });
  return result;
}
