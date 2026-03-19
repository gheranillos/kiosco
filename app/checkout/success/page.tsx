import { Suspense } from "react";

import { FooterSection } from "@/components/ui/footer";
import { CheckoutSuccessClient } from "@/components/checkout/CheckoutSuccessClient";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-stone-100 selection:text-stone-950">
      <div className="mx-auto max-w-3xl px-6 pt-20 pb-16 md:px-10">
        <Suspense
          fallback={
            <div className="rounded-[2rem] border border-stone-800 bg-stone-900/20 p-8">
              <p className="text-xs font-semibold uppercase text-stone-500">Pago</p>
              <h1 className="mt-2 text-3xl font-black uppercase leading-none md:text-4xl">
                Confirmando…
              </h1>
              <p className="mt-4 text-sm leading-6 text-stone-400">
                Estamos validando el pago con PayPal. No cierres esta pestaña.
              </p>
            </div>
          }
        >
          <CheckoutSuccessClient />
        </Suspense>
      </div>

      <FooterSection />
    </div>
  );
}

