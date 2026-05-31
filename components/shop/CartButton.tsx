"use client";

import { ShoppingBagIcon } from "lucide-react";

import { useCart } from "@/components/shop/cart-context";
import { cn } from "@/lib/utils";

export function CartButton({
  className = "",
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const { openCart, count } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className={cn(
        "relative inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-full border px-3 py-2 transition",
        variant === "dark"
          ? "border-stone-700/60 bg-stone-950/30 text-stone-100 hover:bg-stone-900/50"
          : "border-stone-300 bg-white/80 text-stone-900 hover:bg-stone-100/90",
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

