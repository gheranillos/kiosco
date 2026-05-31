function trimOrNull(v: string | undefined): string | null {
  const t = String(v ?? "").trim();
  return t ? t : null;
}

export async function sendResendEmail(args: {
  from: string;
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = trimOrNull(process.env.RESEND_API_KEY);
  if (!apiKey) {
    return { sent: false, reason: "missing_resend_api_key" };
  }

  const toList = Array.isArray(args.to) ? args.to : [args.to];
  if (!toList.length || !toList[0]) {
    return { sent: false, reason: "missing_recipient" };
  }

  const payload: Record<string, unknown> = {
    from: args.from,
    to: toList,
    subject: args.subject,
    text: args.text,
  };
  if (args.replyTo) {
    payload.reply_to = args.replyTo;
  }

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

export function getCustomerEmailFrom(): string | null {
  return (
    trimOrNull(process.env.CUSTOMER_EMAIL_FROM) ||
    trimOrNull(process.env.NOTIFY_EMAIL_FROM)
  );
}

export function getSupportWhatsAppUrl(): string {
  return (
    trimOrNull(process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP) ||
    "https://wa.me/584147613621"
  );
}
