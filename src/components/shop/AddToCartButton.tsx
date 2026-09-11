"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cart";
import type { CartItem } from "@/types";

interface AddToCartButtonProps {
  product: {
    productId: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    size?: string;
    format?: string;
  };
  quantity?: number;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AddToCartButton({
  product,
  quantity = 1,
  disabled,
  className,
  size = "md",
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    setLoading(true);
    const item: CartItem = {
      productId: product.productId,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      size: product.size,
      format: product.format,
    };
    addItem(item);
    toast.success(`${product.name} added to cart`);
    setCartOpen(true);
    setLoading(false);
  };

  return (
    <Button
      onClick={handleAdd}
      disabled={disabled || loading}
      isLoading={loading}
      size={size}
      className={className}
    >
      Add to Cart
    </Button>
  );
}
