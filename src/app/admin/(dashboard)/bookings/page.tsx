"use client";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { Trash } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import type { BookingStatus } from "@/types";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  timezone: string;
  status: BookingStatus;
  createdAt: string;
}

const STATUS_VARIANT: Record<BookingStatus, "success" | "warning" | "danger" | "neutral" | "default"> = {
  new: "warning",
  confirmed: "success",
  rescheduled: "default",
  completed: "success",
  cancelled: "danger",
};

const STATUS_OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "confirmed", label: "Confirmed" },
  { value: "rescheduled", label: "Rescheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function exportCsv(bookings: Booking[]) {
  const headers = ["Name", "Email", "Phone", "Service", "Date", "Time", "Timezone", "Status", "Created"];
  const rows = bookings.map((b) => [
    b.name,
    b.email,
    b.phone,
    b.service,
    format(new Date(b.preferredDate), "yyyy-MM-dd"),
    b.preferredTime,
    b.timezone,
    b.status,
    format(new Date(b.createdAt), "yyyy-MM-dd HH:mm"),
  ]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bookings-${format(new Date(), "yyyy-MM-dd")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);

    try {
      const res = await fetch(`/api/bookings?${params}`);
      const data = await res.json();
      if (data.success) setBookings(data.data);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line -- data fetch on mount
    void fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (id: string, status: BookingStatus) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      toast.success("Status updated");
      fetchBookings();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/bookings/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      toast.success("Booking deleted");
      setDeleteId(null);
      fetchBookings();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="Bookings" description="Manage service bookings" />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[{ value: "", label: "All Statuses" }, ...STATUS_OPTIONS]}
          className="w-44"
        />
        <Button variant="outline" size="sm" onClick={() => exportCsv(bookings)}>
          Export CSV
        </Button>
      </div>

      <DataTable
        data={bookings}
        isLoading={loading}
        keyExtractor={(b) => b._id}
        columns={[
          { key: "name", header: "Name", cell: (b) => <span className="font-medium">{b.name}</span> },
          {
            key: "contact",
            header: "Contact",
            hideOnMobile: true,
            cell: (b) => (
              <div>
                <p className="text-sm">{b.email}</p>
                <p className="text-xs text-[#C8C9C7]">{b.phone}</p>
              </div>
            ),
          },
          { key: "service", header: "Service", cell: (b) => b.service },
          {
            key: "date",
            header: "Date & Time",
            cell: (b) => (
              <div>
                <p>{format(new Date(b.preferredDate), "MMM d, yyyy")}</p>
                <p className="text-xs text-[#C8C9C7]">{b.preferredTime} ({b.timezone})</p>
              </div>
            ),
          },
          {
            key: "status",
            header: "Status",
            cell: (b) => (
              <select
                value={b.status}
                onChange={(e) => updateStatus(b._id, e.target.value as BookingStatus)}
                className="rounded-lg border border-[#EDE9DE] bg-[#F5F3EC] px-2 py-1 text-xs text-[#143D2D]"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            cell: (b) => (
              <Button variant="ghost" size="sm" onClick={() => setDeleteId(b._id)}>
                <Trash size={16} className="text-[#F05A28]" />
              </Button>
            ),
          },
        ]}
        mobileCard={(b) => (
          <div className="space-y-2">
            <p className="font-medium">{b.name}</p>
            <p className="text-sm text-[#2D6A4F]">{b.service}</p>
            <p className="text-xs">{format(new Date(b.preferredDate), "MMM d, yyyy")} at {b.preferredTime}</p>
            <Badge variant={STATUS_VARIANT[b.status]}>{b.status}</Badge>
            <select
              value={b.status}
              onChange={(e) => updateStatus(b._id, e.target.value as BookingStatus)}
              className="w-full rounded-lg border border-[#EDE9DE] bg-[#F5F3EC] px-2 py-2 text-sm"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Booking"
        description="This will permanently remove the booking."
        isLoading={deleting}
      />
    </>
  );
}
