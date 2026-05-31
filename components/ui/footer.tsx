import Link from "next/link";

const brandLinks = [
  { title: "Drop #001", href: "/shop" },
  { title: "Lista de espera", href: "/lista-espera" },
  { title: "Sobre Kiosco", href: "/#sobre" },
];

const supportLinks = [
  { title: "FAQ", href: "/faq" },
  { title: "Envíos", href: "/faq#envios" },
  { title: "Contacto", href: "https://wa.me/584147613621" },
];

const legalLinks = [
  { title: "Aviso legal", href: "/aviso-legal" },
  { title: "Política de privacidad", href: "/politica-de-privacidad" },
  { title: "Términos y condiciones", href: "/terminos-y-condiciones" },
];

export function FooterSection() {
  return (
    <footer className="bg-white text-stone-900">
      <div className="mx-auto w-full max-w-7xl px-6 pt-16 pb-10 md:px-10 md:pt-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-12">
          <div className="space-y-4">
            <h3 className="text-[11px] font-semibold uppercase text-stone-900">
              Quédate en el loop
            </h3>
            <p className="text-xs leading-5 text-stone-600">
              Suscríbete y entérate del próximo drop antes que nadie.
            </p>
            <form
              method="get"
              action="/lista-espera"
              className="flex items-center gap-3 border-b border-stone-300 pb-1.5 transition focus-within:border-stone-900"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="tucorreo@email.com"
                className="w-full bg-transparent py-1 text-sm text-stone-900 placeholder:text-stone-400 outline-none"
              />
              <button
                type="submit"
                className="shrink-0 text-[11px] font-semibold uppercase text-stone-900 transition hover:text-stone-600"
              >
                Suscribirme
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-semibold uppercase text-stone-900">
              Brand
            </h3>
            <ul className="space-y-2.5">
              {brandLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-xs text-stone-600 transition hover:text-stone-900"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-semibold uppercase text-stone-900">
              Support
            </h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-xs text-stone-600 transition hover:text-stone-900"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-semibold uppercase text-stone-900">
              Boring stuff
            </h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-xs text-stone-600 transition hover:text-stone-900"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-stone-200 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase">
            <span className="text-stone-900">País &amp; Idioma</span>
            <span className="text-stone-600">VE</span>
            <span className="text-stone-300">|</span>
            <span className="text-stone-600">USD $</span>
            <span className="text-stone-300">|</span>
            <span className="text-stone-600">Español</span>
          </div>

          <div className="flex items-center gap-5 text-stone-600">
            <Link
              href="https://x.com/wearekiosco"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X/Twitter"
              className="transition hover:text-stone-900"
            >
              <svg
                className="size-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"
                />
              </svg>
            </Link>
            <Link
              href="https://instagram.com/wearekiosco"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition hover:text-stone-900"
            >
              <svg
                className="size-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
                />
              </svg>
            </Link>
            <Link
              href="https://www.tiktok.com/@wearekiosco"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="transition hover:text-stone-900"
            >
              <svg
                className="size-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div className="pt-10 md:pt-16">
          <p
            aria-hidden="true"
            className="select-none whitespace-nowrap font-black uppercase leading-[0.82] tracking-tight text-stone-900"
            style={{ fontSize: "clamp(3.5rem, 17vw, 14rem)" }}
          >
            El Kiosco
          </p>
        </div>

        <div className="mt-8 flex flex-col items-start gap-2 text-[10px] uppercase text-stone-500 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} El Kiosco</span>
          <span>Made by artists. Worn by outsiders. by @gheranillos</span>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
