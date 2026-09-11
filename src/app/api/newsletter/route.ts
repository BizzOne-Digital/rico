import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { NewsletterSubscriber } from "@/models";
import { newsletterSchema } from "@/lib/validators";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(`newsletter:${ip}`, 5, 300_000);
  if (!limit.success) return errorResponse("Too many requests", 429);

  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0].message);

    await connectDB();
    const existing = await NewsletterSubscriber.findOne({ email: parsed.data.email });
    if (existing) return errorResponse("Email already subscribed");

    await NewsletterSubscriber.create({ email: parsed.data.email });
    return jsonResponse({ success: true, message: "Subscribed successfully" });
  } catch {
    return errorResponse("Failed to subscribe", 500);
  }
}
