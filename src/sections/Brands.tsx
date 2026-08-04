import { useEffect, useRef } from "react";
import { gsap } from "@/lib/anim";

const BRAND_LOGOS = [
  { name: "RPP", src: "/images/rpp_logo.svg", size: "w-16 md:w-24", offset: "md:translate-y-1" },
  { name: "Studio92", src: "/images/studio92_logo.svg", size: "w-28 md:w-40", offset: "md:translate-y-2" },
  { name: "Oxígeno", src: "/images/oxigeno_logo.svg", size: "w-28 md:w-40", offset: "md:translate-y-1" },
  { name: "MegaMix", src: "/images/megamix_logo.svg", size: "w-20 md:w-28", offset: "md:-translate-y-2" },
  { name: "La Zona", src: "/images/lazona_logo.svg", size: "w-28 md:w-36", offset: "md:-translate-y-1" },
  { name: "Felicidad", src: "/images/felicidad_logo.svg", size: "w-28 md:w-36", offset: "md:-translate-y-2" },
  { name: "Corazón", src: "/images/corazon_logo.svg", size: "w-24 md:w-36", offset: "md:translate-y-1" },
  { name: "Disney", src: "/images/disney_logo.svg", size: "w-24 md:w-32", offset: "md:translate-y-1" },
  { name: "Stars", src: "/images/stars_logo.svg", size: "w-28 md:w-40", offset: "md:-translate-y-1" },
  { name: "Ooh La", src: "/images/oohla_logo.svg", size: "w-28 md:w-40", offset: "md:translate-y-2" },
  { name: "AudioPlayer", src: "/images/audioplayer_logo.svg", size: "w-36 md:w-52", offset: "md:-translate-y-1" },
];

export default function Brands() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const q = gsap.utils.selector(rootRef);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        q(".brands-head"),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.1,
          scrollTrigger: { trigger: rootRef.current, start: "top 70%" },
        }
      );

      gsap.fromTo(
        q(".brand-logo"),
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: q(".brand-logos"), start: "top 85%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="marcas" className="relative bg-bone px-5 py-24 text-ink md:px-10 md:py-36">
      <div className="brands-head mb-14 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="font-mono2 text-[10px] md:text-xs tracking-[0.3em] uppercase text-ink/50 mb-4">
            <span className="text-red">02</span> — Nuestras marcas
          </p>
          <h2 className="font-display uppercase leading-[0.95] text-[11vw] md:text-[6.5vw]">
            Un ecosistema de<br />contenidos para <span className="text-red">cada audiencia</span>
          </h2>
        </div>
        <p className="brands-head max-w-xs text-sm text-ink/55 leading-relaxed md:pb-2">
          Cada marca conecta con una audiencia distinta. Tu anuncio encuentra el canal perfecto para llegar a quien importa.
        </p>
      </div>

      <div className="brand-logos border-t border-ink/15 pt-8 md:pt-10">
        <div className="grid grid-cols-2 items-center gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-6 md:gap-x-6 md:gap-y-10">
          {BRAND_LOGOS.map((brand) => (
            <div
              key={brand.name}
              className={`brand-logo group flex min-h-16 items-center justify-center ${brand.offset}`}
              data-cursor="hover"
            >
              <img
                src={brand.src}
                alt={brand.name}
                className={`block object-contain grayscale opacity-55 transition-[filter,opacity,transform] duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 ${brand.size}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}