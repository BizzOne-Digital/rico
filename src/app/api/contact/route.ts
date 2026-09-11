import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { ContactInquiry } from "@/models";
import { contactSchema } from "@/lib/validators";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail, contactNotificationEmail, isEmailConfigured } from "@/lib/email";
import { sanitizeHtml } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(`contact:${ip}`, 3, 300_000);
  if (!limit.success) return errorResponse("Too many requests. Try again later.", 429);

  try {
    const body = await request.json();
    if (body.honeypot) return jsonResponse({ success: true });

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0].message);

    await connectDB();
    await ContactInquiry.create(parsed.data);

    if (isEmailConfigured()) {
      const receiver = process.env.CONTACT_RECEIVER_EMAIL || "rico@fungtionallabs.com";
      await sendEmail({
        to: receiver,
        subject: `Contact: ${parsed.data.subject}`,
        html: contactNotificationEmail({
          name: sanitizeHtml(parsed.data.name),
          email: parsed.data.email,
          phone: parsed.data.phone,
          subject: sanitizeHtml(parsed.data.subject),
          message: sanitizeHtml(parsed.data.message),
        }),
        replyTo: parsed.data.email,
      });
    }

    return jsonResponse({ success: true, message: "Message sent successfully" });
  } catch {
    return errorResponse("Failed to send message", 500);
  }
}
