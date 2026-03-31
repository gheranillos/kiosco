import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase-server";
import { paypalCreateOrder } from "@/lib/paypal";

export async function POST(req: Request) {
  let body: { orderId?: string };
  try {
    body = (await req.json()) as { orderId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const orderId = String(body.orderId || "").trim();
  if (!orderId) return NextResponse.json({ error: "Missing orderId" }, { status: 400 });

  try {
    const supabase = getSupabaseServerClient();

    const { data: order, error } = await supabase
      .from("orders")
      .select("id,status,payment_method,currency,subtotal_amount,paypal_order_id")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: error?.message || "Order not found" }, { status: 404 });
    }

    if (order.payment_method !== "paypal") {
      return NextResponse.json({ error: "Order is not PayPal" }, { status: 400 });
    }

    const amount = Number(order.subtotal_amount || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const origin = new URL(req.url).origin;
    const { paypalOrderId, approvalUrl } = await paypalCreateOrder({
      amount: amount.toFixed(2),
      currency: order.currency || "USD",
      returnUrl: `${origin}/checkout/success`,
      cancelUrl: `${origin}/checkout/cancel`,
    });

    const { error: updateErr } = await supabase
      .from("orders")
      .update({ paypal_order_id: paypalOrderId, status: "pending_payment" })
      .eq("id", orderId);

    if (updateErr) {
      return NextResponse.json(
        {
          error:
            `No se pudo guardar paypal_order_id en orders. Verifica que la columna exista. Detalle: ${updateErr.message}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ paypalOrderId, approvalUrl });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

