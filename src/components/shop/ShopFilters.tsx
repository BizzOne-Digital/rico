"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { BENEFITS } from "@/lib/constants";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface ShopFiltersProps {
  categories: Category[];
}

export function ShopFilters({ categories }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      if (key !== "page") params.delete("page");
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="surface-card w-full min-w-0 space-y-4 rounded-2xl p-4 sm:p-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-electric">Filters</h2>

      <Input
        label="Search"
        name="search"
        placeholder="Search products..."
        defaultValue={searchParams.get("search") || ""}
        onChange={(e) => {
          const val = e.target.value;
          const timeout = setTimeout(() => updateParams("search", val), 400);
          return () => clearTimeout(timeout);
        }}
      />

      <Select
        label="Category"
        name="category"
        options={[
          { value: "", label: "All Categories" },
          ...categories.map((c) => ({ value: c.slug, label: c.name })),
        ]}
        value={searchParams.get("category") || ""}
        onChange={(e) => updateParams("category", e.target.value)}
      />

      <Select
        label="Benefit"
        name="benefit"
        options={[
          { value: "", label: "All Benefits" },
          ...BENEFITS.map((b) => ({ value: b, label: b })),
        ]}
        value={searchParams.get("benefit") || ""}
        onChange={(e) => updateParams("benefit", e.target.value)}
      />

      <Select
        label="Format"
        name="format"
        options={[
          { value: "", label: "All Formats" },
          { value: "Capsules", label: "Capsules" },
          { value: "Oral Drops", label: "Oral Drops" },
          { value: "Powder", label: "Powder" },
          { value: "Beverage", label: "Beverage" },
        ]}
        value={searchParams.get("format") || ""}
        onChange={(e) => updateParams("format", e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Min Price"
          name="minPrice"
          type="number"
          min={0}
          placeholder="0"
          defaultValue={searchParams.get("minPrice") || ""}
          onBlur={(e) => updateParams("minPrice", e.target.value)}
        />
        <Input
          label="Max Price"
          name="maxPrice"
          type="number"
          min={0}
          placeholder="999"
          defaultValue={searchParams.get("maxPrice") || ""}
          onBlur={(e) => updateParams("maxPrice", e.target.value)}
        />
      </div>

      <Select
        label="Sort By"
        name="sort"
        options={[
          { value: "newest", label: "Newest" },
          { value: "featured", label: "Featured" },
          { value: "price-asc", label: "Price: Low to High" },
          { value: "price-desc", label: "Price: High to Low" },
          { value: "name", label: "Name" },
        ]}
        value={searchParams.get("sort") || "newest"}
        onChange={(e) => updateParams("sort", e.target.value)}
      />
    </div>
  );
}
