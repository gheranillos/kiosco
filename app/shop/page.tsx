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
      <section className="relative h-[76dvh] min-h-[min(520px,88dvh)] w-full overflow-hidden border-b border-stone-800 bg-stone-950 md:h-[84dvh] md:min-h-[520px]">
        <div className="absolute left-6 top-10 z-10 md:left-10 md:top-8">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-500 md:text-xs">
            Kiosco - Drop #001
          </p>
          <h1 className="text-lg font-bold uppercase tracking-tight text-stone-300 md:text-2xl md:font-black md:text-stone-100">
            Shop
          </h1>
        </div>
        <HorizontalImageStack />
      </section>

      <div className="mx-auto max-w-7xl px-6 pt-10 pb-10 md:px-10 md:pt-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase text-stone-500">
              Drop #001
            </p>
            <h1 className="text-2xl font-black uppercase leading-none text-stone-200 md:text-5xl md:text-stone-100">
              Shop
            </h1>
            <p className="max-w-xl text-xs leading-6 text-stone-500 md:text-sm md:text-stone-400 md:text-base">
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
                  <h3 className="text-[11px] font-semibold uppercase tracking-tight text-stone-400 md:text-sm md:font-black md:text-stone-100">
                    {p.title}
                  </h3>
                  <span className="text-[11px] font-medium text-stone-500 md:text-xs md:font-semibold md:text-stone-300">
                    ${p.price}
                  </span>
                </div>
                <p className="text-[11px] leading-5 text-stone-500 md:text-xs md:text-stone-400">
                  {p.caption}
                </p>

                <span className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-stone-100/10 px-4 py-2.5 text-[10px] font-semibold uppercase text-stone-400 transition group-hover:bg-stone-100/15 md:py-3 md:text-xs md:font-bold md:text-stone-200">
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

