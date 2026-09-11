"use client";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { Edit, Plus, Trash } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  active: boolean;
}

const emptyForm = {
  question: "",
  answer: "",
  category: "General",
  displayOrder: 0,
  active: true,
};

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/faqs?admin=true");
      const data = await res.json();
      if (data.success) setFaqs(data.data);
    } catch {
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line -- data fetch on mount
    void fetchFaqs();
  }, [fetchFaqs]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (faq: FAQ) => {
    setEditing(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      displayOrder: faq.displayOrder,
      active: faq.active,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editing ? `/api/faqs/${editing._id}` : "/api/faqs";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      toast.success(editing ? "FAQ updated" : "FAQ created");
      setModalOpen(false);
      fetchFaqs();
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
      const res = await fetch(`/api/faqs/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      toast.success("FAQ deleted");
      setDeleteId(null);
      fetchFaqs();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="FAQs" description="Manage frequently asked questions" />

      <div className="mb-6 flex justify-end">
        <Button size="sm" onClick={openCreate}>
          <Plus size={16} />
          New FAQ
        </Button>
      </div>

      <DataTable
        data={faqs}
        isLoading={loading}
        keyExtractor={(f) => f._id}
        columns={[
          {
            key: "question",
            header: "Question",
            cell: (f) => <span className="font-medium">{f.question}</span>,
          },
          { key: "category", header: "Category", hideOnMobile: true, cell: (f) => f.category },
          { key: "order", header: "Order", hideOnMobile: true, cell: (f) => f.displayOrder },
          {
            key: "status",
            header: "Status",
            cell: (f) => (
              <Badge variant={f.active ? "success" : "neutral"}>
                {f.active ? "Active" : "Inactive"}
              </Badge>
            ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            cell: (f) => (
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => openEdit(f)}>
                  <Edit size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(f._id)}>
                  <Trash size={16} className="text-[#F05A28]" />
                </Button>
              </div>
            ),
          },
        ]}
        mobileCard={(f) => (
          <div className="space-y-2">
            <p className="font-medium">{f.question}</p>
            <Badge variant={f.active ? "success" : "neutral"}>{f.active ? "Active" : "Inactive"}</Badge>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(f)}>Edit</Button>
              <Button variant="ghost" size="sm" onClick={() => setDeleteId(f._id)}>
                <Trash size={16} className="text-[#F05A28]" />
              </Button>
            </div>
          </div>
        )}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit FAQ" : "New FAQ"}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Question"
            value={form.question}
            onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
            required
          />
          <Textarea
            label="Answer"
            value={form.answer}
            onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
            rows={5}
            required
          />
          <Input
            label="Category"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          />
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
        title="Delete FAQ"
        description="This will permanently remove the FAQ."
        isLoading={deleting}
      />
    </>
  );
}
