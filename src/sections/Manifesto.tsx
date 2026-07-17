import { useEffect, useRef } from "react";
import { gsap, splitWords } from "@/lib/anim";

const TEXT =
  "Tenemos un nivel de llegada en todo el Perú. Nuestro compromiso va más allá del alcance: somos el medio en el que las personas confían cuando informan sus decisiones.";

export default function Manifesto() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const q = gsap.utils.selector(rootRef);
    const ctx = gsap.context(() => {
      // word-by-word color scrub
      gsap.to(q(".word-scrub .w"), {
        color: "#f3f1ec",
        stagger: 0.06,
        ease: "none",
        scrollTrigger: {
          trigger: q(".word-scrub")[0] as HTMLElement,
          start: "top 78%",
          end: "bottom 45%",
          scrub: 0.6,
        },
      });

      // image clip reveal + parallax
      gsap.fromTo(
        q(".mani-img-wrap"),
        { clipPath: "inset(12% 8% 12% 8%)", scale: 1.06 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: q(".mani-img-wrap")[0] as HTMLElement,
            start: "top 90%",
            end: "top 25%",
            scrub: true,
          },
        }
      );
      gsap.fromTo(
        q(".mani-img"),
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: q(".mani-img-wrap")[0] as HTMLElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        q(".mani-side"),
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          stagger: 0.12,
          scrollTrigger: { trigger: rootRef.current, start: "top 55%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative bg-ink py-28 md:py-40 px-5 md:px-10 overflow-hidden">
      <p className="mani-side font-mono2 text-[10px] md:text-xs tracking-[0.3em] uppercase text-bone/40 mb-10">
        <span className="text-red">02</span> — Prestigio y confianza asegurada
      </p>

      <p className="word-scrub max-w-5xl font-medium text-[6.4vw] md:text-[3.4vw] leading-[1.18] tracking-tight">
        {splitWords(TEXT).map((w, i) => (
          <span key={i} className="w inline-block mr-[0.28em]">
            {w}
          </span>
        ))}
      </p>

      <div className="mt-16 md:mt-24 grid md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8 mani-img-wrap relative overflow-hidden rounded-2xl h-[46vh] md:h-[72vh]">
          <img src="/images/newsroom.png" alt="Sala de redacción GRPP" className="mani-img absolute inset-0 w-full h-[120%] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red animate-pulse" />
            <span className="font-mono2 text-[10px] tracking-[0.25em] uppercase text-bone/80">En vivo — Central de noticias</span>
          </div>
        </div>
        <div className="md:col-span-4 flex flex-col gap-6">
          <p className="mani-side text-bone/55 text-base leading-relaxed">
            Credibilidad construida durante seis décadas. Cuando tu marca aparece en nuestros medios, hereda esa confianza.
          </p>
          <a
            href="#contacto"
            onClick={(e) => e.preventDefault()}
            data-cursor="hover"
            className="mani-side u-link inline-flex items-center gap-3 font-mono2 text-[11px] tracking-[0.2em] uppercase text-red w-fit"
          >
            Leer nota <span aria-hidden>→</span>
          </a>
          <div className="mani-side flex gap-10 border-t border-white/10 pt-6">
            <div>
              <p className="font-display text-3xl md:text-4xl text-bone">97%</p>
              <p className="font-mono2 text-[9px] tracking-[0.2em] uppercase text-bone/40 mt-1">Recordación publicitaria</p>
            </div>
            <div>
              <p className="font-display text-3xl md:text-4xl text-bone">24h</p>
              <p className="font-mono2 text-[9px] tracking-[0.2em] uppercase text-bone/40 mt-1">Cobertura continua</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
