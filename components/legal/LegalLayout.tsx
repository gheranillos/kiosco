import Link from "next/link";
import type { ReactNode } from "react";

import { FooterSection } from "@/components/ui/footer";

type LegalLayoutProps = {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
};

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-stone-900">
      <main className="mx-auto max-w-3xl px-6 pt-16 pb-24 md:px-10 md:pt-24 md:pb-32">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-stone-500 transition hover:text-stone-900"
        >
          <span className="text-stone-400">←</span>
          Volver al inicio
        </Link>

        <h1 className="mt-8 text-4xl font-bold uppercase leading-none text-stone-900 md:text-5xl">
          {title}
        </h1>

        {lastUpdated ? (
          <p className="mt-3 text-xs uppercase text-stone-500">
            Última actualización: {lastUpdated}
          </p>
        ) : null}

        <div className="legal-prose mt-12 space-y-5 text-sm leading-7 text-stone-700">
          {children}
        </div>
      </main>

      <FooterSection />
    </div>
  );
}

export default LegalLayout;
