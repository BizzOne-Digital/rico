"use client";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { Edit, Plus, Search, Trash } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatPriceDollars } from "@/lib/utils";
import type { ProductStatus } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface Product {
  _id: string;
  name: string;
  slug: string;
  status: ProductStatus;
  price: number;
  stock: number;
  featuredImage?: string;
  category?: { name: string };
}

const STATUS_VARIANT: Record<ProductStatus, "success" | "warning" | "danger" | "neutral" | "default"> = {
  active: "success",
  draft: "neutral",
  out_of_stock: "warning",
  coming_soon: "default",
  archived: "danger",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ admin: "true", limit: "100" });
    if (search) params.set("search", search);
    if (status) params.set("status", status);

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      toast.success("Product deleted");
      setDeleteId(null);
      fetchProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="Products" description="Manage your product catalog" />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: "", label: "All Statuses" },
            { value: "active", label: "Active" },
            { value: "draft", label: "Draft" },
            { value: "out_of_stock", label: "Out of Stock" },
            { value: "coming_soon", label: "Coming Soon" },
            { value: "archived", label: "Archived" },
          ]}
          className="w-44"
        />
        <Button variant="outline" size="sm" onClick={fetchProducts}>
          <Search size={16} />
          Search
        </Button>
        <Link href="/admin/products/new">
          <Button size="sm">
            <Plus size={16} />
            New Product
          </Button>
        </Link>
      </div>

      <DataTable
        data={products}
        isLoading={loading}
        keyExtractor={(p) => p._id}
        columns={[
          {
            key: "image",
            header: "",
            className: "w-14",
            cell: (p) => (
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-[#EDE9DE]">
                {p.featuredImage ? (
                  <Image src={p.featuredImage} alt={p.name} fill className="object-cover" sizes="40px" />
                ) : null}
              </div>
            ),
          },
          {
            key: "name",
            header: "Name",
            cell: (p) => (
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-[#C8C9C7]">{p.slug}</p>
              </div>
            ),
          },
          {
            key: "category",
            header: "Category",
            hideOnMobile: true,
            cell: (p) => p.category?.name || "—",
          },
          {
            key: "price",
            header: "Price",
            cell: (p) => formatPriceDollars(p.price),
          },
          {
            key: "stock",
            header: "Stock",
            hideOnMobile: true,
            cell: (p) => p.stock,
          },
          {
            key: "status",
            header: "Status",
            cell: (p) => <Badge variant={STATUS_VARIANT[p.status]}>{p.status.replace("_", " ")}</Badge>,
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            cell: (p) => (
              <div className="flex justify-end gap-2">
                <Link href={`/admin/products/${p._id}/edit`}>
                  <Button variant="ghost" size="sm">
                    <Edit size={16} />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(p._id)}>
                  <Trash size={16} className="text-[#F05A28]" />
                </Button>
              </div>
            ),
          },
        ]}
        mobileCard={(p) => (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-[#EDE9DE]">
                {p.featuredImage ? (
                  <Image src={p.featuredImage} alt={p.name} fill className="object-cover" sizes="48px" />
                ) : null}
              </div>
              <div>
                <p className="font-medium text-[#143D2D]">{p.name}</p>
                <p className="text-sm text-[#2D6A4F]">{formatPriceDollars(p.price)}</p>
              </div>
            </div>
            <Badge variant={STATUS_VARIANT[p.status]}>{p.status.replace("_", " ")}</Badge>
            <div className="flex gap-2">
              <Link href={`/admin/products/${p._id}/edit`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">Edit</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setDeleteId(p._id)}>
                <Trash size={16} className="text-[#F05A28]" />
              </Button>
            </div>
          </div>
        )}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        description="This action cannot be undone. The product will be permanently removed."
        isLoading={deleting}
      />
    </>
  );
}
