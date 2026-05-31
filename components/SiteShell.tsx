"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AnimatedLogo } from "@/components/AnimatedLogo";
import { CartProvider } from "@/components/shop/cart-context";
import { CartButton } from "@/components/shop/CartButton";
import { CartDrawer } from "@/components/shop/CartDrawer";

type Props = {
  shopEnabled: boolean;
  children: ReactNode;
};

export function SiteShell({ shopEnabled, children }: Props) {
  const pathname = usePathname();
  const isShop = pathname === "/shop";

  const baseHeaderClass =
    "anim-header fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10 text-sm font-semibold uppercase text-stone-100";
  const headerClass = `${baseHeaderClass} ${isShop ? "bg-transparent" : "bg-stone-950"}`;
  const contentWrapperClass = isShop ? "" : "pt-14";

  const headerEl = (
    <header data-animate-header className={headerClass} aria-label="Navegación">
      <AnimatedLogo lightSrc="/kiosco-logo-white.png" />
      {shopEnabled ? <CartButton /> : null}
    </header>
  );

  if (shopEnabled) {
    return (
      <CartProvider>
        {headerEl}
        <CartDrawer />
        <div className={contentWrapperClass}>{children}</div>
      </CartProvider>
    );
  }

  return (
    <>
      {headerEl}
      <div className={contentWrapperClass}>{children}</div>
    </>
  );
}

export default SiteShell;
