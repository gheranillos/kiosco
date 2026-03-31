import { NextResponse } from "next/server";

import { sendManualPaymentEmailNotification } from "@/lib/manual-payment-notifications";
import { sendManualPaymentTelegramNotification } from "@/lib/telegram-notifications";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const supabase = getSupabaseServerClient();

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const orderId = String(form.get("orderId") || "").trim();
  const method = String(form.get("method") || "").trim();
  const reference = String(form.get("reference") || "").trim();
  const file = form.get("file");

  if (!orderId || !method || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing orderId/method/file" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "El comprobante debe ser una imagen (JPG, PNG o WEBP)." },
      { status: 400 }
    );
  }

  const maxBytes = 8 * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: "La imagen supera el limite de 8MB." },
      { status: 400 }
    );
  }

  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const path = `${orderId}/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  let { error: uploadErr } = await supabase.storage
    .from("payment-proofs")
    .upload(path, arrayBuffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadErr?.message?.toLowerCase().includes("bucket not found")) {
    await supabase.storage.createBucket("payment-proofs", {
      public: true,
      fileSizeLimit: "8MB",
      allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
    });

    const retry = await supabase.storage.from("payment-proofs").upload(path, arrayBuffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
    uploadErr = retry.error;
  }

  if (uploadErr) {
    return NextResponse.json(
      {
        error: `No se pudo subir la imagen. Verifica el bucket 'payment-proofs' y permisos de storage. Detalle: ${uploadErr.message}`,
      },
      { status: 500 }
    );
  }

  const { error: proofErr } = await supabase.from("payment_proofs").insert([
    {
      order_id: orderId,
      method,
      file_path: path,
      reference: reference || null,
    },
  ]);

  if (proofErr) {
    return NextResponse.json({ error: proofErr.message }, { status: 500 });
  }

  // Ensure status is pending_verification for manual payments
  await supabase.from("orders").update({ status: "pending_verification" }).eq("id", orderId);

  const { data: orderRow } = await supabase
    .from("orders")
    .select("subtotal_amount,currency,name,email")
    .eq("id", orderId)
    .maybeSingle();

  const notifyResult = await sendManualPaymentEmailNotification({
    orderId,
    method,
    reference: reference || null,
    proofPath: path,
    amount: orderRow?.subtotal_amount ?? null,
    currency: orderRow?.currency ?? "USD",
    customerName: orderRow?.name ?? null,
    customerEmail: orderRow?.email ?? null,
  });

  const supabaseUrl = String(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  ).trim();
  const proofUrl = supabaseUrl
    ? `${supabaseUrl}/storage/v1/object/public/payment-proofs/${path}`
    : path;

  const telegramResult = await sendManualPaymentTelegramNotification({
    orderId,
    method,
    reference: reference || null,
    proofUrl,
    amount: orderRow?.subtotal_amount ?? null,
    currency: orderRow?.currency ?? "USD",
    customerName: orderRow?.name ?? null,
    customerEmail: orderRow?.email ?? null,
  });

  return NextResponse.json({
    ok: true,
    path,
    notificationSent: notifyResult.sent,
    notificationReason: notifyResult.reason ?? null,
    telegramSent: telegramResult.sent,
    telegramReason: telegramResult.reason ?? null,
  });
}

