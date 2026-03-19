"use client";

import { GlowCard } from "@/components/ui/spotlight-card";

const steps = [
  {
    number: "01",
    title: "Te registras",
    description: "Dejas tu nombre, correo e Instagram para entrar a la lista.",
  },
  {
    number: "02",
    title: "Recibes acceso",
    description:
      "Te avisamos primero cuando salgan fecha, precio y cantidad disponible.",
  },
  {
    number: "03",
    title: "Entras temprano",
    description: "Conectas con más creativos y personas que comparten tu visión.",
  },
];

export function StepsSection() {
  return (
    <section
      data-reveal
      className="anim-reveal border-y border-stone-800 bg-stone-900/60"
    >
      <div
        data-reveal-stagger
        className="anim-reveal-stagger mx-auto grid max-w-7xl gap-6 px-6 py-12 md:grid-cols-3 md:px-10"
      >
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="opacity-0 translate-y-6 transition-all duration-700 ease-out"
            style={{ transitionDelay: `${index * 150}ms` }}
            ref={(el) => {
              if (!el) return;
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting) {
                    el.classList.remove("opacity-0", "translate-y-6");
                    observer.disconnect();
                  }
                },
                { threshold: 0.2 }
              );
              observer.observe(el);
            }}
          >
            <GlowCard className="rounded-[2rem] border border-stone-800 p-6 min-h-[220px] group">
              <div className="flex flex-col justify-between h-full gap-6">
                <span className="text-[5rem] font-black leading-none tracking-tighter text-stone-800 select-none transition-all duration-500 group-hover:text-stone-600">
                  {step.number}
                </span>

                <div className="space-y-2">
                  <div className="h-px w-8 bg-stone-600 transition-all duration-500 group-hover:w-full group-hover:bg-stone-400" />

                  <h3 className="text-lg font-black uppercase leading-tight tracking-tight text-stone-100 transition-all duration-300">
                    {step.title}
                  </h3>
                  <p className="text-xs leading-5 text-stone-500 font-light">
                    {step.description}
                  </p>
                </div>
              </div>
            </GlowCard>
          </div>
        ))}
      </div>
    </section>
  );
}

