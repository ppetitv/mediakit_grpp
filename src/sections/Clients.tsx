import { useEffect, useRef } from "react";
import { gsap } from "@/lib/anim";
import VelocityMarquee from "@/components/VelocityMarquee";

interface ClientLogo {
  src: string;
  name: string;
}

const ROW_A: ClientLogo[] = [
  { src: "/images/clientes/latam-airlines.svg", name: "LATAM Airlines" },
  { src: "/images/clientes/alicorp.svg", name: "Alicorp" },
  { src: "/images/clientes/intercorp.svg", name: "Intercorp" },
  { src: "/images/clientes/pacifico_seguros.svg", name: "Pacífico Seguros" },
];

const ROW_B: ClientLogo[] = [
  { src: "/images/clientes/pacifico_seguros.svg", name: "Pacífico Seguros" },
  { src: "/images/clientes/intercorp.svg", name: "Intercorp" },
  { src: "/images/clientes/alicorp.svg", name: "Alicorp" },
  { src: "/images/clientes/latam-airlines.svg", name: "LATAM Airlines" },
];

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
    <section ref={rootRef} id="clientes" className="relative bg-bone text-ink py-24 md:py-36 overflow-hidden">
      <div className="px-5 md:px-10 mb-14 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="clients-head font-mono2 text-[10px] md:text-xs tracking-[0.3em] uppercase text-ink/50 mb-4">
            <span className="text-red">05</span> — Clientes
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
        <VelocityMarquee baseSpeed={70} className="border-y border-ink/10 py-5 md:py-7 bg-bone">
          {ROW_A.map((logo) => (
            <span key={logo.src} className="flex items-center shrink-0">
              <img
                src={logo.src}
                alt={logo.name}
                title={logo.name}
                draggable={false}
                className="h-10 md:h-14 w-auto px-6 md:px-8 select-none object-contain"
              />
              <span className="font-mono2 text-red text-xl md:text-2xl shrink-0">✦</span>
            </span>
          ))}
        </VelocityMarquee>

        <VelocityMarquee baseSpeed={55} reverse className="border-b border-ink/10 py-5 md:py-7 bg-bone">
          {ROW_B.map((logo) => (
            <span key={logo.src} className="flex items-center shrink-0">
              <img
                src={logo.src}
                alt={logo.name}
                title={logo.name}
                draggable={false}
                className="h-10 md:h-14 w-auto px-6 md:px-8 select-none object-contain grayscale opacity-40"
              />
              <span className="font-mono2 text-red text-xl md:text-2xl shrink-0">✦</span>
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