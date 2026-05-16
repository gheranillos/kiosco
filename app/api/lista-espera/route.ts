import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase-server";

type Body = {
  whatsapp?: string;
  email?: string;
  talla?: string;
};

const VALID_SIZES = new Set(["S", "M", "L", "XL"]);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+()\d\s-]{7,20}$/;

export async function POST(request: Request) {
  try {
    let body: Body;
    try {
      body = (await request.json()) as Body;
    } catch {
      return NextResponse.json({ error: "JSON invalido." }, { status: 400 });
    }

    const whatsapp = String(body.whatsapp ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const talla = String(body.talla ?? "").trim().toUpperCase();

    if (!PHONE_REGEX.test(whatsapp)) {
      return NextResponse.json({ error: "WhatsApp invalido." }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Correo invalido." }, { status: 400 });
    }

    if (!VALID_SIZES.has(talla)) {
      return NextResponse.json({ error: "Talla invalida." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("registro_drop").insert([
      {
        nombre: "Lista de espera",
        instagram: "N/A",
        telefono: whatsapp,
        correo: email,
        ciudad: "N/A",
        talla,
        origen: "lista_espera",
      },
    ]);

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("duplicate") || msg.includes("unique")) {
        return NextResponse.json(
          { error: "Ese correo ya esta registrado para el lanzamiento." },
          { status: 409 }
        );
      }

      if (msg.includes("does not exist")) {
        return NextResponse.json(
          {
            error:
              "Falta ajustar la tabla registro_drop en Supabase. Ejecuta el SQL de supabase/lista_espera.sql.",
          },
          { status: 500 }
        );
      }

      if (
        msg.includes("schema cache") ||
        msg.includes("not-null") ||
        msg.includes("null value")
      ) {
        return NextResponse.json(
          {
            error:
              "Tu tabla registro_drop aun no coincide con el backend. Vuelve a ejecutar supabase/lista_espera.sql y refresca el proyecto en Supabase.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({ error: "No se pudo guardar el registro." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
