import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Product, ProductCategory } from "@/models";
import { errorResponse, jsonResponse, serializeDoc, withAdmin } from "@/lib/api-helpers";
import { productSchema } from "@/lib/validators";
import { logActivity } from "@/models/ActivityLog";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const benefit = searchParams.get("benefit");
    const format = searchParams.get("format");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const admin = searchParams.get("admin");

    const filter: Record<string, unknown> = {};
    if (!admin) filter.status = { $in: ["active", "out_of_stock"] };
    else if (status) filter.status = status;

    if (category) {
      const cat = await ProductCategory.findOne({ slug: category });
      if (cat) filter.category = cat._id;
    }
    if (benefit) filter.benefits = { $regex: benefit, $options: "i" };
    if (format) filter.format = { $regex: format, $options: "i" };
    if (featured === "true") filter.featured = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { benefits: { $regex: search, $options: "i" } },
      ];
    }
    if (minPrice) filter.price = { ...((filter.price as object) || {}), $gte: parseFloat(minPrice) };
    if (maxPrice) filter.price = { ...((filter.price as object) || {}), $lte: parseFloat(maxPrice) };

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "price-asc") sortOption = { price: 1 };
    if (sort === "price-desc") sortOption = { price: -1 };
    if (sort === "featured") sortOption = { featured: -1, displayOrder: 1 };
    if (sort === "name") sortOption = { name: 1 };

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(filter).populate("category").sort(sortOption).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    return jsonResponse({
      success: true,
      data: serializeDoc(products),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch {
    return errorResponse("Failed to fetch products", 500);
  }
}

export async function POST(request: NextRequest) {
  const result = await withAdmin(async (user) => {
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0].message);

    await connectDB();
    const existing = await Product.findOne({ slug: parsed.data.slug });
    if (existing) return errorResponse("Product with this slug already exists");

    const product = await Product.create(parsed.data);
    await logActivity("create", "product", product._id.toString(), product.name, user.id);
    return jsonResponse({ success: true, data: serializeDoc(product) }, 201);
  });
  return result;
}
