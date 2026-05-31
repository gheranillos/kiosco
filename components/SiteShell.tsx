"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AnimatedLogo } from "@/components/AnimatedLogo";
import { CartProvider } from "@/components/shop/cart-context";
import { CartButton } from "@/components/shop/CartButton";
import { CartDrawer } from "@/components/shop/CartDrawer";

type Props = {
  shopEnabled: boolean;
  children: ReactNode;
};

const DARK_HERO_PATHS = ["/drop-registro"];

function headerLogoSrc(pathname: string): string {
  if (DARK_HERO_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return "/kiosco-logo-white.png";
  }
  return "/kiosco-logo-black.png";
}

export function SiteShell({ shopEnabled, children }: Props) {
  const pathname = usePathname();
  const logoSrc = headerLogoSrc(pathname);
  const useDarkHeaderChrome = !DARK_HERO_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  const headerClass =
    "anim-header fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10 text-sm font-semibold uppercase bg-transparent" +
    (useDarkHeaderChrome ? " text-stone-100" : " text-stone-900");

  const headerEl = (
    <header
      data-animate-header
      data-header-theme={useDarkHeaderChrome ? "dark" : "light"}
      className={headerClass}
      aria-label="Navegación"
    >
      <AnimatedLogo lightSrc={logoSrc} />
      {shopEnabled ? <CartButton variant={useDarkHeaderChrome ? "dark" : "light"} /> : null}
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
