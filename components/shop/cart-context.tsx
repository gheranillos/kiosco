"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { Product } from "@/lib/products";

export type CartItem = {
  slug: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "kiosco_cart_v1";

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

    const addItem = (product: Product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((it) => it.slug === product.slug);
        if (existing) {
          return prev.map((it) =>
            it.slug === product.slug
              ? { ...it, quantity: it.quantity + quantity }
              : it
          );
        }
        return [
          ...prev,
          {
            slug: product.slug,
            title: product.title,
            image: product.image ?? product.images?.[0] ?? "",
            price: product.price,
            quantity,
          },
        ];
      });
      setIsOpen(true);
    };

    const removeItem = (slug: string) => {
      setItems((prev) => prev.filter((it) => it.slug !== slug));
    };

    const setQuantity = (slug: string, quantity: number) => {
      setItems((prev) => {
        if (quantity <= 0) return prev.filter((it) => it.slug !== slug);
        return prev.map((it) => (it.slug === slug ? { ...it, quantity } : it));
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

