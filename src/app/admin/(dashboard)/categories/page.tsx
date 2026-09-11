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

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder: number;
  active: boolean;
}

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  displayOrder: 0,
  active: true,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories?admin=true");
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line -- data fetch on mount
    void fetchCategories();
  }, [fetchCategories]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image: cat.image || "",
      displayOrder: cat.displayOrder,
      active: cat.active,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editing ? `/api/categories/${editing._id}` : "/api/categories";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      toast.success(editing ? "Category updated" : "Category created");
      setModalOpen(false);
      fetchCategories();
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
      const res = await fetch(`/api/categories/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      toast.success("Category deleted");
      setDeleteId(null);
      fetchCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="Categories" description="Manage product categories" />

      <div className="mb-6 flex justify-end">
        <Button size="sm" onClick={openCreate}>
          <Plus size={16} />
          New Category
        </Button>
      </div>

      <DataTable
        data={categories}
        isLoading={loading}
        keyExtractor={(c) => c._id}
        columns={[
          { key: "name", header: "Name", cell: (c) => <span className="font-medium">{c.name}</span> },
          { key: "slug", header: "Slug", hideOnMobile: true, cell: (c) => c.slug },
          { key: "order", header: "Order", hideOnMobile: true, cell: (c) => c.displayOrder },
          {
            key: "status",
            header: "Status",
            cell: (c) => (
              <Badge variant={c.active ? "success" : "neutral"}>
                {c.active ? "Active" : "Inactive"}
              </Badge>
            ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            cell: (c) => (
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>
                  <Edit size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(c._id)}>
                  <Trash size={16} className="text-[#F05A28]" />
                </Button>
              </div>
            ),
          },
        ]}
        mobileCard={(c) => (
          <div className="space-y-2">
            <p className="font-medium">{c.name}</p>
            <Badge variant={c.active ? "success" : "neutral"}>{c.active ? "Active" : "Inactive"}</Badge>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(c)}>Edit</Button>
              <Button variant="ghost" size="sm" onClick={() => setDeleteId(c._id)}>
                <Trash size={16} className="text-[#F05A28]" />
              </Button>
            </div>
          </div>
        )}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Category" : "New Category"}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                name: e.target.value,
                slug: editing ? f.slug : slugify(e.target.value),
              }))
            }
            required
          />
          <Input
            label="Slug"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            required
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <ImageField
            label="Category Image"
            folder="products"
            value={form.image}
            onChange={(url) => setForm((f) => ({ ...f, image: url }))}
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
        title="Delete Category"
        description="This will permanently remove the category."
        isLoading={deleting}
      />
    </>
  );
}
