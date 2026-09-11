"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import type { ProductInput } from "@/lib/validators";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ProductInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error);
      toast.success("Product created");
      router.push("/admin/products");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="New Product" description="Add a new product to your catalog" />
      <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
    </>
  );
}
