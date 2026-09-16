"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";
import { formatPriceDollars } from "@/lib/utils";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Minus, Plus, Trash } from "@/components/icons";
const isStripeConfigured = () => !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export function CartContent() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore((s) => s.subtotal());
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [shipping, setShipping] = useState({ address: "", city: "", state: "", zip: "", country: "US" });

  const handleCheckout = async () => {
    if (!isStripeConfigured()) {
      toast.error("Stripe is not configured. Add environment variables to enable checkout.");
      return;
    }

    if (!customer.name || !customer.email || !shipping.address || !shipping.city || !shipping.state || !shipping.zip) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          customer,
          shipping,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) {
        clearCart();
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-metallic-silver">Your cart is empty.</p>
        <Link href="/shop" className="mt-6 inline-block">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div>
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.productId} className="surface-card flex gap-4 rounded-2xl p-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-obsidian">
                <ProductImage src={item.image} alt={item.name} fill sizes="96px" />
              </div>
              <div className="flex flex-1 flex-col">
                <Link href={`/shop/${item.slug}`} className="font-medium text-warm-white hover:text-electric">
                  {item.name}
                </Link>
                <p className="text-sm text-metallic-silver">{formatPriceDollars(item.price)}</p>
                <div className="mt-2 flex items-center gap-2 text-warm-white">
                  <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="rounded-full border border-deep-forest/60 p-1 hover:border-electric">
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="rounded-full border border-deep-forest/60 p-1 hover:border-electric">
                    <Plus size={14} />
                  </button>
                  <button type="button" onClick={() => removeItem(item.productId)} className="ml-auto text-burnt-orange">
                    <Trash size={16} />
                  </button>
                </div>
              </div>
              <p className="font-semibold text-electric">{formatPriceDollars(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-6">
        <div className="surface-card rounded-2xl p-6">
          <h2 className="font-serif text-xl text-warm-white">Order Summary</h2>
          <div className="mt-4 flex justify-between text-sm text-warm-white">
            <span className="text-metallic-silver">Subtotal</span>
            <span className="font-semibold">{formatPriceDollars(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs text-metallic-silver">Shipping and tax calculated at checkout</p>
        </div>

        <div className="surface-card rounded-2xl p-6 space-y-4">
          <h3 className="font-medium text-warm-white">Customer Information</h3>
          <Input label="Full Name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} required />
          <Input label="Email" type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} required />
          <Input label="Phone" type="tel" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
        </div>

        <div className="surface-card rounded-2xl p-6 space-y-4">
          <h3 className="font-medium text-warm-white">Shipping Address</h3>
          <Input label="Address" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} required />
            <Input label="State" value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} required />
          </div>
          <Input label="ZIP Code" value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} required />
        </div>

        {!isStripeConfigured() && (
          <div className="rounded-xl border border-burnt-orange/30 bg-burnt-orange/5 p-4 text-sm text-burnt-orange">
            Stripe is not configured. Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable checkout.
          </div>
        )}

        <Button onClick={handleCheckout} isLoading={loading} size="lg" className="w-full" disabled={!isStripeConfigured()}>
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
