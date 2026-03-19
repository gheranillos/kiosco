type PayPalEnv = "sandbox" | "live";

function getPayPalBaseUrl() {
  const env = (process.env.PAYPAL_ENV || "sandbox") as PayPalEnv;
  return env === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

function getPayPalCreds() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    throw new Error("Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET");
  }
  return { clientId, secret };
}

export async function getPayPalAccessToken() {
  const { clientId, secret } = getPayPalCreds();
  const base = getPayPalBaseUrl();

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal token error: ${text}`);
  }

  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

export async function paypalCreateOrder(args: {
  amount: string;
  currency: string;
  returnUrl: string;
  cancelUrl: string;
}) {
  const base = getPayPalBaseUrl();
  const token = await getPayPalAccessToken();

  const res = await fetch(`${base}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: args.currency,
            value: args.amount,
          },
        },
      ],
      application_context: {
        return_url: args.returnUrl,
        cancel_url: args.cancelUrl,
      },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal create order error: ${text}`);
  }

  const json = (await res.json()) as {
    id: string;
    links: Array<{ href: string; rel: string; method: string }>;
  };

  const approval = json.links.find((l) => l.rel === "approve")?.href;
  if (!approval) throw new Error("Missing PayPal approval URL");

  return { paypalOrderId: json.id, approvalUrl: approval };
}

export async function paypalCaptureOrder(paypalOrderId: string) {
  const base = getPayPalBaseUrl();
  const token = await getPayPalAccessToken();

  const res = await fetch(`${base}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal capture error: ${text}`);
  }

  return await res.json();
}

