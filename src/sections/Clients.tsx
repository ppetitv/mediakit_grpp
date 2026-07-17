import { useEffect, useRef } from "react";
import { gsap } from "@/lib/anim";
import VelocityMarquee from "@/components/VelocityMarquee";

const CLIENTS_A = ["Latam Airlines", "Alicorp", "Intercorp", "Pacífico Seguros"];
const CLIENTS_B = ["Alicorp", "Pacífico Seguros", "Latam Airlines", "Intercorp"];

export default function Clients() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const q = gsap.utils.selector(rootRef);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        q(".clients-head"),
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.12,
          scrollTrigger: { trigger: rootRef.current, start: "top 70%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="marcas" className="relative bg-bone text-ink py-24 md:py-36 overflow-hidden">
      <div className="px-5 md:px-10 mb-14 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="clients-head font-mono2 text-[10px] md:text-xs tracking-[0.3em] uppercase text-ink/50 mb-4">
            <span className="text-red">04</span> — Clientes
          </p>
          <h2 className="clients-head font-display uppercase leading-[0.95] text-[11vw] md:text-[6.5vw]">
            Marcas que<br /><span className="text-red">confían</span> en nosotros
          </h2>
        </div>
        <p className="clients-head max-w-xs text-sm text-ink/55 leading-relaxed md:pb-2">
          Los anunciantes más importantes del país ya potencian sus campañas con nuestros formatos.
        </p>
      </div>

      <div className="space-y-3 md:space-y-5 -rotate-1">
        <VelocityMarquee baseSpeed={70} className="border-y border-ink/10 py-4 md:py-6 bg-bone">
          {CLIENTS_A.map((c) => (
            <span key={c} className="flex items-center shrink-0">
              <span className="font-display uppercase text-[9vw] md:text-[4.5vw] leading-none text-ink px-6 md:px-10 hover:text-red transition-colors duration-300" data-cursor="hover">
                {c}
              </span>
              <span className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red shrink-0" />
            </span>
          ))}
        </VelocityMarquee>

        <VelocityMarquee baseSpeed={55} reverse className="border-b border-ink/10 py-4 md:py-6 bg-bone">
          {CLIENTS_B.map((c) => (
            <span key={c} className="flex items-center shrink-0">
              <span className="font-display uppercase text-[9vw] md:text-[4.5vw] leading-none text-stroke px-6 md:px-10" style={{ WebkitTextStrokeColor: "rgba(11,11,12,0.55)" }}>
                {c}
              </span>
              <span className="font-mono2 text-red text-xl md:text-3xl shrink-0">✦</span>
            </span>
          ))}
        </VelocityMarquee>
      </div>

      <p className="px-5 md:px-10 mt-12 font-mono2 text-[10px] tracking-[0.25em] uppercase text-ink/40 text-center">
        +300 campañas activas cada año en nuestras plataformas
      </p>
    </section>
  );
}
