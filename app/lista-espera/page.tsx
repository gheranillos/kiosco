"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const TARGET_DATE = "2026-06-01T00:00:00-04:00";
const SIZE_OPTIONS = ["S", "M", "L", "XL"] as const;

function calculateTimeLeft(targetTime: number): TimeLeft {
  const diff = Math.max(targetTime - Date.now(), 0);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function formatUnit(value: number) {
  return String(value).padStart(2, "0");
}

export default function ListaEsperaPage() {
  const targetTime = useMemo(() => new Date(TARGET_DATE).getTime(), []);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetTime));
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [size, setSize] = useState<(typeof SIZE_OPTIONS)[number]>("M");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetTime));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetTime]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/lista-espera", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsapp,
          email,
          talla: size,
        }),
      });

      const payload = (await response.json()) as { error?: string; ok?: boolean };
      if (!response.ok || !payload.ok) {
        setMessage(payload.error || "No se pudo guardar tu registro. Intenta de nuevo.");
        return;
      }

      setMessage("Listo, quedaste en la lista. Te avisamos por WhatsApp y correo.");
      setWhatsapp("");
      setEmail("");
      setSize("M");
    } catch {
      setMessage("Hubo un problema de red. Revisa tu conexión e intenta otra vez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-black">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-xl flex-col items-center justify-center gap-8">
        <img src="/icon.svg" alt="Kiosco" className="h-20 w-20 object-contain" />

        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <p className="text-3xl font-black">{formatUnit(timeLeft.days)}</p>
            <p className="text-[10px] uppercase tracking-wide text-stone-500">Dias</p>
          </div>
          <div>
            <p className="text-3xl font-black">{formatUnit(timeLeft.hours)}</p>
            <p className="text-[10px] uppercase tracking-wide text-stone-500">Horas</p>
          </div>
          <div>
            <p className="text-3xl font-black">{formatUnit(timeLeft.minutes)}</p>
            <p className="text-[10px] uppercase tracking-wide text-stone-500">Minutos</p>
          </div>
          <div>
            <p className="text-3xl font-black">{formatUnit(timeLeft.seconds)}</p>
            <p className="text-[10px] uppercase tracking-wide text-stone-500">Segundos</p>
          </div>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-base font-semibold uppercase tracking-wide">
            Acceso anticipado al Drop #001
          </p>
          <p className="text-sm text-stone-600">
            Solo para los primeros. Una vez que se acabe, se acaba.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <input
            type="tel"
            name="whatsapp"
            required
            value={whatsapp}
            onChange={(event) => setWhatsapp(event.target.value)}
            placeholder="WhatsApp"
            className="w-full border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
          />
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="w-full border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
          />
          <select
            name="talla"
            required
            value={size}
            onChange={(event) => setSize(event.target.value as (typeof SIZE_OPTIONS)[number])}
            className="w-full border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-500"
          >
            {SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                Talla {option}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full border border-black px-4 py-3 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Guardando..." : "Quiero acceso"}
          </button>
        </form>

        <p className="text-center text-xs uppercase tracking-[0.2em] text-stone-500">
          Cuenta regresiva hasta el 31 de mayo
        </p>

        {message ? (
          <p className="text-center text-xs text-stone-700" role="status">
            {message}
          </p>
        ) : null}
      </div>
    </main>
  );
}
