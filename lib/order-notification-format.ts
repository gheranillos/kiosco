export type OrderItemNotification = {
  title: string;
  quantity: number;
  unit_price: number;
  product_slug?: string | null;
};

export function formatOrderItemsLines(items: OrderItemNotification[]): string[] {
  if (!items.length) {
    return ["(sin articulos en el pedido)"];
  }

  return items.map((it) => {
    const qty = Number(it.quantity) || 1;
    const unit = Number(it.unit_price) || 0;
    const lineTotal = unit * qty;
    const title = String(it.title || it.product_slug || "Producto").trim();
    return `• ${title} × ${qty} — $${lineTotal.toFixed(2)}`;
  });
}

export function formatOrderItemsBlock(
  items: OrderItemNotification[],
  options?: { heading?: string }
): string {
  const heading = options?.heading ?? "Pedido:";
  const lines = formatOrderItemsLines(items);
  return [heading, ...lines].join("\n");
}
