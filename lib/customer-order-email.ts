import type { SupabaseClient } from "@supabase/supabase-js";

import { formatOrderItemsBlock, type OrderItemNotification } from "@/lib/order-notification-format";
import {
  getCustomerEmailFrom,
  getSupportWhatsAppUrl,
  sendResendEmail,
} from "@/lib/resend-send";

export type CustomerOrderEmailKind = "paid" | "pending_review";

type OrderRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  payment_method: string | null;
  subtotal_amount: number | null;
  currency: string | null;
  address_line: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  shipping_method: string | null;
};

function shortOrderId(id: string): string {
  return id.replace(/-/g, "").slice(0, 8).toUpperCase();
}

function formatMoney(amount: number | null | undefined, currency: string | null | undefined): string {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "N/A";
  return `$${amount.toFixed(2)} ${String(currency || "USD").toUpperCase()}`;
}

function paymentMethodLabel(method: string | null | undefined): string {
  switch (method) {
    case "paypal":
      return "PayPal";
    case "bolivares":
      return "Pago móvil / transferencia";
    case "binance_pay":
      return "Binance Pay";
    case "zinli":
      return "Zinli";
    default:
      return method || "N/A";
  }
}

function shippingMethodLabel(method: string | null | undefined): string {
  if (!method) return "Por confirmar";
  if (method.toLowerCase() === "mrw") return "MRW";
  if (method.toLowerCase() === "zoom") return "Zoom";
  return method.toUpperCase();
}

function formatShippingAddress(order: OrderRow): string {
  const parts = [
    order.address_line,
    [order.city, order.state].filter(Boolean).join(", "),
    order.zip_code,
  ].filter((p) => p && String(p).trim());

  return parts.length ? parts.join("\n") : "La usaremos la que indicaste en checkout.";
}

function buildEmailBody(args: {
  kind: CustomerOrderEmailKind;
  order: OrderRow;
  items: OrderItemNotification[];
}): { subject: string; text: string } {
  const { order, items, kind } = args;
  const ref = shortOrderId(order.id);
  const firstName = (order.name || "").trim().split(/\s+/)[0] || "outsider";
  const itemsBlock = formatOrderItemsBlock(items, { heading: "Tu pedido:" });
  const total = formatMoney(order.subtotal_amount, order.currency);
  const whatsapp = getSupportWhatsAppUrl();

  const paymentBlock =
    kind === "paid"
      ? [
          "Estado del pago: confirmado.",
          "Tu pedido entra en cola de preparación y despacho.",
        ]
      : [
          "Estado del pago: comprobante recibido, en verificación.",
          "Validamos tu pago en menos de 24 horas hábiles. Te avisamos por este correo o WhatsApp cuando esté confirmado.",
        ];

  const subject =
    kind === "paid"
      ? `Kiosco — Pedido #${ref} confirmado`
      : `Kiosco — Pedido #${ref} recibido`;

  const lines = [
    `Hola ${firstName},`,
    "",
    kind === "paid"
      ? "Gracias por comprar en Kiosco. Este es el resumen de tu pedido."
      : "Recibimos tu pedido y tu comprobante de pago. Este es el resumen:",
    "",
    `Número de pedido: ${ref}`,
    `(referencia interna: ${order.id})`,
    "",
    itemsBlock,
    "",
    `Total: ${total}`,
    `Método de pago: ${paymentMethodLabel(order.payment_method)}`,
    "",
    ...paymentBlock,
    "",
    "Envío (Venezuela, nivel nacional):",
    `• Empresa: ${shippingMethodLabel(order.shipping_method)}`,
    `• Dirección:`,
    formatShippingAddress(order),
    order.phone ? `• Teléfono de contacto: ${order.phone}` : null,
    "• Tiempo estimado: 2 a 5 días hábiles desde que despachamos.",
    "  (En temporada alta puede tardar un poco más; los retrasos de la empresa de envío no dependen de nosotros.)",
    "",
    "Recuerda:",
    "• Drop limitado — sin restock.",
    "• No hacemos cambios por talla.",
    "• Solo cambios por defectos de fábrica (avísanos por WhatsApp dentro de los 7 días posteriores a la entrega).",
    "",
    `¿Dudas? Escríbenos por WhatsApp: ${whatsapp}`,
    "",
    "—",
    "Kiosco · Drop #001",
    "Made by artists, worn by outsiders.",
  ].filter((line): line is string => line !== null);

  return { subject, text: lines.join("\n") };
}

export async function fetchOrderForCustomerEmail(
  supabase: SupabaseClient,
  orderId: string
): Promise<{ order: OrderRow; items: OrderItemNotification[] } | null> {
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .select(
      "id,name,email,phone,payment_method,subtotal_amount,currency,address_line,city,state,zip_code,shipping_method"
    )
    .eq("id", orderId)
    .maybeSingle();

  if (orderErr || !order) return null;

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("title,quantity,unit_price,product_slug")
    .eq("order_id", orderId);

  const items: OrderItemNotification[] = (orderItems ?? []).map((row) => ({
    title: String(row.title ?? ""),
    quantity: Number(row.quantity) || 1,
    unit_price: Number(row.unit_price) || 0,
    product_slug: row.product_slug ?? null,
  }));

  return { order: order as OrderRow, items };
}

export async function sendCustomerOrderEmail(args: {
  supabase: SupabaseClient;
  orderId: string;
  kind: CustomerOrderEmailKind;
}): Promise<{ sent: boolean; reason?: string }> {
  const from = getCustomerEmailFrom();
  if (!from) {
    return { sent: false, reason: "missing_customer_email_from" };
  }

  const ctx = await fetchOrderForCustomerEmail(args.supabase, args.orderId);
  if (!ctx) {
    return { sent: false, reason: "order_not_found" };
  }

  const customerEmail = String(ctx.order.email || "").trim();
  if (!customerEmail) {
    return { sent: false, reason: "missing_customer_email" };
  }

  const { subject, text } = buildEmailBody({
    kind: args.kind,
    order: ctx.order,
    items: ctx.items,
  });

  const replyTo = process.env.NOTIFY_EMAIL_TO?.split(",")[0]?.trim();

  return sendResendEmail({
    from,
    to: customerEmail,
    subject,
    text,
    replyTo: replyTo || undefined,
  });
}
