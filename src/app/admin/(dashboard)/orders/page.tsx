"use client";

import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { Eye } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatPriceDollars } from "@/lib/utils";
import type { OrderStatus } from "@/types";
import { format } from "date-fns";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface Order {
  _id: string;
  orderNumber: string;
  customer: { name: string; email: string };
  total: number;
  paymentStatus: OrderStatus;
  fulfillmentStatus: OrderStatus;
  createdAt: string;
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "neutral" | "default"> = {
  pending: "warning",
  paid: "success",
  processing: "default",
  shipped: "default",
  completed: "success",
  cancelled: "danger",
  refunded: "neutral",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);

    try {
      const res = await fetch(`/api/orders?${params}`);
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timer = setTimeout(fetchOrders, 300);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  return (
    <>
      <PageHeader title="Orders" description="View and manage customer orders" />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search by order #, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: "", label: "All Statuses" },
            { value: "pending", label: "Pending" },
            { value: "paid", label: "Paid" },
            { value: "processing", label: "Processing" },
            { value: "shipped", label: "Shipped" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
            { value: "refunded", label: "Refunded" },
          ]}
          className="w-44"
        />
      </div>

      <DataTable
        data={orders}
        isLoading={loading}
        keyExtractor={(o) => o._id}
        columns={[
          {
            key: "orderNumber",
            header: "Order #",
            cell: (o) => <span className="font-medium">{o.orderNumber}</span>,
          },
          {
            key: "customer",
            header: "Customer",
            cell: (o) => (
              <div>
                <p>{o.customer.name}</p>
                <p className="text-xs text-[#C8C9C7]">{o.customer.email}</p>
              </div>
            ),
          },
          {
            key: "total",
            header: "Total",
            cell: (o) => formatPriceDollars(o.total),
          },
          {
            key: "payment",
            header: "Payment",
            cell: (o) => (
              <Badge variant={STATUS_VARIANT[o.paymentStatus] || "neutral"}>
                {o.paymentStatus}
              </Badge>
            ),
          },
          {
            key: "fulfillment",
            header: "Fulfillment",
            hideOnMobile: true,
            cell: (o) => (
              <Badge variant={STATUS_VARIANT[o.fulfillmentStatus] || "neutral"}>
                {o.fulfillmentStatus}
              </Badge>
            ),
          },
          {
            key: "date",
            header: "Date",
            hideOnMobile: true,
            cell: (o) => format(new Date(o.createdAt), "MMM d, yyyy"),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            cell: (o) => (
              <Link href={`/admin/orders/${o._id}`}>
                <Button variant="ghost" size="sm">
                  <Eye size={16} />
                </Button>
              </Link>
            ),
          },
        ]}
        mobileCard={(o) => (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{o.orderNumber}</span>
              <span className="text-sm">{formatPriceDollars(o.total)}</span>
            </div>
            <p className="text-sm text-[#2D6A4F]">{o.customer.name}</p>
            <Badge variant={STATUS_VARIANT[o.paymentStatus] || "neutral"}>{o.paymentStatus}</Badge>
            <Link href={`/admin/orders/${o._id}`}>
              <Button variant="outline" size="sm" className="w-full">View Details</Button>
            </Link>
          </div>
        )}
      />
    </>
  );
}
