"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash } from "@/components/icons";
import { useCartStore } from "@/store/cart";
import { formatPriceDollars } from "@/lib/utils";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-obsidian/60 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col border-l border-deep-forest/50 bg-[#161a18] text-warm-white shadow-2xl"
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-deep-forest/50 px-6 py-4">
              <h2 className="font-serif text-xl text-warm-white">Your Cart</h2>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="rounded-full p-2 text-warm-white hover:bg-deep-forest/40"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <p className="py-12 text-center text-metallic-silver">Your cart is empty</p>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.productId} className="flex gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-obsidian">
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <Link
                          href={`/shop/${item.slug}`}
                          onClick={() => setCartOpen(false)}
                          className="font-medium text-warm-white hover:text-electric"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-metallic-silver">{formatPriceDollars(item.price)}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="rounded-full border border-deep-forest/60 p-1 hover:border-electric"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="rounded-full border border-deep-forest/60 p-1 hover:border-electric"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="ml-auto rounded-full p-1 text-burnt-orange hover:bg-burnt-orange/10"
                            aria-label="Remove item"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-deep-forest/50 px-6 py-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-metallic-silver">Subtotal</span>
                  <span className="font-semibold text-electric">{formatPriceDollars(subtotal)}</span>
                </div>
                <Link href="/checkout" onClick={() => setCartOpen(false)}>
                  <Button className="w-full">Checkout</Button>
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
