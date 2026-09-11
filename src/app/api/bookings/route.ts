import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models";
import { bookingSchema } from "@/lib/validators";
import { errorResponse, jsonResponse, serializeDoc, withAdmin } from "@/lib/api-helpers";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail, bookingConfirmationEmail, isEmailConfigured } from "@/lib/email";

export async function GET(request: NextRequest) {
  const result = await withAdmin(async () => {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    return jsonResponse({ success: true, data: serializeDoc(bookings) });
  });
  return result;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(`booking:${ip}`, 3, 300_000);
  if (!limit.success) return errorResponse("Too many requests. Try again later.", 429);

  try {
    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0].message);

    await connectDB();
    const booking = await Booking.create({
      ...parsed.data,
      preferredDate: new Date(parsed.data.preferredDate),
    });

    if (isEmailConfigured()) {
      await sendEmail({
        to: parsed.data.email,
        subject: "Booking Request Received - Fungtional Wellness",
        html: bookingConfirmationEmail({
          name: parsed.data.name,
          service: parsed.data.service,
          date: parsed.data.preferredDate,
          time: parsed.data.preferredTime,
        }),
      });

      const receiver = process.env.CONTACT_RECEIVER_EMAIL || "rico@fungtionallabs.com";
      await sendEmail({
        to: receiver,
        subject: `New Booking: ${parsed.data.service}`,
        html: bookingConfirmationEmail({
          name: parsed.data.name,
          service: parsed.data.service,
          date: parsed.data.preferredDate,
          time: parsed.data.preferredTime,
        }),
      });
    }

    return jsonResponse({ success: true, data: serializeDoc(booking) }, 201);
  } catch {
    return errorResponse("Failed to create booking", 500);
  }
}
