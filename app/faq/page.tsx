import Link from "next/link";

import { FooterSection } from "@/components/ui/footer";

export const metadata = {
  title: "Centro de ayuda — El Kiosco",
  description:
    "Resuelve dudas sobre pedidos, envíos, pagos y devoluciones en El Kiosco.",
};

type FaqItem = { question: string; answer: string };
type FaqCategory = {
  id: string;
  title: string;
  description: string;
  count: number;
  icon: "package" | "truck" | "refresh" | "cart" | "size" | "wallet" | "info";
  items: FaqItem[];
};

const categories: FaqCategory[] = [
  {
    id: "mi-pedido",
    title: "Mi pedido",
    description: "Estado, cambios y confirmación",
    icon: "package",
    count: 3,
    items: [
      {
        question: "¿Cómo sé que mi pedido se procesó bien?",
        answer:
          "Después de pagar, recibirás un mensaje de confirmación con el número de pedido. Si pagaste por método manual (Zinli, pago móvil, Binance), el pedido queda pendiente hasta que verifiquemos el comprobante (normalmente en menos de 24 horas hábiles).",
      },
      {
        question: "¿Puedo modificar o cancelar mi pedido después de hacerlo?",
        answer:
          "Si todavía no lo hemos despachado, escríbenos por WhatsApp lo antes posible y vemos qué se puede hacer. Una vez despachado, ya no podemos modificar productos ni dirección.",
      },
      {
        question: "No me llegó el correo de confirmación, ¿qué hago?",
        answer:
          "Revisa la carpeta de spam o promociones. Si no aparece, escríbenos por WhatsApp o Instagram con el correo que usaste y verificamos el estado del pedido.",
      },
    ],
  },
  {
    id: "envios",
    title: "Envíos y entregas",
    description: "Tiempos, empresas y zonas",
    icon: "truck",
    count: 4,
    items: [
      {
        question: "¿A dónde envían?",
        answer:
          "Hacemos envíos a nivel nacional dentro de Venezuela. Por ahora no enviamos al exterior.",
      },
      {
        question: "¿Cuánto tarda en llegar?",
        answer:
          "Entre 2 y 5 días hábiles desde que despachamos. En temporada alta o feriados puede tardar un poco más. No nos hacemos responsables por retrasos de la empresa de envío.",
      },
      {
        question: "¿Con qué empresas hacen el envío?",
        answer:
          "Principalmente MRW y Zoom Envíos. Puedes elegir tu preferida en el checkout.",
      },
      {
        question: "¿Cuánto cuesta el envío?",
        answer:
          "El costo se calcula en el checkout según la dirección y la empresa que elijas. Lo verás antes de pagar.",
      },
    ],
  },
  {
    id: "cambios-devoluciones",
    title: "Cambios y devoluciones",
    description: "Qué aceptamos y qué no",
    icon: "refresh",
    count: 3,
    items: [
      {
        question: "¿Aceptan cambios por talla?",
        answer:
          "No. Como cada drop es limitado, no garantizamos stock para hacer cambios por talla. Revisa la guía de tallas antes de confirmar tu pedido — si tienes dudas, escríbenos por WhatsApp y te asesoramos.",
      },
      {
        question: "¿Y si mi prenda llega con defecto?",
        answer:
          "Escríbenos por WhatsApp dentro de los 7 días siguientes a la entrega con fotos claras del defecto. Si aplica, gestionamos reposición o reembolso.",
      },
      {
        question: "¿Y si me llegó un producto distinto al que pedí?",
        answer:
          "Pasa lo mismo: contáctanos en los 7 días siguientes con fotos del producto recibido y el número de pedido. Resolvemos cuanto antes.",
      },
    ],
  },
  {
    id: "tallaje",
    title: "Tallaje",
    description: "Guía de medidas y consejos de fit",
    icon: "size",
    count: 2,
    items: [
      {
        question: "¿Cómo elijo mi talla?",
        answer:
          "En la página de cada producto hay una sección 'Size Guide' con las medidas exactas en cm de pecho, cintura y largo. Usa tu talla habitual. Si te gusta el fit oversize, sube una talla.",
      },
      {
        question: "¿Las prendas son unisex?",
        answer:
          "Sí, todo el Drop #001 está pensado como unisex. Las tallas van de XS a XXL.",
      },
    ],
  },
  {
    id: "pagos",
    title: "Pagos",
    description: "Métodos disponibles y comprobantes",
    icon: "wallet",
    count: 3,
    items: [
      {
        question: "¿Qué métodos de pago aceptan?",
        answer:
          "PayPal (pago automático), Zinli, Pago Móvil y Binance Pay (pago manual con verificación de comprobante).",
      },
      {
        question: "¿Cómo subo mi comprobante de pago manual?",
        answer:
          "En el checkout, después de elegir Zinli, pago móvil o Binance Pay, te aparece un campo para cargar la imagen del comprobante y el número de referencia.",
      },
      {
        question: "¿Cuánto tardan en verificar mi pago manual?",
        answer:
          "Normalmente menos de 24 horas hábiles. Si tardamos más, escríbenos por WhatsApp con tu número de pedido.",
      },
    ],
  },
  {
    id: "sobre-kiosco",
    title: "Sobre Kiosco",
    description: "Filosofía, drops y futuro",
    icon: "info",
    count: 2,
    items: [
      {
        question: "¿Qué es exactamente El Kiosco?",
        answer:
          "Una marca venezolana de ropa limitada hecha por artistas para gente que no encaja en lo normal. Sacamos drops puntuales con piezas de edición numerada.",
      },
      {
        question: "¿Habrá más drops?",
        answer:
          "Sí. Cada drop es independiente y limitado, sin restock. Para enterarte antes que nadie, suscríbete a la lista de espera desde el footer o desde /lista-espera.",
      },
    ],
  },
];

