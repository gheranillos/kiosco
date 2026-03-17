"use client";

import { useEffect, useRef, type MouseEvent } from "react";

type GalleryItem = {
  title: string;
  caption: string;
  image: string;
};

export function HeroSection({ gallery }: { gallery: GalleryItem[] }) {
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroImageSrc = "/hero1.jpg";

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeEnd = window.innerHeight * 1.2;
      const opacity = Math.max(1 - scrollY / fadeEnd, 0);
      const translateY = scrollY * 0.25;
      if (heroBgRef.current) {
        heroBgRef.current.style.opacity = String(opacity);
        heroBgRef.current.style.transform = `translateY(${translateY}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToPreregistro = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("preregistro");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", "#preregistro");
    }
  };

  return (
    <section className="relative">
      <div className="sticky top-0 z-0 h-[100vh] w-full overflow-hidden">
        <div ref={heroBgRef} className="absolute inset-0 will-change-transform">
          <img
            src={heroImageSrc}
            alt={gallery[0]?.title ?? "Hero image"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        <h1 className="absolute top-8 left-6 md:left-10 max-w-[11ch] break-keep font-black uppercase leading-[0.85] tracking-tight text-white text-[7vw] md:text-[5.5vw]">
          <span className="block">Made by artists</span>
          <span className="mt-2 block">Worn by</span>
          <span className="mt-2 block">Outsiders</span>
        </h1>

        <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 max-w-[min(520px,92vw)] space-y-3 md:space-y-4">
          <div className="inline-flex items-center rounded-full border border-stone-700 bg-stone-900/70 px-3 py-1 text-xs font-semibold uppercase text-stone-300">
            Kiosco — Drop #001 Not normal.
          </div>

          <p className="anim-hero-subtitle max-w-lg text-sm leading-6 text-stone-300 md:text-base">
            Estamos preparando el próximo drop de Kiosco. Déjanos tus datos para
            entrar primero, recibir fotos, precio de salida y acceso anticipado.
          </p>

          <div className="flex flex-wrap gap-3 text-xs font-medium uppercase text-stone-400">
            <span className="rounded-full border border-stone-800 px-3 py-2">
              Exclusividad
            </span>
            <span className="rounded-full border border-stone-800 px-3 py-2">
              Early Access
            </span>
            <span className="rounded-full border border-stone-800 px-3 py-2">
              Comunidad
            </span>
          </div>

          <a
            href="#preregistro"
            onClick={scrollToPreregistro}
            className="anim-hero-cta-pulse anim-cursor-scale group relative inline-flex min-w-[260px] items-center justify-center overflow-hidden rounded-full bg-stone-100 px-8 py-4 text-sm font-bold uppercase leading-none text-stone-950 transition hover:scale-[1.02]"
          >
            <span className="relative z-10 inline-block whitespace-nowrap translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
              Quiero entrar al drop
            </span>
            <span className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 whitespace-nowrap text-stone-100 opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
              <span className="whitespace-nowrap">Quiero entrar al drop</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
            <span className="absolute left-[20%] top-[40%] h-2 w-2 scale-0 rounded-lg bg-stone-950 opacity-0 transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:opacity-100" />
          </a>
        </div>
      </div>
    </section>
  );
}

