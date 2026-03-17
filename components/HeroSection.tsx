"use client";

import { useEffect, useRef } from "react";

type GalleryItem = {
  title: string;
  caption: string;
  image: string;
};

export function HeroSection({ gallery }: { gallery: GalleryItem[] }) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeEnd = window.innerHeight * 0.7;
      const opacity = Math.max(1 - scrollY / fadeEnd, 0);
      const translateY = scrollY * 0.25;
      if (heroRef.current) {
        heroRef.current.style.opacity = String(opacity);
        heroRef.current.style.transform = `translateY(${translateY}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative">
      <div
        ref={heroRef}
        className="sticky top-0 z-0 h-[100vh] w-full overflow-hidden"
      >
        <img
          src={gallery[0]?.image ?? "/tshirt1.jpg"}
          alt={gallery[0]?.title ?? "Hero image"}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <h1 className="absolute top-8 left-6 md:left-10 max-w-[12ch] break-keep font-black uppercase leading-none tracking-tight text-white text-[14vw] md:text-[11vw]">
          <span className="block">Made By artists</span>
          <span className="mt-2 block font-semibold tracking-[0.12em]">
            worn by
          </span>
          <span className="mt-2 block">Outsiders</span>
        </h1>

        <div className="absolute bottom-10 left-6 md:left-10 space-y-4">
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

        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 hidden md:block">
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
  );
}

