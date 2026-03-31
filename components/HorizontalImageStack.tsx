"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, type PanInfo } from "framer-motion";

import { products } from "@/lib/products";

const images = products.map((p, i) => ({
  id: p.slug,
  src: `/shirt${i + 1}front.png`,
  back: `/shirt${i + 1}back.png`,
  alt: p.title,
  title: p.title,
  price: p.price,
}));

export function HorizontalImageStack() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  const lastNavigationTime = useRef(0);
  const navigationCooldown = 400;

  const navigate = useCallback((direction: number) => {
    const now = Date.now();
    if (now - lastNavigationTime.current < navigationCooldown) return;
    lastNavigationTime.current = now;

    setCurrentIndex((prev) => {
      if (direction > 0) return prev === images.length - 1 ? 0 : prev + 1;
      return prev === 0 ? images.length - 1 : prev - 1;
    });
  }, []);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      navigate(1);
    } else if (info.offset.x > threshold) {
      navigate(-1);
    }
  };

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > 30) {
        if (e.deltaX > 0) navigate(1);
        else navigate(-1);
      }
    },
    [navigate],
  );

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  useEffect(() => {
    const update = () => setIsCompact(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const getCardStyle = (index: number) => {
    const total = images.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const nearX = isCompact ? 132 : 220;
    const farX = isCompact ? 212 : 380;
    const offscreenX = isCompact ? 360 : 600;

    if (diff === 0) {
      return { x: 0, scale: 1, opacity: 1, zIndex: 5, rotateY: 0 };
    } else if (diff === -1) {
      return {
        x: -nearX,
        scale: 0.85,
        opacity: 0.6,
        zIndex: 4,
        rotateY: -12,
      };
    } else if (diff === -2) {
      return {
        x: -farX,
        scale: 0.7,
        opacity: 0.3,
        zIndex: 3,
        rotateY: -20,
      };
    } else if (diff === 1) {
      return {
        x: nearX,
        scale: 0.85,
        opacity: 0.6,
        zIndex: 4,
        rotateY: 12,
      };
    } else if (diff === 2) {
      return {
        x: farX,
        scale: 0.7,
        opacity: 0.3,
        zIndex: 3,
        rotateY: 20,
      };
    }
    return {
      x: diff > 0 ? offscreenX : -offscreenX,
      scale: 0.6,
      opacity: 0,
      zIndex: 0,
      rotateY: diff > 0 ? 30 : -30,
    };
  };

  const isVisible = (index: number) => {
    const total = images.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return Math.abs(diff) <= 2;
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-stone-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.02] blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-stone-950/70 to-transparent" />
      </div>

      <div
        className="relative flex h-[360px] w-[min(92vw,700px)] items-center justify-center md:h-[480px]"
        style={{ perspective: "1200px" }}
      >
        {images.map((image, index) => {
          if (!isVisible(index)) return null;
          const style = getCardStyle(index);
          const isCurrent = index === currentIndex;

          return (
            <motion.div
              key={image.id}
              className="absolute cursor-grab active:cursor-grabbing"
              animate={{
                x: style.x,
                scale: style.scale,
                opacity: style.opacity,
                rotateY: style.rotateY,
                zIndex: style.zIndex,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30, mass: 1 }}
              drag={isCurrent ? "x" : false}
              dragConstraints={{ left: -50, right: 50 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              style={{ transformStyle: "preserve-3d", zIndex: style.zIndex }}
            >
              <div
                className="relative h-[310px] w-[208px] overflow-hidden rounded-3xl bg-stone-900 ring-1 ring-stone-800/40 md:h-[420px] md:w-[280px]"
                style={{
                  boxShadow: isCurrent
                    ? "0 25px 50px -12px rgb(0 0 0 / 0.45), 0 0 0 1px rgb(255 255 255 / 0.06)"
                    : "0 10px 30px -10px rgb(0 0 0 / 0.4)",
                }}
                onMouseEnter={() => {
                  if (isCurrent) setHoveredId(image.id);
                }}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div
                  style={{
                    transformStyle: "preserve-3d",
                    transition: "transform 0.6s",
                    willChange: "transform",
                    transform:
                      hoveredId === image.id ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                  className="relative h-full w-full"
                >
                  <div
                    style={{ backfaceVisibility: "hidden" }}
                    className="absolute inset-0"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-contain p-2 md:p-3"
                      draggable={false}
                    />
                  </div>

                  <div
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                    className="absolute inset-0"
                  >
                    <img
                      src={image.back}
                      alt={`${image.alt} back`}
                      className="h-full w-full object-contain p-2 md:p-3"
                      draggable={false}
                    />
                  </div>
                </div>

                {isCurrent && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-stone-400">
                      {image.title}
                    </p>
                    <p className="mb-3 text-lg font-black text-stone-100">
                      ${image.price}
                    </p>
                    <Link
                      href={`/shop/${image.id}`}
                      className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-950/80 px-4 py-2 text-xs font-semibold uppercase text-stone-300 backdrop-blur-sm transition-all duration-300 hover:border-stone-500 hover:text-stone-100"
                    >
                      Ver producto →
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={() => navigate(-1)}
        className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-700 bg-stone-950/80 text-stone-300 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-stone-500 hover:text-stone-100"
        aria-label="Previous product"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        onClick={() => navigate(1)}
        className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-700 bg-stone-950/80 text-stone-300 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-stone-500 hover:text-stone-100"
        aria-label="Next product"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-row gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-6 bg-stone-100"
                : "w-1.5 bg-stone-600 hover:bg-stone-400"
            }`}
            aria-label={`Go to product ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute right-6 top-6 z-20">
        <div className="flex items-center gap-2">
          <span className="tabular-nums text-2xl font-black text-stone-100">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <div className="h-px w-6 bg-stone-700" />
          <span className="tabular-nums text-sm text-stone-500">
            {String(images.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 text-stone-600">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M19 12H5M5 12l7-7M5 12l7 7" />
        </svg>
        <span className="text-xs font-medium uppercase tracking-widest">Drag</span>
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M5 12h14M14 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
