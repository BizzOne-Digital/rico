import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order, Product } from "@/models";
import { getStripe } from "@/lib/stripe";
import { sendEmail, orderConfirmationEmail, isEmailConfigured } from "@/lib/email";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await connectDB();
      const order = await Order.findById(orderId);
      if (order && order.paymentStatus === "pending") {
        order.paymentStatus = "paid";
        order.fulfillmentStatus = "processing";
        order.stripePaymentIntentId = session.payment_intent as string;
        order.timeline.push({ status: "paid", note: "Payment received", date: new Date() });
        await order.save();

        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: -item.quantity },
          });
        }

        if (isEmailConfigured()) {
          await sendEmail({
            to: order.customer.email,
            subject: `Order Confirmed - ${order.orderNumber}`,
            html: orderConfirmationEmail({
              orderNumber: order.orderNumber,
              customerName: order.customer.name,
              items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
              total: order.total,
            }),
          });

          const salesEmail = process.env.SALES_RECEIVER_EMAIL;
          if (salesEmail) {
            await sendEmail({
              to: salesEmail,
              subject: `New Order - ${order.orderNumber}`,
              html: orderConfirmationEmail({
                orderNumber: order.orderNumber,
                customerName: order.customer.name,
                items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
                total: order.total,
              }),
            });
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
