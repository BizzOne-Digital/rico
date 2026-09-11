import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Product, Order, getSiteSettings } from "@/models";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validators";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return errorResponse(
      "Stripe is not configured. Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your environment.",
      503
    );
  }

  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.issues[0].message);

    await connectDB();
    const settings = await getSiteSettings();
    const stripe = getStripe()!;

    const orderItems = [];
    let subtotal = 0;

    for (const item of parsed.data.items) {
      const product = await Product.findById(item.productId);
      if (!product) return errorResponse(`Product not found: ${item.productId}`);
      if (product.status !== "active") return errorResponse(`${product.name} is not available`);
      if (product.trackInventory && product.stock < item.quantity) {
        return errorResponse(`Insufficient stock for ${product.name}`);
      }

      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;
      orderItems.push({
        productId: product._id.toString(),
        name: product.name,
        slug: product.slug,
        price: product.price,
        quantity: item.quantity,
        image: product.featuredImage || product.images[0]?.url || "",
        size: product.size,
        format: product.format,
        sku: product.sku,
      });
    }

    const shippingCost =
      subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFlatRate;
    const tax = subtotal * (settings.taxRate / 100);
    const total = subtotal + shippingCost + tax;
    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      customer: parsed.data.customer,
      shipping: parsed.data.shipping,
      items: orderItems,
      subtotal,
      shippingCost,
      tax,
      discount: 0,
      total,
      paymentStatus: "pending",
      fulfillmentStatus: "pending",
      timeline: [{ status: "pending", note: "Order created", date: new Date() }],
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: parsed.data.customer.email,
      line_items: orderItems.map((item) => ({
        price_data: {
          currency: settings.currency.toLowerCase(),
          product_data: {
            name: item.name,
            images: item.image ? [`${siteUrl}${item.image}`] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: Math.round(shippingCost * 100), currency: settings.currency.toLowerCase() },
            display_name: shippingCost === 0 ? "Free Shipping" : "Standard Shipping",
          },
        },
      ],
      metadata: { orderId: order._id.toString(), orderNumber },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel?order=${orderNumber}`,
    });

    order.stripeSessionId = session.id;
    await order.save();

    return jsonResponse({ success: true, sessionId: session.id, url: session.url, orderNumber });
  } catch (error) {
    console.error("Checkout error:", error);
    return errorResponse("Checkout failed", 500);
  }
}
