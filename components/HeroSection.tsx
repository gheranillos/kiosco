"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

type GalleryItem = {
  title: string;
  caption: string;
  image: string;
};

export function HeroSection({ gallery }: { gallery: GalleryItem[] }) {
  const heroBgRef = useRef<HTMLDivElement>(null);
  const shopEnabled = process.env.NEXT_PUBLIC_SHOP_ENABLED !== "false";
  const slides = [
    {
      image: "/hero1.jpg",
      badge: null as string | null,
      bullets: [] as string[],
      quote: null as string | null,
    },
    {
      image: "/hero2.jpg",
      badge: "5% OFF pre-registro",
      bullets: ["Early Access"],
      quote: "Los que están adentro, son los verdaderos.",
    },
    {
      image: "/hero3.jpg",
      badge: "EXCLUSIVIDAD / FOMO",
      bullets: ["Limited Drop", "Solo X piezas disponibles", "No restock"],
      quote: null,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 400);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 400);
  };

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

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(goToNext, 3000);
    return () => clearInterval(interval);
  }, [currentSlide, isPaused]);

  const scrollToPreregistro = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("preregistro");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", "#preregistro");
    }
  };

  return (
    <section
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="sticky top-0 z-0 h-[100vh] w-full overflow-hidden">
        <div ref={heroBgRef} className="absolute inset-0 will-change-transform">
          <div className="absolute inset-0">
            {slides.map((item, index) => (
              <img
                key={item.image}
                src={item.image}
                alt={`Hero slide ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "w-6 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        <h1 className="absolute top-8 left-6 md:left-10 max-w-[11ch] break-keep font-black uppercase leading-[0.85] tracking-tight text-white text-[7vw] md:text-[5.5vw]">
          <span className="block">Made by artists</span>
          <span className="mt-2 block">Worn by</span>
          <span className="mt-2 block">Outsiders</span>
        </h1>

        <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 max-w-[min(580px,92vw)] space-y-3 md:space-y-4">
          <div className="inline-flex items-center rounded-full border border-stone-700 bg-stone-900/70 px-3 py-1 text-xs font-semibold uppercase text-stone-300">
            Kiosco — Drop #001 Not normal.
          </div>

          {slides[currentSlide].badge && (
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase text-white animate-in fade-in duration-500">
              {slides[currentSlide].badge}
            </div>
          )}

          {slides[currentSlide].bullets.length > 0 && (
            <ul className="flex flex-col gap-1 animate-in fade-in duration-500">
              {slides[currentSlide].bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-center gap-2 text-xs uppercase font-semibold tracking-widest text-white/80"
                >
                  <span className="w-1 h-1 rounded-full bg-white/60" />
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          {slides[currentSlide].quote && (
            <p className="text-sm italic text-white/60 font-light max-w-xs animate-in fade-in duration-500">
              "{slides[currentSlide].quote}"
            </p>
          )}

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

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href="#preregistro"
              onClick={scrollToPreregistro}
              className="anim-hero-cta-pulse anim-cursor-scale group relative inline-flex min-w-[min(260px,100%)] shrink-0 items-center justify-center overflow-hidden rounded-full bg-stone-100 px-8 py-4 text-sm font-bold uppercase leading-none text-stone-950 transition hover:scale-[1.02]"
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

            {shopEnabled ? (
              <a
                href="/shop"
                className="anim-cursor-scale inline-flex min-w-[min(260px,100%)] shrink-0 items-center justify-center rounded-full border border-stone-700 bg-stone-950/40 px-8 py-4 text-sm font-bold uppercase leading-none text-stone-100 transition hover:scale-[1.02] hover:bg-stone-950/60"
              >
                Shop
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex min-w-[min(260px,100%)] shrink-0 cursor-not-allowed items-center justify-center rounded-full border border-stone-800 bg-stone-950/20 px-8 py-4 text-sm font-bold uppercase leading-none text-stone-500 opacity-80"
                title="Próximamente"
              >
                Shop (Próximamente)
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

