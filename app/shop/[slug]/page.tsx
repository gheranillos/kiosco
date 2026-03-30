import { FooterSection } from "@/components/ui/footer";
import { ProductDetailClient } from "@/components/shop/ProductDetailClient";
import { products } from "@/lib/products";
import { redirect } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const shopEnabled = process.env.NEXT_PUBLIC_SHOP_ENABLED !== "false";
  if (!shopEnabled) redirect("/#preregistro");

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-stone-100 selection:text-stone-950">
      <ProductDetailClient />

      <div className="mx-auto max-w-7xl px-6 pb-12 md:px-10">
        <Link
          href="/checkout"
          className="w-full rounded-full bg-stone-100 py-4 text-sm font-bold uppercase text-stone-950 text-center transition hover:bg-stone-200 hover:scale-[1.02] block"
        >
          Quiero esta pieza
        </Link>
      </div>

      <FooterSection />
    </div>
  );
}