function CategoryIcon({ name }: { name: FaqCategory["icon"] }) {
  const common = {
    fill: "none" as const,
    stroke: "currentColor" as const,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "package":
      return (
        <svg viewBox="0 0 24 24" className="size-10" {...common}>
          <path d="M3 7l9-4 9 4-9 4-9-4z" />
          <path d="M3 7v10l9 4 9-4V7" />
          <path d="M12 11v10" />
        </svg>
      );
    case "truck":
      return (
        <svg viewBox="0 0 24 24" className="size-10" {...common}>
          <rect x="1" y="6" width="14" height="11" rx="1" />
          <path d="M15 10h4l3 3v4h-7z" />
          <circle cx="6" cy="19" r="2" />
          <circle cx="18" cy="19" r="2" />
        </svg>
      );
    case "refresh":
      return (
        <svg viewBox="0 0 24 24" className="size-10" {...common}>
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      );
    case "cart":
      return (
        <svg viewBox="0 0 24 24" className="size-10" {...common}>
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
          <path d="M3 4h2l3 12h12l2-8H6" />
        </svg>
      );
    case "size":
      return (
        <svg viewBox="0 0 24 24" className="size-10" {...common}>
          <path d="M3 8h18v8H3z" />
          <path d="M7 12v4" />
          <path d="M11 12v4" />
          <path d="M15 12v4" />
          <path d="M19 12v4" />
        </svg>
      );
    case "wallet":
      return (
        <svg viewBox="0 0 24 24" className="size-10" {...common}>
          <path d="M3 8a3 3 0 0 1 3-3h13v14H6a3 3 0 0 1-3-3z" />
          <path d="M16 12h3" />
        </svg>
      );
    case "info":
    default:
      return (
        <svg viewBox="0 0 24 24" className="size-10" {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v0.5" />
          <path d="M12 11v6" />
        </svg>
      );
  }
}

const categoryTones: Record<FaqCategory["id"], string> = {
  "mi-pedido": "bg-stone-100",
  envios: "bg-amber-50",
  "cambios-devoluciones": "bg-rose-50",
  tallaje: "bg-stone-100",
  pagos: "bg-emerald-50",
  "sobre-kiosco": "bg-sky-50",
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-white text-stone-900">
      <main className="mx-auto max-w-6xl px-6 pt-16 pb-24 md:px-10 md:pt-24 md:pb-32">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-stone-500 transition hover:text-stone-900"
        >
          <span className="text-stone-400">←</span>
          Volver al inicio
        </Link>

        <div className="mt-8 flex flex-col gap-3 md:gap-4">
          <p className="text-xs font-semibold uppercase text-stone-500">
            Centro de ayuda
          </p>
          <h1 className="text-4xl font-bold uppercase leading-none text-stone-900 md:text-6xl">
            Obtener más información
          </h1>
          <p className="max-w-xl text-sm text-stone-600">
            Pedidos, envíos, cambios, tallas y pagos. Si no encuentras lo que
            buscas, escríbenos por{" "}
            <a
              href="https://wa.me/584147613621"
              className="underline hover:text-stone-900"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
            .
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`#${category.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition hover:border-stone-400"
            >
              <div
                className={`relative flex aspect-[4/3] w-full items-center justify-center text-stone-500 ${categoryTones[category.id] ?? "bg-stone-100"}`}
              >
                <CategoryIcon name={category.icon} />
              </div>
              <div className="px-4 py-3">
                <p className="text-sm font-semibold text-stone-900">
                  {category.title}
                </p>
                <p className="text-xs text-stone-500">
                  {category.count} {category.count === 1 ? "artículo" : "artículos"}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-20 space-y-16">
          {categories.map((category) => (
            <section
              key={category.id}
              id={category.id}
              className="scroll-mt-24 border-t border-stone-200 pt-10"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex size-12 shrink-0 items-center justify-center rounded-lg text-stone-500 ${categoryTones[category.id] ?? "bg-stone-100"}`}
                >
                  <CategoryIcon name={category.icon} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold uppercase leading-tight text-stone-900 md:text-3xl">
                    {category.title}
                  </h2>
                  <p className="mt-1 text-sm text-stone-500">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 divide-y divide-stone-200 border-t border-b border-stone-200">
                {category.items.map((item) => (
                  <details key={item.question} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold text-stone-900">
                      <span>{item.question}</span>
                      <span className="shrink-0 text-stone-400 transition group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-7 text-stone-600">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-20 rounded-xl border border-stone-200 bg-stone-50 p-6 md:p-8">
          <p className="text-xs font-semibold uppercase text-stone-500">
            ¿No encontraste tu respuesta?
          </p>
          <p className="mt-2 text-base text-stone-900">
            Escríbenos por WhatsApp y te ayudamos directo.
          </p>
          <a
            href="https://wa.me/584147613621"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-xs font-bold uppercase text-stone-100 transition hover:bg-stone-800"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
