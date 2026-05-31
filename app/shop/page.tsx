import { redirect } from "next/navigation";

import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { FooterSection } from "@/components/ui/footer";
import { products } from "@/lib/products";

const LISTING_SLUGS = [
  "mom-im-an-artist",
  "fuck-i-want-to-creative",
  "created-not-aproved",
  "normal-never-built-anything",
];

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
          <img
            src={images[0]}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative hidden h-full overflow-hidden md:block">
          <img
            src={images[1]}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative hidden h-full overflow-hidden md:block">
          <img
            src={images[2]}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
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
          <img
            src={images[0]}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative hidden h-full overflow-hidden md:block">
          <img
            src={images[1]}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
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
  if (!shopEnabled) redirect("/#preregistro");

  const listing = LISTING_SLUGS.map((slug) => products.find((p) => p.slug === slug)).filter(
    (p): p is (typeof products)[number] => Boolean(p)
  );

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-100 selection:bg-stone-100 selection:text-stone-950">
      <section
        className="relative w-full overflow-hidden"
        style={{ height: "75vh", minHeight: "60vh" }}
      >
        <img
          src="/kscopage1.jpg"
          alt="Kiosco Drop 001"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: FADE_OVERLAY }}
          aria-hidden="true"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
          <p
            className="text-[11px] font-semibold uppercase text-white"
            style={{ letterSpacing: "0.2em" }}
          >
            Drop · 001
          </p>
          <h1
            className="mt-2 font-bold uppercase leading-none text-white"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            Shop
          </h1>
          <p className="mt-3 text-[13px] text-white/70">50 unidades. Sin restock.</p>
        </div>
      </section>

      <section className="bg-[#0c0a09]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {listing.map((p) => {
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
  );
}
