import { redirect } from "next/navigation";

import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { FooterSection } from "@/components/ui/footer";
import { products } from "@/lib/products";

export default function ShopPage() {
  const shopEnabled = process.env.NEXT_PUBLIC_SHOP_ENABLED !== "false";
  if (!shopEnabled) redirect("/#preregistro");

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-stone-100 selection:text-stone-950">
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-12 md:px-10 md:pt-28 md:pb-20">
        <div className="flex flex-col items-center gap-4 text-center md:gap-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#d6c8a8] md:text-xs">
            Drop · 001
          </p>
          <h1 className="text-5xl font-bold uppercase leading-none tracking-tight text-stone-100 md:text-7xl">
            Shop
          </h1>
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-stone-400 md:text-xs">
            30 unidades. Sin restock.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
        <div className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 md:gap-x-8 md:gap-y-20">
          {products.map((p, i) => (
            <ShopProductCard
              key={p.slug}
              slug={p.slug}
              title={p.title}
              price={p.price}
              frontSrc={`/shirt${i + 1}front.png`}
              backSrc={`/shirt${i + 1}back.png`}
            />
          ))}
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
