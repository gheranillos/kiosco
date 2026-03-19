import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase-server";
import { products } from "@/lib/products";

type Body = {
  payment_method: "paypal" | "bolivares" | "binance_pay" | "zinli";
  items: Array<{ slug: string; quantity: number }>;
  name?: string;
  email?: string;
  phone?: string;
};

export async function POST(req: Request) {
  const supabase = getSupabaseServerClient();

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body?.payment_method || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Missing payment_method/items" }, { status: 400 });
  }

  const items = body.items
    .map((it) => ({
      slug: String(it.slug || ""),
      quantity: Number(it.quantity || 0),
    }))
    .filter((it) => it.slug && Number.isFinite(it.quantity) && it.quantity > 0);

  if (items.length === 0) {
    return NextResponse.json({ error: "No valid items" }, { status: 400 });
  }

  // Validate against products list and compute subtotal server-side.
  const itemRows = items.map((it) => {
    const p = products.find((x) => x.slug === it.slug);
    if (!p) return null;
    return {
      product_slug: p.slug,
      title: p.title,
      unit_price: p.price,
      quantity: it.quantity,
      image: p.image ?? p.images?.[0] ?? null,
    };
  });

  if (itemRows.some((r) => !r)) {
    return NextResponse.json({ error: "Unknown product slug" }, { status: 400 });
  }

  const safeRows = itemRows as Array<{
    product_slug: string;
    title: string;
    unit_price: number;
    quantity: number;
    image: string | null;
  }>;

  const subtotal = safeRows.reduce((acc, r) => acc + r.unit_price * r.quantity, 0);

  const status =
    body.payment_method === "paypal" ? "pending_payment" : "pending_verification";

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert([
      {
        status,
        payment_method: body.payment_method,
        currency: "USD",
        subtotal_amount: subtotal,
        name: body.name ?? null,
        email: body.email ?? null,
        phone: body.phone ?? null,
      },
    ])
    .select("id")
    .single();

  if (orderErr || !order) {
    return NextResponse.json(
      { error: orderErr?.message || "Failed to create order" },
      { status: 500 }
    );
  }

  const { error: itemsErr } = await supabase.from("order_items").insert(
    safeRows.map((r) => ({
      order_id: order.id,
      ...r,
    }))
  );

  if (itemsErr) {
    // best-effort cleanup
    await supabase.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: itemsErr.message }, { status: 500 });
  }

  return NextResponse.json({ orderId: order.id });
}

