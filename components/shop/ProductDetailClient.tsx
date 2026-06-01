"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import type { Product } from "@/lib/products";
import { getProductBySlug, isHoodie, isInStock, products } from "@/lib/products";
import { useCart } from "@/components/shop/cart-context";
import {
  PRODUCT_FITS,
  PRODUCT_SIZES,
  useProductSelection,
} from "@/components/shop/product-selection-context";
import { fitLabel } from "@/lib/shop-options";

export function ProductDetailClient() {
  const params = useParams<{ slug: string }>();
  const product: Product = getProductBySlug(params?.slug ?? "") ?? products[0];
  const { addItem } = useCart();
  const { size: activeSize, fit: activeFit, setSize: setActiveSize, setFit: setActiveFit } =
    useProductSelection();
  const images = product.images?.length ? product.images : [product.image].filter(Boolean);
  const safeImages = images.length ? images : ["/tshirt1.jpg"];

  const [activeImage, setActiveImage] = useState(0);
  const hoodie = isHoodie(product);
  const inStock = isInStock(product);

  const related = useMemo(
    () => products.filter((p) => p.slug !== product.slug).slice(0, 6),
    [product.slug]
  );

  return (
    <div className="mx-auto max-w-7xl px-6 pt-10 pb-12 md:px-10">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-stone-500 hover:text-stone-900 transition"
        >
          <span className="text-stone-400">←</span>
          Volver al shop
        </Link>
        <Link
          href="/drop-registro"
          className="inline-flex items-center justify-center rounded-full border border-stone-200 bg-stone-50 px-5 py-2.5 text-[11px] font-bold uppercase text-stone-900 transition hover:bg-stone-100"
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
              className="group relative overflow-hidden border border-stone-200 bg-stone-50"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                <img
                  src={src}
                  alt={`${product.title} ${idx + 1}`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                />
              </div>
              <span className="sr-only">Ver imagen {idx + 1}</span>
            </button>
          ))}
        </div>

        <aside className="lg:sticky lg:top-10 h-fit space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-stone-500">Drop #001</p>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black uppercase leading-tight tracking-tight text-stone-900 md:text-3xl">
                {product.title}
              </h1>
              {!inStock ? (
                <span className="rounded-full bg-stone-900 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-stone-100">
                  Sin stock
                </span>
              ) : null}
            </div>
            <p className="text-sm text-stone-600 leading-6">{product.description}</p>
          </div>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="text-lg font-black text-stone-900">${product.price}</p>
            <p className="text-xs text-stone-500 sm:max-w-[min(100%,14rem)] sm:text-right">
              Impuestos y envío calculados en checkout
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {safeImages.slice(0, 6).map((src, idx) => (
                <button
                  key={`${src}-thumb-${idx}`}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`relative overflow-hidden rounded-xl border bg-stone-100 ${
                    idx === activeImage ? "border-stone-900" : "border-stone-200"
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

            {!inStock ? (
              <p className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
                Esta pieza está agotada en el Drop #001. No hay restock.
              </p>
            ) : null}

            {!hoodie && inStock ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-stone-500">Corte</p>
                <div className="grid grid-cols-2 gap-2">
                  {PRODUCT_FITS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setActiveFit(option.id)}
                      className={`h-10 rounded-xl border text-xs font-bold uppercase transition ${
                        activeFit === option.id
                          ? "border-stone-900 bg-stone-900 text-stone-100"
                          : "border-stone-300 bg-white text-stone-500 hover:text-stone-900 hover:border-stone-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {inStock ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-stone-500">Talla</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {PRODUCT_SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setActiveSize(s)}
                      className={`h-10 rounded-xl border text-xs font-bold uppercase transition ${
                        activeSize === s
                          ? "border-stone-900 bg-stone-900 text-stone-100"
                          : "border-stone-300 bg-white text-stone-500 hover:text-stone-900 hover:border-stone-700"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-3">
            <button
              type="button"
              disabled={!inStock}
              onClick={() =>
                addItem(
                  product,
                  hoodie
                    ? { quantity: 1, size: activeSize }
                    : { quantity: 1, size: activeSize, fit: activeFit }
                )
              }
              className="w-full rounded-full bg-stone-900 px-6 py-4 text-sm font-black uppercase text-stone-100 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-stone-900"
            >
              {inStock ? "Add to cart" : "Sin stock"}
            </button>

            <p className="text-[11px] leading-5 text-stone-500">
              {!inStock ? (
                <>Esta prenda no está disponible por ahora.</>
              ) : hoodie ? (
                <>
                  Seleccionaste talla{" "}
                  <span className="font-semibold text-stone-800">{activeSize}</span>.
                </>
              ) : (
                <>
                  Seleccionaste corte{" "}
                  <span className="font-semibold text-stone-800">{fitLabel(activeFit)}</span> ·
                  talla <span className="font-semibold text-stone-800">{activeSize}</span>.
                </>
              )}
            </p>
          </div>

          <div className="divide-y divide-stone-200 rounded-[1.25rem] border border-stone-200 bg-stone-50">
            <details className="group p-4" open>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xs font-bold uppercase text-stone-900">
                Details
                <span className="text-stone-400 transition group-open:rotate-45">+</span>
              </summary>
              <div className="pt-3 text-sm leading-6 text-stone-600">
                <p>{product.caption}</p>
                <p className="mt-2 text-xs text-stone-500">
                  Tela algodón con poliéster suave y duradero. Unisex. Edición limitada.
                </p>
              </div>
            </details>
            <details className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xs font-bold uppercase text-stone-900">
                Size Guide
                <span className="text-stone-400 transition group-open:rotate-45">+</span>
              </summary>
              <div className="pt-3 text-sm leading-6 text-stone-600">
                <div className="overflow-x-auto rounded-xl border border-stone-200">
                  <table className="w-full min-w-[280px] text-left text-xs text-stone-700">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-100 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                        <th className="px-3 py-2">Talla</th>
                        <th className="px-3 py-2">Pecho</th>
                        <th className="px-3 py-2">Cintura</th>
                        <th className="px-3 py-2">Largo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {[
                        { size: "XS", chest: 49, waist: 50, length: 64 },
                        { size: "S", chest: 51, waist: 52, length: 66 },
                        { size: "M", chest: 52, waist: 53, length: 67 },
                        { size: "L", chest: 53, waist: 54, length: 68 },
                        { size: "XL", chest: 57, waist: 58, length: 72 },
                        { size: "XXL", chest: 59, waist: 60, length: 74 },
                      ].map((row) => (
                        <tr key={row.size} className="bg-white">
                          <td className="px-3 py-2 font-bold text-stone-900">{row.size}</td>
                          <td className="px-3 py-2">{row.chest} cm</td>
                          <td className="px-3 py-2">{row.waist} cm</td>
                          <td className="px-3 py-2">{row.length} cm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm text-stone-600">
                  {hoodie
                    ? "Usa tu talla usual. El hoodie tiene un solo corte."
                    : "Usa tu talla usual con corte Regular. Para un fit más amplio, elige Boxy en la misma talla."}
                </p>
              </div>
            </details>
            <details className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xs font-bold uppercase text-stone-900">
                Antes de comprar
                <span className="text-stone-400 transition group-open:rotate-45">+</span>
              </summary>
              <div className="pt-3 space-y-4 text-sm leading-6 text-stone-600">
                <h2 className="text-base font-black uppercase tracking-tight text-stone-900">
                  Antes de comprar, entiende esto
                </h2>
                <p>
                  Kiosco no es ropa hecha en masa.
                  <br />
                  Es ropa hecha por artistas para gente que no encaja.
                </p>
                <p>
                  Cada drop es limitado.
                  <br />
                  Cada pieza tiene intención.
                  <br />
                  Si llegaste tarde… ya fue.
                </p>
                <h3 className="text-xs font-bold uppercase tracking-wide text-stone-800">
                  No somos una marca normal
                </h3>
                <p>
                  No producimos en volumen infinito.
                  <br />
                  No repetimos diseños por presión.
                  <br />
                  No seguimos tendencias.
                </p>
                <p>
                  Si algo te gusta, no lo pienses mucho.
                  <br />
                  Aquí las cosas no duran.
                </p>
                <h3 className="text-xs font-bold uppercase tracking-wide text-stone-800">
                  Cada prenda tiene proceso
                </h3>
                <p>
                  Diseñamos, probamos, fallamos y volvemos a crear.
                  <br />
                  Lo que compras no es solo tela, es proceso.
                </p>
                <h3 className="text-xs font-bold uppercase tracking-wide text-stone-800">
                  Reglas claras
                </h3>
                <ul className="list-disc space-y-1 pl-5 text-stone-600">
                  <li>Todos los drops son limitados</li>
                  <li>No garantizamos reposición de productos</li>
                  <li>No realizamos cambios por talla</li>
                  <li>Solo aplican cambios por defectos de fábrica</li>
                  <li>Los precios pueden cambiar sin previo aviso</li>
                </ul>
              </div>
            </details>
            <details className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xs font-bold uppercase text-stone-900">
                Pagos y envíos
                <span className="text-stone-400 transition group-open:rotate-45">+</span>
              </summary>
              <div className="pt-3 space-y-3 text-sm leading-6 text-stone-600">
                <p>
                  Aceptamos pagos mediante Zinli, pago móvil, Binance y otros métodos disponibles a
                  consultar.
                </p>
                <p>
                  Realizamos envíos a nivel nacional.
                  <br />
                  El tiempo de entrega estimado es de 2 a 5 días hábiles.
                </p>
                <p>No nos hacemos responsables por retrasos de la empresa de envíos.</p>
              </div>
            </details>
          </div>
        </aside>
      </div>

      <div className="mt-14 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-black uppercase tracking-tight text-stone-900">
            Más del drop
          </h2>
          <Link
            href="/"
            className="text-xs font-semibold uppercase text-stone-500 hover:text-stone-900 transition"
          >
            Ver todo
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {related.map((p) => (
            <Link
              key={p.slug}
              href={`/shop/${p.slug}`}
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-stone-50"
            >
              <div className="relative aspect-square overflow-hidden bg-stone-100">
                <img
                  src={p.images[0] ?? p.image}
                  alt={p.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-3">
                <p className="text-[11px] font-black uppercase tracking-tight text-stone-900">
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
