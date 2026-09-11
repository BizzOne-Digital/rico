import { NextResponse } from "next/server";
import { requireAdmin } from "./auth";

export function jsonResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function withAdmin<T>(
  handler: (user: { id: string; email: string; name: string; role: "admin" }) => Promise<T>
): Promise<T | NextResponse> {
  try {
    const user = await requireAdmin();
    return await handler(user);
  } catch {
    return errorResponse("Unauthorized", 401);
  }
}

export function serializeDoc<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}
