"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/shop/cart-context";

export function CheckoutSuccessClient() {
  const params = useSearchParams();
  const token = params.get("token");
  const { clear } = useCart();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Falta token de PayPal.");
        return;
      }
      try {
        const res = await fetch("/api/paypal/capture", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ paypalOrderId: token }),
        });
        if (!res.ok) throw new Error(await res.text());
        clear();
        setStatus("ok");
      } catch (e) {
        setStatus("error");
        setMessage(String((e as Error).message || e));
      }
    };
    run();
  }, [token, clear]);

  return (
    <div className="rounded-[2rem] border border-stone-800 bg-stone-900/20 p-8">
      <p className="text-xs font-semibold uppercase text-stone-500">Pago</p>
      <h1 className="mt-2 text-3xl font-black uppercase leading-none md:text-4xl">
        {status === "loading" && "Confirmando…"}
        {status === "ok" && "Pago confirmado"}
        {status === "error" && "No se pudo confirmar"}
      </h1>
      <p className="mt-4 text-sm leading-6 text-stone-400">
        {status === "loading" &&
          "Estamos validando el pago con PayPal. No cierres esta pestaña."}
        {status === "ok" &&
          "Listo. Recibimos tu pago. Te contactaremos con los detalles del envío."}
        {status === "error" &&
          (message ??
            "Hubo un problema confirmando el pago. Intenta de nuevo o contáctanos.")}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          asChild
          className="rounded-full bg-stone-100 text-stone-950 hover:bg-stone-200"
        >
          <Link href="/shop">Volver al shop</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-full border-stone-800 bg-stone-950/30 text-stone-200 hover:bg-stone-900/40 hover:text-stone-100"
        >
          <Link href="/#preregistro">Preregistro</Link>
        </Button>
      </div>
    </div>
  );
}

