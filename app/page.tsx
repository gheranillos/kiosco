import { FormSupabaseHandler } from '@/components/FormSupabaseHandler'
import { GallerySection } from '@/components/GallerySection'
import { HeroSection } from '@/components/HeroSection'
import { StepsSection } from '@/components/StepsSection'
import { FooterSection } from '@/components/ui/footer'

export default function KioscoDropLanding() {
  const gallery = [
    {
      title: "Mom im an artist",
      caption: "Ser artista no es una carrera, es una forma de existir.",
      image: "/tshirt1.jpg",
    },
    {
      title: "Fuck i want to creative",
      caption: "Muestra detalles del arte, textura y construcción de la pieza.",
      image: "/tshirt2.jpg",
    },
    {
      title: "Created not aproved",
      caption: "Las piezas que cambian la cultura nunca pasan por aprobación.",
      image: "/tshirt3.jpg",
    },
    {
      title: "Normal never built anything",
      caption: "Lo normal nunca ha construido nada.",
      image: "/tshirt4.jpg",
    },
  ];

  const galleryPreview = gallery;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-stone-100 selection:text-stone-950">
      <HeroSection gallery={gallery} />

      <div className="relative z-10 bg-stone-950">
        <GallerySection galleryPreview={galleryPreview} />

        <StepsSection />

        <section id="preregistro" data-reveal className="anim-reveal mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase text-stone-400">Base de datos</p>
              <h2 className="text-3xl font-black uppercase leading-none md:text-5xl text-balance">
                Preregistro del drop
              </h2>
              <p className="max-w-md text-sm leading-6 text-stone-400 md:text-base">
                No es solo ropa, es cultura. Regístrate y sé parte del próximo drop del Kiosco
                prendas limitadas, comunidad creativa y acceso exclusivo antes del lanzamiento.
              </p>
            </div>

            <form data-cta-container className="anim-cta-container grid gap-4 rounded-[2rem] border border-stone-800 bg-stone-900 p-6 md:grid-cols-2 md:p-8">
              <FormSupabaseHandler />
              <div className="md:col-span-1">
                <label className="mb-2 block text-xs font-semibold uppercase text-stone-400">
                  Nombre
                </label>
                <input
                  name="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  required
                  minLength={2}
                  maxLength={50}
                  pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+"
                  className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 outline-none transition focus:border-stone-500"
                />
              </div>
              <div className="md:col-span-1">
                <label className="mb-2 block text-xs font-semibold uppercase text-stone-400">
                  Instagram
                </label>
                <input
                  name="instagram"
                  type="text"
                  placeholder="@tuusuario"
                  required
                  maxLength={31}
                  className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 outline-none transition focus:border-stone-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase text-stone-400">
                  Correo electrónico
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="tumail@email.com"
                  required
                  className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 outline-none transition focus:border-stone-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase text-stone-400">
                  Número telefónico
                </label>
                <input
                  name="telefono"
                  type="tel"
                  placeholder="+58 412 1234567"
                  required
                  minLength={7}
                  maxLength={16}
                  className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 outline-none transition focus:border-stone-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-stone-400">
                  Talla de interés
                </label>
                <select name="talla" required className="w-full rounded-2xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-stone-500">
                  <option value="">Selecciona tu talla</option>
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-stone-400">
                  Ciudad
                </label>
                <input
                  name="ciudad"
                  type="text"
                  placeholder="Lechería / Valencia / etc"
                  required
                  minLength={2}
                  maxLength={50}
                  pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+"
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
                  type="submit"
                  data-cta-submit
                  className="anim-cta-submit-btn anim-cursor-scale inline-flex justify-center rounded-full bg-stone-100 px-6 py-3 text-sm font-bold uppercase text-stone-950 transition hover:scale-[1.02] hover:bg-stone-200"
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
      </div>

      <FooterSection />
    </div>
  );
}
