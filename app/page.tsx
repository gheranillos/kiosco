import { redirect } from "next/navigation";

import { HeroSection } from "@/components/HeroSection";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { FooterSection } from "@/components/ui/footer";
import { products } from "@/lib/products";

const FADE_OVERLAY = "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)";

type BlockAProps = { images: [string, string, string]; label: string; headline: string };
type BlockBProps = { images: [string, string]; label: string; headline: string };
type BlockCProps = { image: string; label: string; headline: string };

function EditorialLabel({ label, headline }: { label: string; headline: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
      <p
        className="text-[11px] font-semibold uppercase text-white"
        style={{ letterSpacing: "0.2em" }}
      >
        {label}
      </p>
      <h2
        className="mt-2 font-bold uppercase leading-[0.95] text-white"
        style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
      >
        {headline}
      </h2>
    </div>
  );
}

function BlockA({ images, label, headline }: BlockAProps) {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "70vh" }}>
      <div className="grid h-full grid-cols-1 md:grid-cols-3">
        <div className="relative h-full overflow-hidden">
          <img src={images[0]} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="relative hidden h-full overflow-hidden md:block">
          <img src={images[1]} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="relative hidden h-full overflow-hidden md:block">
          <img src={images[2]} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: FADE_OVERLAY }}
        aria-hidden="true"
      />
      <EditorialLabel label={label} headline={headline} />
    </section>
  );
}

function BlockB({ images, label, headline }: BlockBProps) {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "80vh" }}>
      <div className="grid h-full grid-cols-1 md:grid-cols-[3fr_2fr]">
        <div className="relative h-full overflow-hidden">
          <img src={images[0]} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="relative hidden h-full overflow-hidden md:block">
          <img src={images[1]} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: FADE_OVERLAY }}
        aria-hidden="true"
      />
      <EditorialLabel label={label} headline={headline} />
    </section>
  );
}

function BlockC({ image, label, headline }: BlockCProps) {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "70vh" }}>
      <img
        src={image}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: FADE_OVERLAY }}
        aria-hidden="true"
      />
      <EditorialLabel label={label} headline={headline} />
    </section>
  );
}

export default function ShopPage() {
  const shopEnabled = process.env.NEXT_PUBLIC_SHOP_ENABLED !== "false";
  if (!shopEnabled) redirect("/drop-registro#preregistro");

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

        <BlockA
          images={["/kscopage2.jpg", "/kscopage3.jpg", "/kscopage4.jpg"]}
          label="Kiosco · 2026"
          headline="Made by artists."
        />

        <BlockB
          images={["/kscopage5.png", "/kscopage6.jpg"]}
          label="Drop · 001"
          headline="Worn by outsiders."
        />

        <BlockC
          image="/kscopage7.png"
          label="Lechería · VE"
          headline="Normal never built anything."
        />

        <BlockA
          images={["/kscopage8.jpg", "/kscopage9.jpg", "/kscopage10.jpg"]}
          label="Drop · 001"
          headline="Limited drop. Sin restock."
        />

        <BlockB
          images={["/kscopage11.jpg", "/kscopage12.png"]}
          label="Kiosco · VE"
          headline="Outsiders only."
        />

        <FooterSection />
      </div>
    </div>
  );
}
