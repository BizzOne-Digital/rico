import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { FAQ } from "@/models";
import { errorResponse, jsonResponse, serializeDoc, withAdmin } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin");
    const filter = admin ? {} : { active: true };
    const faqs = await FAQ.find(filter).sort({ displayOrder: 1 });
    return jsonResponse({ success: true, data: serializeDoc(faqs) });
  } catch {
    return errorResponse("Failed to fetch FAQs", 500);
  }
}

export async function POST(request: NextRequest) {
  const result = await withAdmin(async () => {
    const body = await request.json();
    await connectDB();
    const faq = await FAQ.create(body);
    return jsonResponse({ success: true, data: serializeDoc(faq) }, 201);
  });
  return result;
}
