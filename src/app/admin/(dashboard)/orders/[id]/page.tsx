"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { formatPriceDollars } from "@/lib/utils";
import type { OrderStatus } from "@/types";
import { format } from "date-fns";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface OrderDetail {
  _id: string;
  orderNumber: string;
  customer: { name: string; email: string; phone?: string };
  shipping: { address: string; city: string; state: string; zip: string; country: string };
  items: {
    name: string;
    price: number;
    quantity: number;
    image: string;
    size?: string;
    format?: string;
  }[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: OrderStatus;
  fulfillmentStatus: OrderStatus;
  trackingNumber?: string;
  trackingCarrier?: string;
  internalNotes?: string;
  timeline: { status: string; note?: string; date: string }[];
  createdAt: string;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fulfillmentStatus, setFulfillmentStatus] = useState<OrderStatus>("pending");
  const [paymentStatus, setPaymentStatus] = useState<OrderStatus>("pending");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingCarrier, setTrackingCarrier] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          const o = res.data;
          setOrder(o);
          setFulfillmentStatus(o.fulfillmentStatus);
          setPaymentStatus(o.paymentStatus);
          setTrackingNumber(o.trackingNumber || "");
          setTrackingCarrier(o.trackingCarrier || "");
          setInternalNotes(o.internalNotes || "");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfillmentStatus,
          paymentStatus,
          trackingNumber,
          trackingCarrier,
          internalNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      setOrder(data.data);
      toast.success("Order updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-sm text-[#2D6A4F]">Loading order...</div>;
  }

  if (!order) {
    return <div className="py-12 text-center text-sm text-[#F05A28]">Order not found</div>;
  }

  return (
    <>
      <PageHeader
        title={`Order ${order.orderNumber}`}
        description={`Placed ${format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl border border-[#EDE9DE] bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#2D6A4F]">
              Items
            </h2>
            <ul className="space-y-4">
              {order.items.map((item, i) => (
                <li key={i} className="flex items-center gap-4 border-b border-[#EDE9DE]/60 pb-4 last:border-0">
                  <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-[#EDE9DE]">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#143D2D]">{item.name}</p>
                    <p className="text-xs text-[#C8C9C7]">
                      Qty: {item.quantity}
                      {item.size ? ` · ${item.size}` : ""}
                      {item.format ? ` · ${item.format}` : ""}
                    </p>
                  </div>
                  <p className="font-medium">{formatPriceDollars(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-[#EDE9DE] pt-4 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPriceDollars(order.subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{formatPriceDollars(order.shippingCost)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{formatPriceDollars(order.tax)}</span></div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#55C878]"><span>Discount</span><span>-{formatPriceDollars(order.discount)}</span></div>
              )}
              <div className="flex justify-between font-semibold text-[#143D2D] pt-2">
                <span>Total</span><span>{formatPriceDollars(order.total)}</span>
              </div>
            </div>
          </section>

          {order.timeline?.length > 0 && (
            <section className="rounded-2xl border border-[#EDE9DE] bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#2D6A4F]">
                Timeline
              </h2>
              <ul className="space-y-3">
                {order.timeline.map((entry, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <time className="shrink-0 text-xs text-[#C8C9C7]">
                      {format(new Date(entry.date), "MMM d, h:mm a")}
                    </time>
                    <div>
                      <Badge variant="neutral">{entry.status}</Badge>
                      {entry.note ? <p className="mt-1 text-[#2D6A4F]">{entry.note}</p> : null}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-[#EDE9DE] bg-white p-6 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2D6A4F]">
              Customer
            </h2>
            <p className="font-medium">{order.customer.name}</p>
            <p className="text-sm text-[#2D6A4F]">{order.customer.email}</p>
            {order.customer.phone ? <p className="text-sm">{order.customer.phone}</p> : null}
          </section>

          <section className="rounded-2xl border border-[#EDE9DE] bg-white p-6 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2D6A4F]">
              Shipping
            </h2>
            <p className="text-sm">
              {order.shipping.address}<br />
              {order.shipping.city}, {order.shipping.state} {order.shipping.zip}<br />
              {order.shipping.country}
            </p>
          </section>

          <section className="rounded-2xl border border-[#EDE9DE] bg-white p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2D6A4F]">
              Update Status
            </h2>
            <Select
              label="Payment Status"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as OrderStatus)}
              options={STATUS_OPTIONS}
            />
            <Select
              label="Fulfillment Status"
              value={fulfillmentStatus}
              onChange={(e) => setFulfillmentStatus(e.target.value as OrderStatus)}
              options={STATUS_OPTIONS}
            />
            <Input
              label="Tracking Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
            <Input
              label="Tracking Carrier"
              value={trackingCarrier}
              onChange={(e) => setTrackingCarrier(e.target.value)}
              placeholder="USPS, UPS, FedEx..."
            />
            <Textarea
              label="Internal Notes"
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={3}
            />
            <Button onClick={handleUpdate} isLoading={saving} className="w-full">
              Save Changes
            </Button>
          </section>
        </div>
      </div>
    </>
  );
}
