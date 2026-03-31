import Link from "next/link";
import { redirect } from "next/navigation";

import { HorizontalImageStack } from "@/components/HorizontalImageStack";
import { FooterSection } from "@/components/ui/footer";
import { products } from "@/lib/products";

export default function ShopPage() {
  const shopEnabled = process.env.NEXT_PUBLIC_SHOP_ENABLED !== "false";
  if (!shopEnabled) redirect("/#preregistro");

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-stone-100 selection:text-stone-950">
      <section className="relative h-[76vh] min-h-[520px] w-full overflow-hidden border-b border-stone-800 bg-stone-950 md:h-[84vh]">
        <div className="absolute left-6 top-8 z-10 md:left-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
            Kiosco - Drop #001
          </p>
          <h1 className="text-2xl font-black uppercase text-stone-100">Shop</h1>
        </div>
        <HorizontalImageStack />
      </section>

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-10 md:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase text-stone-500">
              Drop #001
            </p>
            <h1 className="text-3xl font-black uppercase leading-none md:text-5xl">
              Shop
            </h1>
            <p className="max-w-xl text-sm leading-6 text-stone-400 md:text-base">
              Selecciona tu pieza. Carrito y checkout vienen en la siguiente fase.
            </p>
          </div>

          <Link
            href="/#preregistro"
            className="inline-flex w-fit items-center justify-center rounded-full border border-stone-800 bg-stone-900/40 px-6 py-3 text-xs font-bold uppercase text-stone-200 transition hover:bg-stone-900/70"
          >
            Ir a preregistro
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/shop/${p.slug}`}
              className="group overflow-hidden rounded-[2rem] border border-stone-800 bg-stone-900/30"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-950">
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>

              <div className="space-y-2 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-black uppercase tracking-tight text-stone-100">
                    {p.title}
                  </h3>
                  <span className="text-xs font-semibold text-stone-300">
                    ${p.price}
                  </span>
                </div>
                <p className="text-xs leading-5 text-stone-400">{p.caption}</p>

                <span className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-stone-100/10 px-4 py-3 text-xs font-bold uppercase text-stone-200 transition group-hover:bg-stone-100/15">
                  Ver producto
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <FooterSection />
    </div>
  );
}

