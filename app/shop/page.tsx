import { redirect } from "next/navigation";

import { HeroSection } from "@/components/HeroSection";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { FooterSection } from "@/components/ui/footer";
import { products } from "@/lib/products";

export default function ShopPage() {
  const shopEnabled = process.env.NEXT_PUBLIC_SHOP_ENABLED !== "false";
  if (!shopEnabled) redirect("/#preregistro");

  return (
    <div className="min-h-screen bg-white text-stone-900 selection:bg-stone-900 selection:text-stone-100">
      <HeroSection
        gallery={products}
        primaryCtaHref="/lista-espera"
        showShopCta={false}
      />

      <div className="relative z-10 bg-white">
        <section className="mx-auto max-w-7xl px-6 pt-16 pb-12 md:px-10 md:pt-28 md:pb-20">
          <div className="flex flex-col items-center gap-4 text-center md:gap-5">
            <p className="text-[11px] font-medium uppercase text-stone-500 md:text-xs">
              Drop · 001
            </p>
            <h1 className="text-5xl font-bold uppercase leading-none tracking-tight text-stone-900 md:text-7xl">
              Shop
            </h1>
            <p className="text-[11px] font-medium uppercase text-stone-500 md:text-xs">
              50 unidades.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 md:px-6 md:pb-32">
          <div className="grid grid-cols-2 gap-x-2 gap-y-10 md:grid-cols-4 md:gap-x-3 md:gap-y-14">
            {products.map((p) => {
              const frontSrc = p.images[0] ?? p.image;
              const backSrc = p.images[1] ?? frontSrc;
              return (
                <ShopProductCard
                  key={p.slug}
                  slug={p.slug}
                  title={p.title}
                  price={p.price}
                  frontSrc={frontSrc}
                  backSrc={backSrc}
                />
              );
            })}
          </div>
        </section>

        <FooterSection />
      </div>
    </div>
  );
}
