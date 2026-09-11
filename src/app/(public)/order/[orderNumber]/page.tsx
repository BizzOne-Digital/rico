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
    <div className="page-shell page-offset">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-deep-forest">Order Tracking</h1>
            <p className="mt-2 font-mono text-sm text-botanical">{order.orderNumber}</p>
          </div>
          <Badge variant={statusVariant(order.fulfillmentStatus)}>
            {order.fulfillmentStatus}
          </Badge>
        </div>

        <div className="mt-10 rounded-2xl border border-soft-ivory bg-warm-white p-6">
          <h2 className="font-medium text-deep-forest">Order Details</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-botanical">Payment Status</dt>
              <dd className="font-medium capitalize text-deep-forest">{order.paymentStatus}</dd>
            </div>
            <div>
              <dt className="text-botanical">Order Date</dt>
              <dd className="font-medium text-deep-forest">
                {new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}
              </dd>
            </div>
            {order.trackingNumber && (
              <div className="sm:col-span-2">
                <dt className="text-botanical">Tracking</dt>
                <dd className="font-medium text-deep-forest">
                  {order.trackingCarrier ? `${order.trackingCarrier}: ` : ""}{order.trackingNumber}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="font-medium text-deep-forest">Items</h2>
          {order.items.map((item: { productId: string; name: string; slug: string; price: number; quantity: number; image: string }) => (
            <div key={item.productId} className="flex gap-4 rounded-xl border border-soft-ivory bg-warm-white p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-soft-ivory">
                <ProductImage src={item.image} alt={item.name} fill sizes="64px" />
              </div>
              <div className="flex-1">
                <Link href={`/shop/${item.slug}`} className="font-medium text-deep-forest hover:text-botanical">
                  {item.name}
                </Link>
                <p className="text-sm text-botanical">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium text-deep-forest">{formatPriceDollars(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-soft-ivory bg-soft-ivory/30 p-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-botanical">Subtotal</span><span>{formatPriceDollars(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-botanical">Shipping</span><span>{formatPriceDollars(order.shippingCost)}</span></div>
            <div className="flex justify-between"><span className="text-botanical">Tax</span><span>{formatPriceDollars(order.tax)}</span></div>
            {order.discount > 0 && (
              <div className="flex justify-between"><span className="text-botanical">Discount</span><span>-{formatPriceDollars(order.discount)}</span></div>
            )}
            <div className="flex justify-between border-t border-soft-ivory pt-2 text-base font-semibold">
              <span>Total</span><span>{formatPriceDollars(order.total)}</span>
            </div>
          </div>
        </div>

        {order.timeline?.length > 0 && (
          <div className="mt-8">
            <h2 className="font-medium text-deep-forest">Timeline</h2>
            <ol className="mt-4 space-y-3">
              {order.timeline.map((entry: { status: string; note?: string; date: string }, i: number) => (
                <li key={i} className="flex gap-4 text-sm">
                  <span className="w-24 shrink-0 text-metallic-silver">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                  <span className="capitalize font-medium text-deep-forest">{entry.status}</span>
                  {entry.note && <span className="text-botanical">— {entry.note}</span>}
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
