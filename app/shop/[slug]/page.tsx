import { FooterSection } from "@/components/ui/footer";
import { ProductDetailClient } from "@/components/shop/ProductDetailClient";
import { products } from "@/lib/products";
import { redirect } from "next/navigation";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const shopEnabled = process.env.NEXT_PUBLIC_SHOP_ENABLED !== "false";
  if (!shopEnabled) redirect("/#preregistro");

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-stone-100 selection:text-stone-950">
      <ProductDetailClient />

      <FooterSection />
    </div>
  );
}

