import { useEffect, useRef } from "react";
import { gsap } from "@/lib/anim";

const STATS = [
  { value: 21.8, decimals: 1, prefix: "+", suffix: "M", label: "Personas alcanzadas al mes" },
  { value: 10, decimals: 0, prefix: "+", suffix: "", label: "Marcas líderes de audiencia" },
  { value: 62, decimals: 0, prefix: "", suffix: "", label: "Años de trayectoria" },
  { value: 1, decimals: 0, prefix: "#", suffix: "", label: "En credibilidad en el país" },
];

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

export default function Stats() {
  const rootRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const q = gsap.utils.selector(rootRef);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        q(".stat-line"),
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power4.inOut",
          stagger: 0.12,
          scrollTrigger: { trigger: rootRef.current, start: "top 70%" },
        }
      );

      q<HTMLElement>(".stat-num").forEach((el) => {
        const target = parseFloat(el.dataset.value!);
        const decimals = parseInt(el.dataset.decimals || "0");
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%" },
          onUpdate: () => {
            el.textContent = obj.v.toFixed(decimals);
          },
        });
      });

      gsap.fromTo(
        q(".stat-item"),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.1,
          scrollTrigger: { trigger: rootRef.current, start: "top 65%" },
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
    <section ref={rootRef} id="audiencia" className="relative z-10 mt-[6px] rounded-t-[2rem] bg-bone px-5 py-24 text-ink md:-mt-6 md:rounded-t-[3rem] md:px-10 md:py-36">
      <div className="flex items-end justify-between mb-14 md:mb-20">
        <div>
          <p className="font-mono2 text-[10px] md:text-xs tracking-[0.3em] uppercase text-ink/50 mb-4">
            <span className="text-red">01</span> — Audiencia
          </p>
          <h2 className="font-display uppercase leading-[0.95] text-[11vw] md:text-[6.5vw]">
            Los números<br />que nos <span className="text-red">respaldan</span>
          </h2>
        </div>
        <p className="hidden md:block max-w-xs text-sm text-ink/55 leading-relaxed pb-2">
          Cada día, millones de peruanos eligen informarse, entretenerse y conectar a través de nuestras marcas. Tu anuncio puede estar ahí.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {STATS.map((s, i) => (
          <div key={i} className="stat-item group" data-cursor="hover">
            <div className="stat-line h-[3px] bg-red origin-left mb-6" />
            <p className="font-display text-[16vw] md:text-[7.5vw] lg:text-[6vw] leading-none tabular-nums group-hover:text-red transition-colors duration-500">
              {s.prefix}
              <span className="stat-num" data-value={s.value} data-decimals={s.decimals}>
                0
              </span>
              {s.suffix}
            </p>
            <p className="mt-4 font-mono2 text-[10px] md:text-xs tracking-[0.2em] uppercase text-ink/55">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="brand-logos mt-24 border-t border-ink/15 pt-8 md:mt-32 md:pt-10">
        <div className="mb-8 flex items-baseline justify-between gap-6 md:mb-10">
          <p className="font-mono2 text-[10px] uppercase tracking-[0.2em] text-ink/50 md:text-xs">
            Un ecosistema de contenidos para cada audiencia.
          </p>
        </div>

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
