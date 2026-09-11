"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import type { ProductInput } from "@/lib/validators";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [initialData, setInitialData] = useState<Partial<ProductInput> & { _id?: string }>();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          const p = res.data;
          setInitialData({
            _id: p._id,
            name: p.name,
            slug: p.slug,
            sku: p.sku,
            npn: p.npn,
            category: p.category?._id || p.category,
            status: p.status,
            shortDescription: p.shortDescription,
            description: p.description,
            price: p.price,
            compareAtPrice: p.compareAtPrice,
            size: p.size,
            format: p.format,
            ingredients: p.ingredients,
            benefits: p.benefits,
            suggestedUse: p.suggestedUse,
            warnings: p.warnings,
            images: p.images,
            featuredImage: p.featuredImage,
            stock: p.stock,
            trackInventory: p.trackInventory,
            featured: p.featured,
            tags: p.tags,
            seo: p.seo,
            displayOrder: p.displayOrder,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: ProductInput) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error);
      toast.success("Product updated");
      router.push("/admin/products");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-sm text-[#2D6A4F]">Loading product...</div>;
  }

  return (
    <>
      <PageHeader title="Edit Product" description="Update product details" />
      <ProductForm initialData={initialData} onSubmit={handleSubmit} isLoading={isLoading} />
    </>
  );
}
