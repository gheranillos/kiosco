"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import type { Product } from "@/lib/products";
import { products } from "@/lib/products";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export function ProductDetailClient({ product }: { product: Product }) {
  const images = product.images?.length ? product.images : [product.image].filter(Boolean);
  const safeImages = images.length ? images : ["/tshirt1.jpg"];

  const [activeImage, setActiveImage] = useState(0);
  const [activeSize, setActiveSize] = useState<(typeof sizes)[number]>("M");

  const related = useMemo(
    () => products.filter((p) => p.slug !== product.slug).slice(0, 6),
    [product.slug]
  );

  return (
    <div className="mx-auto max-w-7xl px-6 pt-10 pb-12 md:px-10">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-stone-400 hover:text-stone-100 transition"
        >
          <span className="text-stone-600">←</span>
          Volver al shop
        </Link>
        <Link
          href="/#preregistro"
          className="inline-flex items-center justify-center rounded-full border border-stone-800 bg-stone-900/40 px-5 py-2.5 text-[11px] font-bold uppercase text-stone-200 transition hover:bg-stone-900/70"
        >
          Preregistro
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr_420px] lg:gap-10">
        <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
          {safeImages.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => setActiveImage(idx)}
              className="group relative overflow-hidden rounded-[2rem] border border-stone-800 bg-stone-900/20"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-950">
                <img
                  src={src}
                  alt={`${product.title} ${idx + 1}`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </div>
              <span className="sr-only">Ver imagen {idx + 1}</span>
            </button>
          ))}
        </div>

        <aside className="lg:sticky lg:top-10 h-fit space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-stone-500">Drop #001</p>
            <h1 className="text-2xl font-black uppercase leading-tight tracking-tight md:text-3xl">
              {product.title}
            </h1>
            <p className="text-sm text-stone-400 leading-6">{product.description}</p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-lg font-black text-stone-100">${product.price}</p>
            <p className="text-xs text-stone-500">Impuestos y envío calculados en checkout</p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {safeImages.slice(0, 6).map((src, idx) => (
                <button
                  key={`${src}-thumb-${idx}`}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`relative overflow-hidden rounded-xl border bg-stone-950 ${
                    idx === activeImage ? "border-stone-200/50" : "border-stone-800"
                  }`}
                >
                  <img
                    src={src}
                    alt={`${product.title} thumbnail ${idx + 1}`}
                    className="h-12 w-12 object-cover"
                  />
                  <span className="sr-only">Seleccionar imagen {idx + 1}</span>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase text-stone-500">Talla</p>
              <div className="grid grid-cols-6 gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setActiveSize(s)}
                    className={`h-10 rounded-xl border text-xs font-bold uppercase transition ${
                      activeSize === s
                        ? "border-stone-200/40 bg-stone-100/10 text-stone-100"
                        : "border-stone-800 bg-stone-950/30 text-stone-400 hover:text-stone-100 hover:border-stone-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              className="w-full rounded-full bg-stone-100 px-6 py-4 text-sm font-black uppercase text-stone-950 transition hover:bg-stone-200"
            >
              Add to cart
            </button>

            <button
              type="button"
              className="w-full rounded-full bg-[#ffc439] px-6 py-4 text-sm font-black uppercase text-stone-950 transition hover:brightness-95"
            >
              Pay with PayPal
            </button>

            <p className="text-[11px] leading-5 text-stone-500">
              Seleccionaste talla{" "}
              <span className="font-semibold text-stone-300">{activeSize}</span>. Carrito y
              checkout se conectan en la siguiente fase.
            </p>
          </div>

          <div className="divide-y divide-stone-800 rounded-[1.25rem] border border-stone-800 bg-stone-900/20">
            <details className="group p-4" open>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xs font-bold uppercase text-stone-200">
                Details
                <span className="text-stone-500 transition group-open:rotate-45">+</span>
              </summary>
              <div className="pt-3 text-sm leading-6 text-stone-400">
                <p>{product.caption}</p>
                <p className="mt-2 text-xs text-stone-500">
                  Fit cómodo. Material premium. Edición limitada.
                </p>
              </div>
            </details>
            <details className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xs font-bold uppercase text-stone-200">
                Size Guide
                <span className="text-stone-500 transition group-open:rotate-45">+</span>
              </summary>
              <div className="pt-3 text-sm leading-6 text-stone-400">
                Usa tu talla usual. Si te gusta oversize, sube 1 talla.
              </div>
            </details>
            <details className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xs font-bold uppercase text-stone-200">
                Shipping, Exchanges & Returns
                <span className="text-stone-500 transition group-open:rotate-45">+</span>
              </summary>
              <div className="pt-3 text-sm leading-6 text-stone-400">
                Envíos calculados en checkout. Cambios sujetos a disponibilidad del drop.
              </div>
            </details>
          </div>
        </aside>
      </div>

      <div className="mt-14 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-black uppercase tracking-tight text-stone-100">
            Más del drop
          </h2>
          <Link
            href="/shop"
            className="text-xs font-semibold uppercase text-stone-400 hover:text-stone-100 transition"
          >
            Ver todo
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {related.map((p) => (
            <Link
              key={p.slug}
              href={`/shop/${p.slug}`}
              className="group overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/20"
            >
              <div className="relative aspect-square overflow-hidden bg-stone-950">
                <img
                  src={p.images[0] ?? p.image}
                  alt={p.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
              </div>
              <div className="p-3">
                <p className="text-[11px] font-black uppercase tracking-tight text-stone-100">
                  {p.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

