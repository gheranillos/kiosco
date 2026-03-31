type ManualPaymentNotificationInput = {
  orderId: string;
  method: string;
  reference?: string | null;
  proofPath: string;
  amount?: number | null;
  currency?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
};

function trimOrNull(v: string | undefined): string | null {
  const t = String(v ?? "").trim();
  return t ? t : null;
}

function parseRecipients(raw: string | undefined): string[] {
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

export async function sendManualPaymentEmailNotification(
  input: ManualPaymentNotificationInput
): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = trimOrNull(process.env.RESEND_API_KEY);
  const from = trimOrNull(process.env.NOTIFY_EMAIL_FROM);
  const to = parseRecipients(process.env.NOTIFY_EMAIL_TO);

  if (!apiKey || !from || to.length === 0) {
    return { sent: false, reason: "missing_email_env" };
  }

  const supabaseUrl = trimOrNull(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const proofUrl = supabaseUrl
    ? `${supabaseUrl}/storage/v1/object/public/payment-proofs/${input.proofPath}`
    : input.proofPath;

  const amountText = formatAmount(input.amount, input.currency);
  const safeMethod = input.method || "manual";
  const subject = `Nuevo comprobante por revisar (${safeMethod}) - Orden ${input.orderId}`;

  const lines = [
    "Nuevo pago manual pendiente de verificacion.",
    "",
    `Orden: ${input.orderId}`,
    `Metodo: ${safeMethod}`,
    `Monto: ${amountText}`,
    `Referencia: ${input.reference || "N/A"}`,
    `Cliente: ${input.customerName || "N/A"}`,
    `Email cliente: ${input.customerEmail || "N/A"}`,
    `Comprobante: ${proofUrl}`,
  ];

  const payload = {
    from,
    to,
    subject,
    text: lines.join("\n"),
  };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      return { sent: false, reason: `resend_error:${response.status}:${errText}` };
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return { sent: false, reason: `network_error:${msg}` };
  }

  return { sent: true };
}
