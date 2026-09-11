import { connectDB } from "@/lib/db";
import {
  Product,
  Order,
  Booking,
  ContactInquiry,
  NewsletterSubscriber,
  ActivityLog,
} from "@/models";
import { jsonResponse, withAdmin } from "@/lib/api-helpers";

export async function GET() {
  const result = await withAdmin(async () => {
    await connectDB();

    const [
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      revenueResult,
      upcomingBookings,
      newInquiries,
      subscribers,
      recentActivity,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: "active" }),
      Product.countDocuments({ status: "active", stock: { $lte: 5 }, trackInventory: true }),
      Order.countDocuments(),
      Order.countDocuments({ paymentStatus: "pending" }),
      Order.aggregate([
        { $match: { paymentStatus: { $in: ["paid", "processing", "shipped", "completed"] } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Booking.countDocuments({ status: { $in: ["new", "confirmed"] } }),
      ContactInquiry.countDocuments({ read: false }),
      NewsletterSubscriber.countDocuments({ active: true }),
      ActivityLog.find().sort({ createdAt: -1 }).limit(10),
    ]);

    return jsonResponse({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        lowStockProducts,
        totalOrders,
        pendingOrders,
        revenue: revenueResult[0]?.total || 0,
        upcomingBookings,
        newInquiries,
        subscribers,
        recentActivity,
      },
    });
  });
  return result;
}
