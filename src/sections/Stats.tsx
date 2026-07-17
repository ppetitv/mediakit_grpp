import { useEffect, useRef } from "react";
import { gsap } from "@/lib/anim";

const STATS = [
  { value: 21.8, decimals: 1, prefix: "+", suffix: "M", label: "Personas alcanzadas al mes" },
  { value: 10, decimals: 0, prefix: "+", suffix: "", label: "Marcas líderes de audiencia" },
  { value: 62, decimals: 0, prefix: "", suffix: "", label: "Años de trayectoria" },
  { value: 1, decimals: 0, prefix: "#", suffix: "", label: "En credibilidad en el país" },
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
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="audiencia" className="relative bg-bone text-ink py-24 md:py-36 px-5 md:px-10 rounded-t-[2rem] md:rounded-t-[3rem] -mt-6 z-10">
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
    </section>
  );
}
