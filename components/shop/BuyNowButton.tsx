"use client";

import { useRouter, useParams } from "next/navigation";

import { useCart } from "@/components/shop/cart-context";
import { useProductSelection } from "@/components/shop/product-selection-context";
import { getProductBySlug, isHoodie, isInStock } from "@/lib/products";

export function BuyNowButton() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { addItem, closeCart } = useCart();
  const { size, fit } = useProductSelection();
  const product = getProductBySlug(params?.slug ?? "");
  const inStock = product ? isInStock(product) : false;

  const handleClick = () => {
    if (!product || !inStock) {
      return;
    }
    addItem(
      product,
      isHoodie(product) ? { quantity: 1, size } : { quantity: 1, size, fit }
    );
    closeCart();
    router.push("/checkout");
  };

  if (!inStock) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="block w-full rounded-full bg-stone-900 py-4 text-center text-sm font-bold uppercase text-stone-100 transition hover:scale-[1.02] hover:bg-stone-800"
    >
      Quiero esta pieza
    </button>
  );
}

export default BuyNowButton;
