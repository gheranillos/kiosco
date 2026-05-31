"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { isHoodie, type Product } from "@/lib/products";
import {
  cartLineId,
  type ProductFit,
  type ProductSize,
} from "@/lib/shop-options";

export type CartItem = {
  lineId: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  size: ProductSize;
  /** Solo camisetas; hoodies tienen un único corte. */
  fit?: ProductFit;
};

export type AddToCartOptions = {
  quantity?: number;
  size?: ProductSize;
  fit?: ProductFit;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, options?: AddToCartOptions) => void;
  removeItem: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "kiosco_cart_v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((acc, it) => acc + it.quantity, 0);
    const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    const addItem = (product: Product, options?: AddToCartOptions) => {
      const quantity = options?.quantity ?? 1;
      const size = options?.size ?? "M";
      const hoodie = isHoodie(product);
      const fit = hoodie ? undefined : (options?.fit ?? "regular");
      const lineId = cartLineId(product.slug, size, fit ?? "regular", { hoodie });

      setItems((prev) => {
        const existing = prev.find((it) => it.lineId === lineId);
        if (existing) {
          return prev.map((it) =>
            it.lineId === lineId
              ? { ...it, quantity: it.quantity + quantity }
              : it
          );
        }
        return [
          ...prev,
          {
            lineId,
            slug: product.slug,
            title: product.title,
            image: product.image ?? product.images?.[0] ?? "",
            price: product.price,
            quantity,
            size,
            ...(fit ? { fit } : {}),
          },
        ];
      });
      setIsOpen(true);
    };

    const removeItem = (lineId: string) => {
      setItems((prev) => prev.filter((it) => it.lineId !== lineId));
    };

    const setQuantity = (lineId: string, quantity: number) => {
      setItems((prev) => {
        if (quantity <= 0) return prev.filter((it) => it.lineId !== lineId);
        return prev.map((it) => (it.lineId === lineId ? { ...it, quantity } : it));
      });
    };

    const clear = () => setItems([]);

    return {
      items,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      setQuantity,
      clear,
      count,
      subtotal,
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

