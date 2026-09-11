"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { Calendar, Mail, Package, Zap } from "@/components/icons";
import { formatPriceDollars } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface DashboardData {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
  upcomingBookings: number;
  newInquiries: number;
  subscribers: number;
  recentActivity: {
    _id: string;
    action: string;
    entity: string;
    details?: string;
    createdAt: string;
  }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your store performance"
      />

      {loading ? (
        <div className="py-12 text-center text-sm text-[#2D6A4F]">Loading stats...</div>
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Total Products"
              value={data.totalProducts}
              subtitle={`${data.activeProducts} active`}
              icon={<Package size={20} />}
            />
            <StatsCard
              title="Revenue"
              value={formatPriceDollars(data.revenue)}
              subtitle={`${data.totalOrders} orders`}
              icon={<Zap size={20} />}
            />
            <StatsCard
              title="Pending Orders"
              value={data.pendingOrders}
              subtitle={`${data.lowStockProducts} low stock`}
              icon={<Package size={20} />}
            />
            <StatsCard
              title="Upcoming Bookings"
              value={data.upcomingBookings}
              subtitle={`${data.newInquiries} new inquiries`}
              icon={<Calendar size={20} />}
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <StatsCard
              title="Newsletter Subscribers"
              value={data.subscribers}
              icon={<Mail size={20} />}
            />
          </div>

          <section className="mt-8 rounded-2xl border border-[#EDE9DE] bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#2D6A4F]">
              Recent Activity
            </h2>
            {data.recentActivity.length === 0 ? (
              <p className="text-sm text-[#C8C9C7]">No recent activity</p>
            ) : (
              <ul className="space-y-3">
                {data.recentActivity.map((item) => (
                  <li
                    key={item._id}
                    className="flex items-start justify-between gap-4 border-b border-[#EDE9DE]/60 pb-3 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#143D2D]">
                        {item.action} {item.entity}
                      </p>
                      {item.details ? (
                        <p className="text-xs text-[#2D6A4F]">{item.details}</p>
                      ) : null}
                    </div>
                    <time className="shrink-0 text-xs text-[#C8C9C7]">
                      {format(new Date(item.createdAt), "MMM d, h:mm a")}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : (
        <div className="py-12 text-center text-sm text-[#F05A28]">
          Failed to load dashboard data
        </div>
      )}
    </>
  );
}
