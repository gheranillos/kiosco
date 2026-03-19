import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase-server";
import { paypalCaptureOrder } from "@/lib/paypal";

export async function POST(req: Request) {
  const supabase = getSupabaseServerClient();

  let body: { paypalOrderId?: string };
  try {
    body = (await req.json()) as { paypalOrderId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const paypalOrderId = String(body.paypalOrderId || "").trim();
  if (!paypalOrderId) {
    return NextResponse.json({ error: "Missing paypalOrderId" }, { status: 400 });
  }

  const capture = await paypalCaptureOrder(paypalOrderId);

  const { error } = await supabase
    .from("orders")
    .update({ status: "paid" })
    .eq("paypal_order_id", paypalOrderId);

  if (error) {
    return NextResponse.json({ error: error.message, capture }, { status: 500 });
  }

  return NextResponse.json({ ok: true, capture });
}

