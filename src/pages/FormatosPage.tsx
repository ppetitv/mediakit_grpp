import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/anim";
import { getLenis, setLenis } from "@/lib/scroll";
import Navbar from "@/sections/Navbar";
import Cursor from "@/sections/Cursor";
import Contact from "@/sections/Contact";
import Footer from "@/sections/Footer";
import Magnetic from "@/components/Magnetic";
import FormatExplorer from "@/components/formats/FormatExplorer";
import FormatPreview from "@/components/formats/FormatPreview";

const PRODUCT_AREAS = ["Display", "Branded Content", "Streaming"];

export default function FormatosPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Formatos digitales | GRPP Media Kit 2026";
    window.scrollTo(0, 0);
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
        intro
          .fromTo("[data-format-eyebrow]", { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 })
          .fromTo("[data-format-title] > span", { yPercent: 110 }, { yPercent: 0, duration: 1.15, stagger: 0.1 }, "-=0.35")
          .fromTo("[data-format-intro]", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08 }, "-=0.65")
          .fromTo("[data-hero-stage]", { x: 60, rotate: 2, autoAlpha: 0 }, { x: 0, rotate: 0, autoAlpha: 1, duration: 1.2 }, "-=1");

        gsap.to("[data-format-ghost]", {
          xPercent: -12,
          ease: "none",
          scrollTrigger: { trigger: "[data-formats-hero]", start: "top top", end: "bottom top", scrub: 1.2 },
        });
        gsap.to("[data-hero-stage]", {
          yPercent: 18,
          rotate: -2,
          ease: "none",
          scrollTrigger: { trigger: "[data-formats-hero]", start: "top top", end: "bottom top", scrub: 1.2 },
        });
      }, root);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.5 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={rootRef} className="min-h-[100dvh] bg-ink">
      <Cursor />
      <Navbar />

      <main>
        <section data-formats-hero className="relative flex min-h-[100dvh] items-end overflow-hidden bg-ink px-5 pb-16 pt-32 text-bone md:px-10 md:pb-20">
          <div data-format-ghost aria-hidden="true" className="pointer-events-none absolute left-[4%] top-[18%] whitespace-nowrap font-display text-[34vw] uppercase leading-none text-bone/[0.025]">Formatos</div>
          <div className="absolute inset-y-0 left-[68%] hidden w-px bg-white/10 md:block" />
          <div className="absolute bottom-0 left-0 h-px w-full bg-white/10" />

          <div className="relative mx-auto grid w-full max-w-[1400px] gap-14 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p data-format-eyebrow className="mb-7 font-mono2 text-[10px] uppercase tracking-[0.3em] text-bone/45"><span className="text-red">01</span> / Formatos digitales</p>
              <h1 data-format-title className="font-display text-[20vw] uppercase leading-[0.79] tracking-[0.01em] md:text-[9.4vw]">
                <span className="reveal-line"><span>Ideas que</span></span>
                <span className="reveal-line"><span className="text-red">toman</span></span>
                <span className="reveal-line"><span>la pantalla</span></span>
              </h1>
              <div className="mt-9 grid gap-8 md:grid-cols-7 md:items-end">
                <p data-format-intro className="max-w-lg text-base leading-relaxed text-bone/[0.58] md:col-span-4 md:text-lg">Explora cómo una idea puede aparecer, moverse y responder dentro del ecosistema digital de GRPP.</p>
                <div data-format-intro className="flex gap-3 md:col-span-3 md:justify-end">
                  <Magnetic strength={0.22}>
                    <button onClick={() => scrollTo("catalogo-formatos")} data-cursor="hover" className="rounded-full bg-red px-5 py-3.5 font-mono2 text-[9px] uppercase tracking-[0.17em] text-white transition-colors duration-300 hover:bg-bone hover:text-ink md:px-6">Explorar formatos</button>
                  </Magnetic>
                </div>
              </div>
            </div>

            <div data-hero-stage className="relative md:col-span-5 md:pl-8">
              <FormatPreview visual="interscroller" title="Interscroller" />
              <div className="absolute -left-4 top-7 rounded-full bg-bone px-4 py-2 font-mono2 text-[8px] uppercase tracking-[0.16em] text-ink md:-left-8">Scroll to reveal</div>
              <div className="absolute -bottom-5 right-5 flex h-20 w-20 items-center justify-center rounded-full bg-red font-display text-2xl uppercase text-white md:h-24 md:w-24 md:text-3xl">360°</div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-ink px-5 py-8 text-bone md:px-10">
          <div className="mx-auto grid max-w-[1400px] gap-5 md:grid-cols-12 md:items-center">
            <p className="font-mono2 text-[9px] uppercase tracking-[0.24em] text-bone/35 md:col-span-3">Ecosistema de formatos</p>
            <div className="flex flex-wrap gap-x-7 gap-y-3 md:col-span-9 md:justify-end md:gap-x-12">
              {PRODUCT_AREAS.map((area, index) => (
                <span key={area} className={`font-display text-2xl uppercase md:text-4xl ${index === 0 ? "text-red" : "text-bone/[0.28]"}`}>{area}</span>
              ))}
            </div>
          </div>
        </section>

        <FormatExplorer />

        <section className="relative overflow-hidden bg-red px-5 py-24 text-white md:px-10 md:py-36">
          <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-12 md:items-end">
            <p className="font-mono2 text-[10px] uppercase tracking-[0.28em] text-white/55 md:col-span-3">Del formato a la idea</p>
            <div className="md:col-span-9">
              <h2 className="font-display text-[15vw] uppercase leading-[0.84] md:text-[7.4vw]">No elijas un espacio.<br /><span className="text-ink">Diseña una presencia.</span></h2>
              <div className="mt-9 flex flex-col gap-7 border-t border-white/25 pt-7 md:flex-row md:items-center md:justify-between">
                <p className="max-w-xl text-sm leading-relaxed text-white/[0.68] md:text-base">Nuestro equipo puede combinar formatos, señales y momentos de consumo alrededor del objetivo de tu campaña.</p>
                <Magnetic strength={0.2}>
                  <button onClick={() => scrollTo("contacto")} data-cursor="hover" className="rounded-full bg-ink px-6 py-4 font-mono2 text-[9px] uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:bg-bone hover:text-ink">Diseñar mi campaña →</button>
                </Magnetic>
              </div>
            </div>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </div>
  );
}
