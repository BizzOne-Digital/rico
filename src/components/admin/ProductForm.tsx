"use client";

import { Button } from "@/components/ui/Button";
import { ImageField } from "@/components/ui/ImageField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { BENEFITS } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import type { ProductInput } from "@/lib/validators";
import type { ProductStatus } from "@/types";
import { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
}

export interface ProductFormProps {
  initialData?: Partial<ProductInput> & { _id?: string };
  onSubmit: (data: ProductInput) => Promise<void>;
  isLoading?: boolean;
}

const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "coming_soon", label: "Coming Soon" },
  { value: "archived", label: "Archived" },
];

const defaultValues: ProductInput = {
  name: "",
  slug: "",
  category: "",
  status: "draft",
  price: 0,
  shortDescription: "",
  description: "",
  benefits: [],
  images: [],
  stock: 0,
  trackInventory: true,
  featured: false,
  tags: [],
  displayOrder: 0,
};

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const [form, setForm] = useState<ProductInput>({ ...defaultValues, ...initialData });
  const [categories, setCategories] = useState<Category[]>([]);
  const [benefitInput, setBenefitInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [autoSlug, setAutoSlug] = useState(!initialData?.slug);

  useEffect(() => {
    fetch("/api/categories?admin=true")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setCategories(res.data);
      })
      .catch(() => {});
  }, []);

  const update = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNameChange = (name: string) => {
    update("name", name);
    if (autoSlug) update("slug", slugify(name));
  };

  const addBenefit = (benefit: string) => {
    if (!benefit || form.benefits?.includes(benefit)) return;
    update("benefits", [...(form.benefits || []), benefit]);
    setBenefitInput("");
  };

  const removeBenefit = (benefit: string) => {
    update("benefits", (form.benefits || []).filter((b) => b !== benefit));
  };

  const addTag = (tag: string) => {
    if (!tag || form.tags?.includes(tag)) return;
    update("tags", [...(form.tags || []), tag]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    update("tags", (form.tags || []).filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-2xl border border-[#EDE9DE] bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2D6A4F]">
          Basic Info
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Product Name"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
          <Input
            label="Slug"
            value={form.slug}
            onChange={(e) => {
              setAutoSlug(false);
              update("slug", e.target.value);
            }}
            required
          />
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            options={categories.map((c) => ({ value: c._id, label: c.name }))}
            placeholder="Select category"
            required
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => update("status", e.target.value as ProductStatus)}
            options={STATUS_OPTIONS}
          />
          <Input
            label="SKU"
            value={form.sku || ""}
            onChange={(e) => update("sku", e.target.value)}
          />
          <Input
            label="NPN"
            value={form.npn || ""}
            onChange={(e) => update("npn", e.target.value)}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-[#EDE9DE] bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2D6A4F]">
          Pricing & Inventory
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => update("price", parseFloat(e.target.value) || 0)}
            required
          />
          <Input
            label="Compare At Price"
            type="number"
            min="0"
            step="0.01"
            value={form.compareAtPrice ?? ""}
            onChange={(e) =>
              update("compareAtPrice", e.target.value ? parseFloat(e.target.value) : undefined)
            }
          />
          <Input
            label="Size"
            value={form.size || ""}
            onChange={(e) => update("size", e.target.value)}
          />
          <Input
            label="Format"
            value={form.format || ""}
            onChange={(e) => update("format", e.target.value)}
          />
          <Input
            label="Stock"
            type="number"
            min="0"
            value={form.stock ?? 0}
            onChange={(e) => update("stock", parseInt(e.target.value) || 0)}
          />
          <Input
            label="Display Order"
            type="number"
            value={form.displayOrder ?? 0}
            onChange={(e) => update("displayOrder", parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-[#143D2D]">
            <input
              type="checkbox"
              checked={form.trackInventory ?? true}
              onChange={(e) => update("trackInventory", e.target.checked)}
              className="rounded border-[#C8C9C7] text-[#55C878] focus:ring-[#55C878]"
            />
            Track Inventory
          </label>
          <label className="flex items-center gap-2 text-sm text-[#143D2D]">
            <input
              type="checkbox"
              checked={form.featured ?? false}
              onChange={(e) => update("featured", e.target.checked)}
              className="rounded border-[#C8C9C7] text-[#55C878] focus:ring-[#55C878]"
            />
            Featured Product
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[#EDE9DE] bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2D6A4F]">
          Descriptions
        </h2>
        <Textarea
          label="Short Description"
          value={form.shortDescription || ""}
          onChange={(e) => update("shortDescription", e.target.value)}
          rows={2}
        />
        <Textarea
          label="Full Description"
          value={form.description || ""}
          onChange={(e) => update("description", e.target.value)}
          rows={6}
        />
        <Textarea
          label="Ingredients"
          value={form.ingredients || ""}
          onChange={(e) => update("ingredients", e.target.value)}
        />
        <Textarea
          label="Suggested Use"
          value={form.suggestedUse || ""}
          onChange={(e) => update("suggestedUse", e.target.value)}
        />
        <Textarea
          label="Warnings"
          value={form.warnings || ""}
          onChange={(e) => update("warnings", e.target.value)}
        />
      </section>

      <section className="rounded-2xl border border-[#EDE9DE] bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2D6A4F]">
          Benefits & Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {(form.benefits || []).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => removeBenefit(b)}
              className="rounded-full bg-[#55C878]/15 px-3 py-1 text-xs font-medium text-[#143D2D] hover:bg-[#55C878]/25"
            >
              {b} ×
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {BENEFITS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => addBenefit(b)}
              className="rounded-full border border-[#EDE9DE] px-3 py-1 text-xs text-[#2D6A4F] hover:border-[#55C878]"
            >
              + {b}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Custom benefit"
            value={benefitInput}
            onChange={(e) => setBenefitInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addBenefit(benefitInput);
              }
            }}
          />
          <Button type="button" variant="outline" size="sm" onClick={() => addBenefit(benefitInput)}>
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {(form.tags || []).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => removeTag(t)}
              className="rounded-full bg-[#EDE9DE] px-3 py-1 text-xs text-[#143D2D] hover:bg-[#C8C9C7]/40"
            >
              {t} ×
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag(tagInput);
              }
            }}
          />
          <Button type="button" variant="outline" size="sm" onClick={() => addTag(tagInput)}>
            Add
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-[#EDE9DE] bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2D6A4F]">
          Images
        </h2>
        <ImageField
          label="Featured Image"
          folder="products"
          value={form.featuredImage || ""}
          onChange={(url) => update("featuredImage", url)}
        />
        <ImageField
          label="Gallery Image"
          folder="products"
          value={form.images?.[0]?.url || ""}
          onChange={(url) =>
            update("images", url ? [{ url, alt: form.name, order: 0 }] : [])
          }
          hint="Primary gallery image"
        />
      </section>

      <section className="rounded-2xl border border-[#EDE9DE] bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2D6A4F]">
          SEO
        </h2>
        <Input
          label="SEO Title"
          value={form.seo?.title || ""}
          onChange={(e) => update("seo", { ...form.seo, title: e.target.value })}
        />
        <Textarea
          label="SEO Description"
          value={form.seo?.description || ""}
          onChange={(e) => update("seo", { ...form.seo, description: e.target.value })}
          rows={2}
        />
      </section>

      <div className="flex justify-end gap-3">
        <Button type="submit" isLoading={isLoading}>
          {initialData?._id ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
