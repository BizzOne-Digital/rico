import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models";
import { createSession, setSessionCookie, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(`login:${ip}`, 5, 300_000);
  if (!limit.success) return errorResponse("Too many attempts. Try again later.", 429);

  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0].message);

    await connectDB();
    const user = await AdminUser.findOne({ email: parsed.data.email.toLowerCase() });
    if (!user) return errorResponse("Invalid credentials", 401);

    const valid = await verifyPassword(parsed.data.password, user.password);
    if (!valid) return errorResponse("Invalid credentials", 401);

    const sessionUser = { id: user._id.toString(), email: user.email, name: user.name, role: "admin" as const };
    const token = await createSession(sessionUser);
    await setSessionCookie(token);

    return jsonResponse({ success: true, user: sessionUser });
  } catch {
    return errorResponse("Login failed", 500);
  }
}
