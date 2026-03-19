"use client";

import { ShoppingBagIcon } from "lucide-react";

import { useCart } from "@/components/shop/cart-context";
import { cn } from "@/lib/utils";

export function CartButton({ className = "" }: { className?: string }) {
  const { openCart, count } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full border border-stone-800 bg-stone-950/40 px-3 py-2 text-stone-100 transition hover:bg-stone-900/40",
        className
      )}
      aria-label="Abrir carrito"
    >
      <ShoppingBagIcon className="size-4" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-100 px-1 text-[11px] font-black text-stone-950">
          {count}
        </span>
      )}
    </button>
  );
}

