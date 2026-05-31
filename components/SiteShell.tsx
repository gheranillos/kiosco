"use client";

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
  const headerClass =
    "anim-header fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10 text-sm font-semibold uppercase text-stone-100 bg-stone-950";

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
        <div className="pt-14">{children}</div>
      </CartProvider>
    );
  }

  return (
    <>
      {headerEl}
      <div className="pt-14">{children}</div>
    </>
  );
}

export default SiteShell;
