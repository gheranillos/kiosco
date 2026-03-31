type TelegramNotificationInput = {
  orderId: string;
  method: string;
  reference?: string | null;
  proofUrl: string;
  amount?: number | null;
  currency?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
};

function trimOrNull(v: string | undefined): string | null {
  const t = String(v ?? "").trim();
  return t ? t : null;
}

function parseChatIds(raw: string | undefined): string[] {
  const value = trimOrNull(raw);
  if (!value) return [];
  return value
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function formatAmount(amount?: number | null, currency?: string | null): string {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "N/A";
  const c = String(currency || "USD").toUpperCase();
  return `${amount.toFixed(2)} ${c}`;
}

export async function sendManualPaymentTelegramNotification(
  input: TelegramNotificationInput
): Promise<{ sent: boolean; reason?: string }> {
  const token = trimOrNull(process.env.TELEGRAM_BOT_TOKEN);
  const chatIds = parseChatIds(process.env.TELEGRAM_CHAT_ID);

  if (!token || chatIds.length === 0) {
    return { sent: false, reason: "missing_telegram_env" };
  }

  const amountText = formatAmount(input.amount, input.currency);
  const safeMethod = input.method || "manual";

  const textLines = [
    "🧾 Nuevo pago manual pendiente",
    "",
    `Orden: ${input.orderId}`,
    `Metodo: ${safeMethod}`,
    `Monto: ${amountText}`,
    `Referencia: ${input.reference || "N/A"}`,
    `Cliente: ${input.customerName || "N/A"}`,
    `Email: ${input.customerEmail || "N/A"}`,
    `Comprobante: ${input.proofUrl}`,
  ];

  const endpoint = `https://api.telegram.org/bot${token}/sendMessage`;
  const payloadBase = {
    text: textLines.join("\n"),
    disable_web_page_preview: true,
  };

  try {
    for (const chat_id of chatIds) {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payloadBase, chat_id }),
      });

      if (!res.ok) {
        const errText = await res.text();
        return { sent: false, reason: `telegram_error:${res.status}:${errText}` };
      }
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return { sent: false, reason: `network_error:${msg}` };
  }

  return { sent: true };
}

