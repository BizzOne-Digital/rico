import { clearSessionCookie } from "@/lib/auth";
import { jsonResponse } from "@/lib/api-helpers";

export async function POST() {
  await clearSessionCookie();
  return jsonResponse({ success: true });
}
