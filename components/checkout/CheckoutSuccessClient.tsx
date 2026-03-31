"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/shop/cart-context";

async function readApiError(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const j = JSON.parse(text) as { error?: string };
    if (typeof j.error === "string" && j.error.trim()) return j.error.trim();
  } catch {
    /* ignore */
  }
  if (text.trim()) return text.trim().slice(0, 500);
  return `Error del servidor (${res.status}).`;
}

export function CheckoutSuccessClient() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const isManual = params.get("manual") === "1";
  const whatsappUrl = "https://wa.me/584147613621";
  const { clear, closeCart } = useCart();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    closeCart();
    // Intentionally once on mount: drawer overlay (z-50) would block clicks on this page after client navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close cart on success entry only
  }, []);

  useEffect(() => {
    const run = async () => {
      if (isManual) {
        clear();
        setStatus("ok");
        setMessage(
          "Listo. Recibimos tu comprobante y tu pedido quedo registrado para validacion. Si deseas revisar el status contactanos por aca."
        );
        return;
      }

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
        if (!res.ok) throw new Error(await readApiError(res));
        clear();
        setStatus("ok");
      } catch (e) {
        setStatus("error");
        const raw = String((e as Error).message || e);
        setMessage(raw.trim() || "No se pudo confirmar el pago. Intenta de nuevo o contáctanos.");
      }
    };
    run();
  }, [token, clear, isManual]);

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
          (isManual
            ? "Listo. Recibimos tu comprobante y tu pedido quedo registrado para validacion."
            : "Listo. Recibimos tu pago. Te contactaremos con los detalles del envío.")}
        {status === "error" &&
          (message?.trim() ||
            "Hubo un problema confirmando el pago. Intenta de nuevo o contáctanos.")}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          type="button"
          className="rounded-full bg-stone-100 text-stone-950 hover:bg-stone-200"
          onClick={() => {
            closeCart();
            router.push("/shop");
          }}
        >
          Volver al shop
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-full border-stone-800 bg-stone-950/30 text-stone-200 hover:bg-stone-900/40 hover:text-stone-100"
        >
          <Link
            href={isManual ? whatsappUrl : "/#preregistro"}
            target={isManual ? "_blank" : undefined}
            rel={isManual ? "noopener noreferrer" : undefined}
          >
            {isManual ? "Contactar por WhatsApp" : "Preregistro"}
          </Link>
        </Button>
      </div>
    </div>
  );
}

