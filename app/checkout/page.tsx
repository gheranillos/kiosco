"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { FooterSection } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/shop/cart-context";
import { products, type Product } from "@/lib/products";

type PaymentMethod = "paypal" | "bolivares" | "binance_pay" | "zinli";

function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

async function readApiError(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const j = JSON.parse(text) as { error?: string };
    if (typeof j.error === "string" && j.error.trim()) return j.error.trim();
  } catch {
    /* ignore */
  }
  return text.trim() || `Error ${res.status}`;
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [method, setMethod] = useState<PaymentMethod>("paypal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [reference, setReference] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const hydratedItems = useMemo(() => {
    return items
      .map((it) => {
        const p = getProduct(it.slug);
        return { cart: it, product: p };
      })
      .filter((x) => x.product);
  }, [items]);

  const canPay = hydratedItems.length > 0 && subtotal > 0;

  const createOrder = async () => {
    const res = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        payment_method: method,
        items: hydratedItems.map(({ cart, product }) => ({
          slug: product!.slug,
          quantity: cart.quantity,
        })),
      }),
    });
    if (!res.ok) throw new Error(await readApiError(res));
    return (await res.json()) as { orderId: string };
  };

  const startPayPal = async (createdOrderId: string) => {
    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ orderId: createdOrderId }),
    });
    if (!res.ok) throw new Error(await readApiError(res));
    const data = (await res.json()) as { approvalUrl: string };
    window.location.href = data.approvalUrl;
  };

  const uploadProof = async () => {
    if (!orderId) throw new Error("Missing orderId");
    if (!proofFile) throw new Error("Missing file");

    const fd = new FormData();
    fd.append("orderId", orderId);
    fd.append("method", method);
    fd.append("reference", reference);
    fd.append("file", proofFile);

    const res = await fetch("/api/orders/upload-proof", { method: "POST", body: fd });
    if (!res.ok) throw new Error(await readApiError(res));
    clear();
    setMessage("Recibimos tu comprobante. Validación en breve.");
  };

  const onPay = async () => {
    setIsSubmitting(true);
    setMessage(null);
    try {
      const { orderId: createdOrderId } = await createOrder();

      if (method === "paypal") {
        await startPayPal(createdOrderId);
        return;
      }
      setOrderId(createdOrderId);
      setMessage("Orden creada. Sigue las instrucciones y sube tu comprobante.");
    } catch (e) {
      setMessage(String((e as Error).message || e));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-stone-100 selection:text-stone-950">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-10 md:px-10">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-stone-500">Drop #001</p>
            <h1 className="text-3xl font-black uppercase leading-none md:text-5xl">
              Checkout
            </h1>
            <p className="max-w-xl text-sm leading-6 text-stone-400 md:text-base">
              Selecciona tu método de pago para completar la orden.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex w-fit items-center justify-center rounded-full border border-stone-800 bg-stone-900/40 px-6 py-3 text-xs font-bold uppercase text-stone-200 transition hover:bg-stone-900/70"
          >
            Volver al shop
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-stone-800 bg-stone-900/20 p-6">
              <h2 className="text-sm font-black uppercase tracking-tight text-stone-100">
                Método de pago
              </h2>

              <div className="mt-4 grid gap-3">
                {(
                  [
                    ["paypal", "PayPal (automático)"],
                    ["bolivares", "Bolívares (manual)"],
                    ["binance_pay", "Binance Pay (manual)"],
                    ["zinli", "Zinli (manual)"],
                  ] as const
                ).map(([id, label]) => (
                  <label
                    key={id}
                    className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-stone-800 bg-stone-950/30 px-4 py-3"
                  >
                    <span className="text-xs font-bold uppercase text-stone-200">
                      {label}
                    </span>
                    <input
                      type="radio"
                      name="method"
                      checked={method === id}
                      onChange={() => setMethod(id)}
                      className="accent-stone-100"
                    />
                  </label>
                ))}
              </div>

              {message && (
                <p className="mt-4 text-xs leading-5 text-amber-200/90">{message}</p>
              )}

              {method !== "paypal" && orderId && (
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-stone-800 bg-stone-950/30 p-4">
                    <p className="text-xs font-semibold uppercase text-stone-400">
                      Instrucciones
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-300">
                      Tu orden es <span className="font-black text-stone-100">{orderId}</span>.
                      Usa este ID como referencia.
                    </p>
                    <p className="mt-2 text-xs leading-5 text-stone-500">
                      {method === "bolivares" &&
                        "Paga por Pago Móvil/transferencia y sube el comprobante."}
                      {method === "binance_pay" &&
                        "Realiza el pago por Binance Pay (o QR) y sube el comprobante."}
                      {method === "zinli" &&
                        "Realiza el pago por Zinli y sube el comprobante."}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase text-stone-400">
                        Referencia (opcional)
                      </label>
                      <input
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        className="w-full rounded-2xl border border-stone-800 bg-stone-950/30 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 outline-none"
                        placeholder="Ej: 000123 / teléfono / nota"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase text-stone-400">
                        Comprobante (imagen)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                        className="block w-full text-xs text-stone-300 file:mr-3 file:rounded-full file:border-0 file:bg-stone-100 file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:text-stone-950"
                      />
                    </div>

                    <Button
                      type="button"
                      disabled={!proofFile || isSubmitting}
                      onClick={async () => {
                        setIsSubmitting(true);
                        setMessage(null);
                        try {
                          await uploadProof();
                        } catch (e) {
                          setMessage(String((e as Error).message || e));
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                      className="rounded-full bg-stone-100 text-stone-950 hover:bg-stone-200"
                    >
                      Enviar comprobante
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-20 h-fit">
            <div className="rounded-[2rem] border border-stone-800 bg-stone-900/20 p-6">
              <h2 className="text-sm font-black uppercase tracking-tight text-stone-100">
                Resumen
              </h2>

              <div className="mt-4 space-y-3">
                {hydratedItems.map(({ cart, product }) => (
                  <div key={product!.slug} className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-xl bg-stone-950">
                      <img
                        src={product!.image}
                        alt={product!.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-black uppercase text-stone-100">
                        {product!.title}
                      </p>
                      <p className="text-xs text-stone-500">
                        {cart.quantity} × ${product!.price}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-stone-200">
                      ${(product!.price * cart.quantity).toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-stone-800 pt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase text-stone-400">Subtotal</span>
                  <span className="font-black text-stone-100">${subtotal.toFixed(0)}</span>
                </div>
                <p className="mt-2 text-[11px] leading-5 text-stone-500">
                  Impuestos y envío se calcularán luego.
                </p>
              </div>

              {message && (
                <p className="mt-4 text-xs leading-5 text-amber-200/90">{message}</p>
              )}

              <div className="mt-5 grid gap-2">
                <Button
                  type="button"
                  disabled={!canPay || isSubmitting || !!orderId}
                  onClick={onPay}
                  className="rounded-full bg-stone-100 text-stone-950 hover:bg-stone-200"
                >
                  {method === "paypal" ? "Pagar con PayPal" : "Crear orden"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-stone-800 bg-stone-950/30 text-stone-200 hover:bg-stone-900/40 hover:text-stone-100"
                  onClick={clear}
                >
                  Vaciar carrito
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <FooterSection />
    </div>
  );
}

