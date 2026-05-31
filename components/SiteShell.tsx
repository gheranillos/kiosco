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
  /** When false, content starts at top (hero/full-bleed under transparent header). */
  headerOffset?: boolean;
};

/** Full-bleed hero: no top padding (avoids white band under fixed header). */
const HERO_BLEED_PATHS = ["/", "/drop-registro"];

function pathMatches(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(`${base}/`);
}

function isHeroBleed(pathname: string) {
  return HERO_BLEED_PATHS.some((p) => pathMatches(pathname, p));
}

function headerLogoSrc(pathname: string): string {
  if (pathMatches(pathname, "/drop-registro")) {
    return "/kiosco-logo-white.png";
  }
  return "/kiosco-logo-black.png";
}

export function SiteShell({ shopEnabled, children, headerOffset }: Props) {
  const pathname = usePathname();
  const logoSrc = headerLogoSrc(pathname);
  const heroBleed = isHeroBleed(pathname);
  const useDarkHeaderChrome = heroBleed;
  const showHeaderOffset = headerOffset ?? !heroBleed;

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

  const content = showHeaderOffset ? <div className="pt-14">{children}</div> : children;

  if (shopEnabled) {
    return (
      <CartProvider>
        {headerEl}
        <CartDrawer />
        {content}
      </CartProvider>
    );
  }

  return (
    <>
      {headerEl}
      {content}
    </>
  );
}

export default SiteShell;
