"use client";

import Link from "next/link";
import { MinusIcon, PlusIcon, ShoppingBagIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/shop/cart-context";

export function CartDrawer() {
  const { items, isOpen, closeCart, setQuantity, removeItem, count, subtotal, clear } =
    useCart();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (!open ? closeCart() : null)}>
      <SheetContent
        side="right"
        className="border-stone-800 bg-stone-950 text-stone-100"
      >
        <SheetHeader className="pr-10">
          <SheetTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-stone-100">
            <ShoppingBagIcon className="size-4 text-stone-300" />
            Carrito ({count})
          </SheetTitle>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
          {items.length === 0 ? (
            <div className="mt-10 space-y-3 text-center">
              <p className="text-sm font-semibold text-stone-300">
                Tu carrito está vacío
              </p>
              <p className="text-xs leading-5 text-stone-500">
                Agrega una prenda para empezar.
              </p>
              <Button asChild className="rounded-full bg-stone-100 text-stone-950 hover:bg-stone-200">
                <Link href="/shop" onClick={closeCart}>
                  Ir al shop
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map((it) => (
                  <div
                    key={it.slug}
                    className="flex gap-3 rounded-2xl border border-stone-800 bg-stone-900/20 p-3"
                  >
                    <div className="h-16 w-16 overflow-hidden rounded-xl bg-stone-950">
                      <img
                        src={it.image}
                        alt={it.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-black uppercase tracking-tight text-stone-100">
                            {it.title}
                          </p>
                          <p className="mt-0.5 text-xs text-stone-400">
                            ${it.price}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(it.slug)}
                          className="text-stone-500 hover:text-stone-100 transition"
                          aria-label="Eliminar"
                        >
                          <Trash2Icon className="size-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setQuantity(it.slug, it.quantity - 1)}
                            className={cn(
                              "inline-flex h-8 w-8 items-center justify-center rounded-full border transition",
                              "border-stone-800 bg-stone-950/30 text-stone-200 hover:bg-stone-900/40"
                            )}
                            aria-label="Menos"
                          >
                            <MinusIcon className="size-4" />
                          </button>

                          <span className="w-8 text-center text-xs font-bold text-stone-200">
                            {it.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => setQuantity(it.slug, it.quantity + 1)}
                            className={cn(
                              "inline-flex h-8 w-8 items-center justify-center rounded-full border transition",
                              "border-stone-800 bg-stone-950/30 text-stone-200 hover:bg-stone-900/40"
                            )}
                            aria-label="Más"
                          >
                            <PlusIcon className="size-4" />
                          </button>
                        </div>

                        <p className="text-xs font-semibold text-stone-200">
                          ${(it.price * it.quantity).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 rounded-2xl border border-stone-800 bg-stone-900/20 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase text-stone-400">
                    Subtotal
                  </span>
                  <span className="font-black text-stone-100">
                    ${subtotal.toFixed(0)}
                  </span>
                </div>
                <p className="mt-2 text-[11px] leading-5 text-stone-500">
                  Checkout y métodos de pago se conectan en la siguiente fase.
                </p>

                <div className="mt-4 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-full border-stone-800 bg-stone-950/30 text-stone-200 hover:bg-stone-900/40 hover:text-stone-100"
                    onClick={clear}
                  >
                    Vaciar
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 rounded-full bg-stone-100 text-stone-950 hover:bg-stone-200"
                    onClick={closeCart}
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

