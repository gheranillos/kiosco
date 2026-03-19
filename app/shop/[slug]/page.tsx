import { notFound } from "next/navigation";

import { FooterSection } from "@/components/ui/footer";
import { ProductDetailClient } from "@/components/shop/ProductDetailClient";
import { getProductBySlug } from "@/lib/products";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-stone-100 selection:text-stone-950">
      <ProductDetailClient product={product} />

      <FooterSection />
    </div>
  );
}

