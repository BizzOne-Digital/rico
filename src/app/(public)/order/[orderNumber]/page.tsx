import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Order } from "@/models";
import { createMetadata } from "@/lib/metadata";
import { BRAND } from "@/lib/constants";
import { formatPriceDollars } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";

interface OrderPageProps {
  params: Promise<{ orderNumber: string }>;
}

async function getOrder(orderNumber: string) {
  await connectDB();
  const order = await Order.findOne({ orderNumber });
  if (!order) return null;
  return JSON.parse(JSON.stringify(order));
}

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return createMetadata({
    title: `Order ${orderNumber}`,
    description: `Track your order from ${BRAND.name}.`,
    path: `/order/${orderNumber}`,
    noIndex: true,
  });
}

export default async function OrderTrackingPage({ params }: OrderPageProps) {
  const { orderNumber } = await params;
  const order = await getOrder(orderNumber);
  if (!order) notFound();

  const statusVariant = (status: string) => {
    if (status === "completed" || status === "paid") return "success";
    if (status === "cancelled" || status === "refunded") return "danger";
    if (status === "shipped") return "default";
    return "warning";
  };

  return (
    <div className="page-shell page-offset bg-page">
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-warm-white">Order Tracking</h1>
            <p className="mt-2 font-mono text-sm text-metallic-silver">{order.orderNumber}</p>
          </div>
          <Badge variant={statusVariant(order.fulfillmentStatus)}>
            {order.fulfillmentStatus}
          </Badge>
        </div>

        <div className="surface-card mt-10 rounded-2xl p-6">
          <h2 className="font-medium text-warm-white">Order Details</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-metallic-silver">Payment Status</dt>
              <dd className="font-medium capitalize text-warm-white">{order.paymentStatus}</dd>
            </div>
            <div>
              <dt className="text-metallic-silver">Order Date</dt>
              <dd className="font-medium text-warm-white">
                {new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}
              </dd>
            </div>
            {order.trackingNumber && (
              <div className="sm:col-span-2">
                <dt className="text-metallic-silver">Tracking</dt>
                <dd className="font-medium text-warm-white">
                  {order.trackingCarrier ? `${order.trackingCarrier}: ` : ""}{order.trackingNumber}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="font-medium text-warm-white">Items</h2>
          {order.items.map((item: { productId: string; name: string; slug: string; price: number; quantity: number; image: string }) => (
            <div key={item.productId} className="surface-card flex gap-4 rounded-xl p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-obsidian">
                <ProductImage src={item.image} alt={item.name} fill sizes="64px" />
              </div>
              <div className="flex-1">
                <Link href={`/shop/${item.slug}`} className="font-medium text-warm-white hover:text-electric">
                  {item.name}
                </Link>
                <p className="text-sm text-metallic-silver">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium text-electric">{formatPriceDollars(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="surface-card mt-8 rounded-2xl p-6 text-warm-white">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-metallic-silver">Subtotal</span><span>{formatPriceDollars(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-metallic-silver">Shipping</span><span>{formatPriceDollars(order.shippingCost)}</span></div>
            <div className="flex justify-between"><span className="text-metallic-silver">Tax</span><span>{formatPriceDollars(order.tax)}</span></div>
            {order.discount > 0 && (
              <div className="flex justify-between"><span className="text-metallic-silver">Discount</span><span>-{formatPriceDollars(order.discount)}</span></div>
            )}
            <div className="flex justify-between border-t border-deep-forest/50 pt-2 text-base font-semibold">
              <span>Total</span><span>{formatPriceDollars(order.total)}</span>
            </div>
          </div>
        </div>

        {order.timeline?.length > 0 && (
          <div className="mt-8">
            <h2 className="font-medium text-warm-white">Timeline</h2>
            <ol className="mt-4 space-y-3">
              {order.timeline.map((entry: { status: string; note?: string; date: string }, i: number) => (
                <li key={i} className="flex gap-4 text-sm">
                  <span className="w-24 shrink-0 text-metallic-silver">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                  <span className="capitalize font-medium text-warm-white">{entry.status}</span>
                  {entry.note && <span className="text-metallic-silver">— {entry.note}</span>}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-10">
          <Link href="/shop"><Button variant="outline">Continue Shopping</Button></Link>
        </div>
      </div>
    </div>
  );
}
