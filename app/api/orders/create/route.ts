import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase-server";
import { products } from "@/lib/products";

type Body = {
  payment_method: "paypal" | "bolivares" | "binance_pay" | "zinli";
  items: Array<{ slug: string; quantity: number }>;
  name?: string;
  email?: string;
  phone?: string;
  address_line?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  shipping_method?: string;
};

export async function POST(req: Request) {
  try {
    let body: Body;
    try {
      body = (await req.json()) as Body;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (!body?.payment_method || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Missing payment_method/items" }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

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

    const trimOrNull = (v: string | undefined) => {
      const t = String(v ?? "").trim();
      return t ? t : null;
    };

    /** Si la tabla `orders` aún no tiene columnas de envío, guardamos tel + dirección en `phone`. */
    const legacyPhoneWithShipping = (): string | null => {
      const tel = String(body.phone ?? "").trim();
      const addrParts = [
        body.address_line?.trim(),
        [body.city?.trim(), body.state?.trim()].filter(Boolean).join(", "),
        body.zip_code?.trim(),
        body.shipping_method?.trim()
          ? `Envío: ${body.shipping_method}`
          : "",
      ].filter(Boolean);
      const addrBlock = addrParts.join(" · ");
      if (tel && addrBlock) return `${tel} | ${addrBlock}`;
      if (tel) return tel;
      if (addrBlock) return addrBlock;
      return null;
    };

    const missingShippingColumnsError = (msg: string) => {
      const m = msg.toLowerCase();
      return (
        m.includes("address_line") ||
        m.includes("schema cache") ||
        (m.includes("column") && m.includes("does not exist"))
      );
    };

    const rowBase = {
      status,
      payment_method: body.payment_method,
      currency: "USD",
      subtotal_amount: subtotal,
      name: trimOrNull(body.name),
      email: trimOrNull(body.email),
      phone: trimOrNull(body.phone),
    };

    const rowExtended = {
      ...rowBase,
      address_line: trimOrNull(body.address_line),
      city: trimOrNull(body.city),
      state: trimOrNull(body.state),
      zip_code: trimOrNull(body.zip_code),
      shipping_method: trimOrNull(body.shipping_method),
    };

    let order: { id: string } | null = null;
    let orderErr: { message: string } | null = null;

    const first = await supabase
      .from("orders")
      .insert([rowExtended])
      .select("id")
      .single();

    if (first.error && missingShippingColumnsError(first.error.message)) {
      const legacy = await supabase
        .from("orders")
        .insert([
          {
            ...rowBase,
            phone: legacyPhoneWithShipping(),
          },
        ])
        .select("id")
        .single();
      order = legacy.data;
      orderErr = legacy.error;
    } else {
      order = first.data;
      orderErr = first.error;
    }

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
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
