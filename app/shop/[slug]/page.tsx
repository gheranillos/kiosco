import { FooterSection } from "@/components/ui/footer";
import { BuyNowButton } from "@/components/shop/BuyNowButton";
import { ProductDetailClient } from "@/components/shop/ProductDetailClient";
import { products } from "@/lib/products";
import { redirect } from "next/navigation";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const shopEnabled = process.env.NEXT_PUBLIC_SHOP_ENABLED !== "false";
  if (!shopEnabled) redirect("/drop-registro");

  return (
    <div className="min-h-screen bg-white text-stone-900 selection:bg-stone-900 selection:text-stone-100">
      <ProductDetailClient />

      <div className="mx-auto max-w-7xl px-6 pb-12 md:px-10">
        <BuyNowButton />
      </div>

      <FooterSection />
    </div>
  );
}

