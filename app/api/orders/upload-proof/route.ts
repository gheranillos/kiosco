import { NextResponse } from "next/server";

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

  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const path = `${orderId}/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadErr } = await supabase.storage
    .from("payment-proofs")
    .upload(path, arrayBuffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
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

  return NextResponse.json({ ok: true, path });
}

