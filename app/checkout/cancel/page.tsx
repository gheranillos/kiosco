"use client";

import Link from "next/link";

import { FooterSection } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-stone-100 selection:text-stone-950">
      <div className="mx-auto max-w-3xl px-6 pt-20 pb-16 md:px-10">
        <div className="rounded-[2rem] border border-stone-800 bg-stone-900/20 p-8">
          <p className="text-xs font-semibold uppercase text-stone-500">Pago</p>
          <h1 className="mt-2 text-3xl font-black uppercase leading-none md:text-4xl">
            Pago cancelado
          </h1>
          <p className="mt-4 text-sm leading-6 text-stone-400">
            No se realizó el pago. Puedes intentarlo de nuevo cuando quieras.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              asChild
              className="rounded-full bg-stone-100 text-stone-950 hover:bg-stone-200"
            >
              <Link href="/checkout">Volver a checkout</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-stone-800 bg-stone-950/30 text-stone-200 hover:bg-stone-900/40 hover:text-stone-100"
            >
              <Link href="/shop">Volver al shop</Link>
            </Button>
          </div>
        </div>
      </div>

      <FooterSection />
    </div>
  );
}

