import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase-server";
import { paypalCaptureOrder } from "@/lib/paypal";

function normalizePayPalOrderId(raw: string): string {
  const t = raw.trim();
  try {
    return decodeURIComponent(t);
  } catch {
    return t;
  }
}

export async function POST(req: Request) {
  let body: { paypalOrderId?: string };
  try {
    body = (await req.json()) as { paypalOrderId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const paypalOrderId = normalizePayPalOrderId(String(body.paypalOrderId || ""));
  if (!paypalOrderId) {
    return NextResponse.json({ error: "Missing paypalOrderId" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServerClient();

    const { data: orderRow, error: findErr } = await supabase
      .from("orders")
      .select("id,status,paypal_order_id")
      .eq("paypal_order_id", paypalOrderId)
      .maybeSingle();

    if (findErr) {
      return NextResponse.json({ error: findErr.message }, { status: 500 });
    }

    if (!orderRow) {
      return NextResponse.json(
        {
          error:
            "No encontramos esta orden en nuestra base. Si el cargo apareció en PayPal, escríbenos con una captura del pago.",
        },
        { status: 404 }
      );
    }

    if (orderRow.status === "paid") {
      return NextResponse.json({ ok: true, alreadyProcessed: true });
    }

    const result = await paypalCaptureOrder(paypalOrderId);

    if (result.duplicate) {
      const { data: updated, error: upErr } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", orderRow.id)
        .select("id");

      if (upErr) {
        return NextResponse.json({ error: upErr.message }, { status: 500 });
      }
      if (!updated?.length) {
        return NextResponse.json(
          { error: "No se pudo actualizar el estado de la orden." },
          { status: 500 }
        );
      }
      return NextResponse.json({ ok: true, note: "duplicate_capture" });
    }

    const { data: updated, error } = await supabase
      .from("orders")
      .update({ status: "paid" })
      .eq("id", orderRow.id)
      .eq("paypal_order_id", paypalOrderId)
      .select("id");

    if (error) {
      return NextResponse.json({ error: error.message, capture: result.capture }, { status: 500 });
    }
    if (!updated?.length) {
      return NextResponse.json(
        { error: "No se pudo marcar la orden como pagada en la base de datos." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, capture: result.capture });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
