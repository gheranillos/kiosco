/**
 * El Kiosco — Animations
 * Solo animaciones; sin modificar lógica ni contenido.
 * Vanilla JS ES6+, Intersection Observer nativo.
 */
(function () {
  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Hero: título letra a letra (stagger 80ms) --- */
  function initHeroLetters() {
    const title = document.querySelector("[data-hero-title]");
    if (!title || prefersReducedMotion()) return;

    const text = title.textContent;
    title.textContent = "";
    const fragment = document.createDocumentFragment();

    [...text].forEach((char, i) => {
      const span = document.createElement("span");
      span.className = "anim-hero-letter";
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.animationDelay = `${i * 80}ms`;
      fragment.appendChild(span);
    });

    title.appendChild(fragment);
  }

  /* --- Scroll reveal: Intersection Observer (threshold 0.15) --- */
  function initScrollReveal() {
    if (prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    document.querySelectorAll("[data-reveal-stagger]").forEach((el) => observer.observe(el));
    document.querySelectorAll(".anim-drop-image-wrap").forEach((el) => observer.observe(el));
    document.querySelectorAll("[data-cta-container]").forEach((el) => observer.observe(el));
  }

  /* --- Header: reducir padding + backdrop-blur al scroll --- */
  function initHeaderScroll() {
    const header = document.querySelector("[data-animate-header]");
    if (!header || prefersReducedMotion()) return;

    let lastY = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      if (y > 60) {
        header.classList.add("scrolled", "anim-header");
      } else {
        header.classList.remove("scrolled");
      }
      lastY = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --- CTA submit: efecto checkmark al hacer click (solo visual) --- */
  function initCtaSuccess() {
    const btn = document.querySelector("[data-cta-submit]");
    if (!btn || prefersReducedMotion()) return;

    btn.addEventListener("click", function () {
      const form = this.closest("form");
      if (!form) return;

      let overlay = form.querySelector(".anim-cta-success-overlay");
      if (overlay) return;

      overlay = document.createElement("div");
      overlay.className = "anim-cta-success-overlay";
      overlay.setAttribute("aria-hidden", "true");
      overlay.innerHTML = `
        <span class="anim-cta-success-visible" style="
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.4); border-radius: 2rem; pointer-events: none;
        ">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #fff;">
            <path class="anim-cta-success-check" d="M5 12l5 5L20 7"/>
          </svg>
        </span>
      `;
      overlay.style.cssText =
        "position: absolute; inset: 0; border-radius: 2rem; overflow: hidden; pointer-events: none;";
      form.style.position = "relative";
      form.appendChild(overlay);

      setTimeout(() => {
        overlay.remove();
      }, 2000);
    });
  }

  /* --- Inicialización cuando el DOM está listo --- */
  function init() {
    initHeroLetters();
    initScrollReveal();
    initHeaderScroll();
    initCtaSuccess();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
