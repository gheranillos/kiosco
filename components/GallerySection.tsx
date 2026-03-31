"use client";

import { useEffect, useState } from "react";

type GalleryItem = {
  title: string;
  caption: string;
  image: string;
};

export function GallerySection({ galleryPreview }: { galleryPreview: GalleryItem[] }) {
  const gallery = galleryPreview;
  const [selected, setSelected] = useState<null | typeof gallery[0]>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <section data-reveal className="anim-reveal mx-auto max-w-7xl px-6 py-16 md:px-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-stone-400">Preview</p>
          <h2 className="text-2xl font-bold uppercase md:text-3xl">Fotos del drop</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-stone-400">
          Esto no es solo Merch: El Kiosco es la idea, detalles y la vibras de un outsider.
        </p>
      </div>

      <div data-reveal-stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 anim-reveal-stagger">
        {galleryPreview.map((item, itemIndex) => (
          <div
            key={item.title}
            className="group overflow-hidden rounded-xl border border-stone-700 bg-stone-950/80 backdrop-blur-sm opacity-0 translate-y-6 transition-all duration-700 ease-out hover:scale-[1.02] hover:border-stone-500 cursor-pointer"
            style={{ transitionDelay: `${itemIndex * 100}ms` }}
            onClick={() => setSelected(item)}
          >
            <div className="overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="h-72 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="space-y-1 p-4">
              <h3 className="text-xs font-semibold uppercase text-stone-300">{item.title}</h3>
              <p className="text-stone-500 text-xs font-light">{item.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 p-4 sm:p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-lg w-full animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto rounded-2xl bg-stone-950/95 border border-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 z-10 text-stone-400 hover:text-white text-xs uppercase tracking-widest font-semibold transition"
            >
              Cerrar ✕
            </button>

            <div className="flex justify-center bg-stone-900/80 px-3 pt-12 pb-2 sm:px-4 sm:pt-14">
              <img
                src={selected.image}
                alt={selected.title}
                className="max-h-[45vh] w-auto max-w-full rounded-xl object-contain sm:max-h-[50vh]"
              />
            </div>

            <div className="mt-4 space-y-1 px-4 pb-4 sm:px-6 sm:pb-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-300">
                {selected.title}
              </h3>
              <p className="text-stone-500 text-xs font-light">{selected.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

