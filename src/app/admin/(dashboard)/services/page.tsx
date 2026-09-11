"use client";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { Edit, Plus, Trash } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ImageField } from "@/components/ui/ImageField";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { slugify } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  image?: string;
  benefits: string[];
  displayOrder: number;
  active: boolean;
  ctaText: string;
  ctaLink: string;
  price?: number;
  duration?: string;
}

const emptyForm = {
  title: "",
  slug: "",
  shortDescription: "",
  fullDescription: "",
  image: "",
  benefits: [] as string[],
  displayOrder: 0,
  active: true,
  ctaText: "Learn More",
  ctaLink: "/booking",
  price: undefined as number | undefined,
  duration: "",
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [benefitInput, setBenefitInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services?admin=true");
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line -- data fetch on mount
    void fetchServices();
  }, [fetchServices]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (svc: Service) => {
    setEditing(svc);
    setForm({
      title: svc.title,
      slug: svc.slug,
      shortDescription: svc.shortDescription,
      fullDescription: svc.fullDescription,
      image: svc.image || "",
      benefits: svc.benefits || [],
      displayOrder: svc.displayOrder,
      active: svc.active,
      ctaText: svc.ctaText,
      ctaLink: svc.ctaLink,
      price: svc.price,
      duration: svc.duration || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editing ? `/api/services/${editing._id}` : "/api/services";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      toast.success(editing ? "Service updated" : "Service created");
      setModalOpen(false);
      fetchServices();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/services/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      toast.success("Service deleted");
      setDeleteId(null);
      fetchServices();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="Services" description="Manage wellness services" />

      <div className="mb-6 flex justify-end">
        <Button size="sm" onClick={openCreate}>
          <Plus size={16} />
          New Service
        </Button>
      </div>

      <DataTable
        data={services}
        isLoading={loading}
        keyExtractor={(s) => s._id}
        columns={[
          { key: "title", header: "Title", cell: (s) => <span className="font-medium">{s.title}</span> },
          { key: "slug", header: "Slug", hideOnMobile: true, cell: (s) => s.slug },
          { key: "duration", header: "Duration", hideOnMobile: true, cell: (s) => s.duration || "—" },
          {
            key: "status",
            header: "Status",
            cell: (s) => (
              <Badge variant={s.active ? "success" : "neutral"}>
                {s.active ? "Active" : "Inactive"}
              </Badge>
            ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            cell: (s) => (
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>
                  <Edit size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(s._id)}>
                  <Trash size={16} className="text-[#F05A28]" />
                </Button>
              </div>
            ),
          },
        ]}
        mobileCard={(s) => (
          <div className="space-y-2">
            <p className="font-medium">{s.title}</p>
            <Badge variant={s.active ? "success" : "neutral"}>{s.active ? "Active" : "Inactive"}</Badge>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(s)}>Edit</Button>
              <Button variant="ghost" size="sm" onClick={() => setDeleteId(s._id)}>
                <Trash size={16} className="text-[#F05A28]" />
              </Button>
            </div>
          </div>
        )}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Service" : "New Service"}
        size="lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                title: e.target.value,
                slug: editing ? f.slug : slugify(e.target.value),
              }))
            }
            required
          />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
          <Textarea
            label="Short Description"
            value={form.shortDescription}
            onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
          />
          <Textarea
            label="Full Description"
            value={form.fullDescription}
            onChange={(e) => setForm((f) => ({ ...f, fullDescription: e.target.value }))}
            rows={4}
          />
          <ImageField
            label="Service Image"
            folder="pages"
            value={form.image}
            onChange={(url) => setForm((f) => ({ ...f, image: url }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Price"
              type="number"
              min="0"
              step="0.01"
              value={form.price ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  price: e.target.value ? parseFloat(e.target.value) : undefined,
                }))
              }
            />
            <Input
              label="Duration"
              value={form.duration}
              onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
              placeholder="e.g. 60 min"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="CTA Text"
              value={form.ctaText}
              onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))}
            />
            <Input
              label="CTA Link"
              value={form.ctaLink}
              onChange={(e) => setForm((f) => ({ ...f, ctaLink: e.target.value }))}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {form.benefits.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setForm((f) => ({ ...f, benefits: f.benefits.filter((x) => x !== b) }))}
                className="rounded-full bg-[#55C878]/15 px-3 py-1 text-xs text-[#143D2D]"
              >
                {b} ×
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add benefit"
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && benefitInput) {
                  e.preventDefault();
                  setForm((f) => ({ ...f, benefits: [...f.benefits, benefitInput] }));
                  setBenefitInput("");
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (benefitInput) {
                  setForm((f) => ({ ...f, benefits: [...f.benefits, benefitInput] }));
                  setBenefitInput("");
                }
              }}
            >
              Add
            </Button>
          </div>
          <Input
            label="Display Order"
            type="number"
            value={form.displayOrder}
            onChange={(e) => setForm((f) => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))}
          />
          <label className="flex items-center gap-2 text-sm text-[#143D2D]">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              className="rounded border-[#C8C9C7] text-[#55C878] focus:ring-[#55C878]"
            />
            Active
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} isLoading={saving}>Save</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        description="This will permanently remove the service."
        isLoading={deleting}
      />
    </>
  );
}
