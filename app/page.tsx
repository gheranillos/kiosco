export default function KioscoDropLanding() {
  const gallery = [
    {
      title: "Front Graphic",
      caption: "Visual del drop — reemplaza esta tarjeta por tu mockup real.",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Back Print",
      caption: "Muestra detalle del arte, textura o frase principal.",
      image:
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Fit & Mood",
      caption: "Usa una foto lifestyle para vender actitud, no solo ropa.",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-stone-100 selection:text-stone-950">
      <section className="relative overflow-hidden border-b border-stone-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:px-10 lg:grid-cols-2 lg:items-center lg:py-24">
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center rounded-full border border-stone-700 bg-stone-900/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-stone-300">
              Kiosco — Drop preregistro
            </div>

            <div className="space-y-4">
              <h1 data-hero-title className="max-w-xl text-4xl font-black uppercase leading-none tracking-tight md:text-6xl text-balance">
                Made by artists. Worn by outsiders.
              </h1>
              <p className="anim-hero-subtitle max-w-lg text-sm leading-6 text-stone-300 md:text-base">
                Estamos preparando el próximo drop de Kiosco. Déjanos tus datos para
                entrar primero, recibir fotos, precio de salida y acceso anticipado.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-stone-400">
              <span className="rounded-full border border-stone-800 px-3 py-2">Edición limitada</span>
              <span className="rounded-full border border-stone-800 px-3 py-2">Acceso prioritario</span>
              <span className="rounded-full border border-stone-800 px-3 py-2">Comunidad primero</span>
            </div>

            <a
              href="#preregistro"
              className="anim-hero-cta-pulse anim-cursor-scale inline-flex rounded-full bg-stone-100 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-stone-950 transition hover:scale-[1.02]"
            >
              Quiero entrar al drop
            </a>
          </div>

          <div className="relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="anim-drop-image-wrap overflow-hidden rounded-[2rem] border border-stone-800 bg-stone-900 shadow-2xl">
                <img
                  src={gallery[0].image}
                  alt={gallery[0].title}
                  className="anim-drop-image anim-drop-image-reveal h-80 w-full object-cover"
                />
              </div>
              <div className="grid gap-4">
                <div className="anim-drop-image-wrap overflow-hidden rounded-[2rem] border border-stone-800 bg-stone-900 shadow-2xl">
                  <img
                    src={gallery[1].image}
                    alt={gallery[1].title}
                    className="anim-drop-image anim-drop-image-reveal h-40 w-full object-cover"
                  />
                </div>
                <div className="anim-drop-image-wrap overflow-hidden rounded-[2rem] border border-stone-800 bg-stone-900 shadow-2xl">
                  <img
                    src={gallery[2].image}
                    alt={gallery[2].title}
                    className="anim-drop-image anim-drop-image-reveal h-36 w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-reveal className="anim-reveal mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-stone-400">Preview</p>
            <h2 className="text-2xl font-bold uppercase md:text-3xl">Fotos del drop</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-stone-400">
            Aquí puedes mostrar mockups, detalles de estampado, fitting y mood visual del lanzamiento.
          </p>
        </div>

        <div data-reveal-stagger className="grid gap-5 md:grid-cols-3 anim-reveal-stagger">
          {gallery.map((item) => (
            <div
              key={item.title}
              className="group overflow-hidden rounded-[2rem] border border-stone-800 bg-stone-900"
            >
              <div className="anim-drop-image-wrap overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="anim-drop-image anim-drop-image-reveal h-80 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 p-5">
                <h3 className="text-lg font-semibold uppercase">{item.title}</h3>
                <p className="text-sm leading-6 text-stone-400">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section data-reveal className="anim-reveal border-y border-stone-800 bg-stone-900/60">
        <div data-reveal-stagger className="anim-reveal-stagger mx-auto grid max-w-7xl gap-6 px-6 py-12 md:grid-cols-3 md:px-10">
          <div className="rounded-[2rem] border border-stone-800 p-6">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-stone-500">01</p>
            <h3 className="mb-2 text-xl font-bold uppercase">Te registras</h3>
            <p className="text-sm leading-6 text-stone-400">
              Dejas tu nombre, correo e Instagram para entrar a la lista.
            </p>
          </div>
          <div className="rounded-[2rem] border border-stone-800 p-6">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-stone-500">02</p>
            <h3 className="mb-2 text-xl font-bold uppercase">Recibes acceso</h3>
            <p className="text-sm leading-6 text-stone-400">
              Te avisamos primero cuando salgan fecha, precio y cantidad disponible.
            </p>
          </div>
          <div className="rounded-[2rem] border border-stone-800 p-6">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-stone-500">03</p>
            <h3 className="mb-2 text-xl font-bold uppercase">Entras temprano</h3>
            <p className="text-sm leading-6 text-stone-400">
              La idea es convertir esta lista en tu base de datos real para próximos drops.
            </p>
          </div>
        </div>
      </section>

      <section id="preregistro" data-reveal className="anim-reveal mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Base de datos</p>
            <h2 className="text-3xl font-black uppercase leading-none md:text-5xl text-balance">
              Preregistro del drop
            </h2>
            <p className="max-w-md text-sm leading-6 text-stone-400 md:text-base">
              Esta sección está pensada para conectar luego con Formspree, Mailchimp,
              ConvertKit, Google Sheets o una automatización simple para guardar tus leads.
            </p>
          </div>

          <form data-cta-container className="anim-cta-container grid gap-4 rounded-[2rem] border border-stone-800 bg-stone-900 p-6 md:grid-cols-2 md:p-8">
            <div className="md:col-span-1">
              <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-stone-400">
                Nombre
              </label>
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 outline-none transition focus:border-stone-500"
              />
            </div>
            <div className="md:col-span-1">
              <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-stone-400">
                Instagram
              </label>
              <input
                type="text"
                placeholder="@tuusuario"
                className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 outline-none transition focus:border-stone-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-stone-400">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="tumail@email.com"
                className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 outline-none transition focus:border-stone-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-stone-400">
                Talla de interés
              </label>
              <select className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-stone-500">
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-stone-400">
                Ciudad
              </label>
              <input
                type="text"
                placeholder="Lechería / Valencia / etc"
                className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 outline-none transition focus:border-stone-500"
              />
            </div>
            <div className="md:col-span-2 flex items-start gap-3 rounded-2xl border border-stone-800 bg-stone-950 p-4 text-sm text-stone-400">
              <input type="checkbox" className="mt-1 accent-stone-100" />
              <p>
                Acepto recibir información del drop, acceso anticipado y próximos lanzamientos de Kiosco.
              </p>
            </div>
            <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                data-cta-submit
                className="anim-cta-submit-btn anim-cursor-scale inline-flex justify-center rounded-full bg-stone-100 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-stone-950 transition hover:scale-[1.02] hover:bg-stone-200"
              >
                Unirme al preregistro
              </button>
              <p className="text-xs leading-5 text-stone-500">
                Luego se puede conectar este botón a una base de datos real sin rehacer el diseño.
              </p>
            </div>
          </form>
        </div>
      </section>

      <footer className="border-t border-stone-800 px-6 py-8 text-center text-xs uppercase tracking-[0.18em] text-stone-500 md:px-10">
        Kiosco — cultura para incomprendidos
      </footer>
    </div>
  );
}
