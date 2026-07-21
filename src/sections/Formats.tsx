import { useEffect, useRef, type MouseEvent } from "react";
import { gsap } from "@/lib/anim";
import { usePageTransition } from "@/lib/page-transition";

interface Format {
  id: string;
  title: string;
  desc: string;
  result: string;
  visual: "takeover" | "billboard" | "video" | "branded" | "audio" | "interstitial";
  url: string;
}

const FORMATS: Format[] = [
  {
    id: "01",
    title: "Take Over",
    desc: "El formato de mayor impacto: tu marca toma la portada de RPP durante 24 horas.",
    result: "+200% recuerdo de marca",
    visual: "takeover",
    url: "/formatos/skin-arco",
  },
  {
    id: "02",
    title: "Billboard",
    desc: "Dominio visual al tope de la home: 970×250 de presencia imposible de ignorar.",
    result: "+87% CTR promedio",
    visual: "billboard",
    url: "/formatos/standard/top",
  },
  {
    id: "03",
    title: "Video Pre-Roll",
    desc: "Tu spot, antes del contenido que millones de personas quieren ver.",
    result: "65% view-through rate",
    visual: "video",
    url: "/formatos/video-top-full",
  },
  {
    id: "04",
    title: "Branded Content",
    desc: "Historias producidas por nuestro equipo editorial que la audiencia elige consumir.",
    result: "3× más engagement",
    visual: "branded",
    url: "/formatos",
  },
  {
    id: "05",
    title: "Audio Spot",
    desc: "La radio de siempre en los oídos de hoy: streaming, podcast y señal en vivo.",
    result: "+54% recordación",
    visual: "audio",
    url: "/formatos",
  },
  {
    id: "06",
    title: "Interstitial",
    desc: "Pantalla completa en los momentos clave de navegación. Atención total.",
    result: "92% visibilidad",
    visual: "interstitial",
    url: "/formatos/interstitial",
  },
];

function Visual({ type }: { type: Format["visual"] }) {
  switch (type) {
    case "takeover":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <img src="/images/signal.png" alt="" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-red-deep/60 to-transparent" />
        </div>
      );
    case "video":
      return (
        <div className="absolute inset-0 overflow-hidden">
          <img src="/images/newsroom.png" alt="" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red flex items-center justify-center transition-transform duration-500 group-hover:scale-125">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
        </div>
      );
    case "billboard":
      return (
        <div className="absolute inset-0 bg-ink flex flex-col justify-center gap-2 p-6">
          <div className="h-3 w-2/3 bg-bone/25 rounded-full" />
          <div className="h-3 w-1/2 bg-bone/15 rounded-full" />
          <div className="h-16 w-full bg-red rounded-lg mt-2 flex items-center justify-center overflow-hidden">
            <span className="font-display text-2xl text-white tracking-wide group-hover:scale-110 transition-transform duration-500">970 × 250</span>
          </div>
          <div className="h-3 w-3/4 bg-bone/15 rounded-full mt-2" />
          <div className="h-3 w-1/3 bg-bone/25 rounded-full" />
        </div>
      );
    case "branded":
      return (
        <div className="absolute inset-0 bg-bone-2 flex items-center justify-center overflow-hidden">
          <span className="font-display text-[7rem] leading-none text-ink/10 select-none group-hover:text-red/25 transition-colors duration-700">Aa</span>
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <div className="h-2.5 w-full bg-ink/15 rounded-full" />
            <div className="h-2.5 w-5/6 bg-ink/15 rounded-full" />
            <div className="h-2.5 w-2/3 bg-red/50 rounded-full" />
          </div>
        </div>
      );
    case "audio":
      return (
        <div className="absolute inset-0 bg-ink flex items-end justify-center gap-[5px] p-6 pb-10">
          {Array.from({ length: 26 }).map((_, i) => (
            <span
              key={i}
              className="w-[5px] bg-red rounded-full origin-bottom"
              style={{
                height: `${18 + Math.abs(Math.sin(i * 1.7)) * 62}%`,
                animation: `eq-bounce ${0.7 + (i % 5) * 0.16}s ease-in-out ${i * 0.06}s infinite`,
              }}
            />
          ))}
        </div>
      );
    case "interstitial":
      return (
        <div className="absolute inset-0 bg-bone-2 flex items-center justify-center">
          <div className="w-24 h-44 md:w-28 md:h-52 bg-ink rounded-2xl border-4 border-ink/80 flex items-center justify-center rotate-[-6deg] group-hover:rotate-0 transition-transform duration-700">
            <span className="font-display text-red text-xl rotate-90 md:rotate-90 whitespace-nowrap">FULLSCREEN</span>
          </div>
        </div>
      );
  }
}

export default function Formats() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { transitionTo } = usePageTransition();

  useEffect(() => {
    const root = rootRef.current!;
    const track = trackRef.current!;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const getAmount = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -getAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${getAmount() + window.innerHeight * 0.2}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(root.querySelector(".fmt-progress"), { scaleX: self.progress });
          },
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    // mobile: simple entrance reveals, cards stack vertically
    mm.add("(max-width: 767px)", () => {
      const items = gsap.utils.toArray<HTMLElement>(".fmt-card");
      const tweens = items.map((el) =>
        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 88%" } }
        )
      );
      return () => tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    });

    return () => mm.revert();
  }, []);

  const tilt = (e: MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 9;
    gsap.to(card, { rotateX: rx, rotateY: ry, duration: 0.5, ease: "power2.out" });
  };
  const untilt = (e: MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1,0.4)" });
  };

  return (
    <section ref={rootRef} id="formatos" className="relative bg-red text-white overflow-hidden">
      <div className="md:h-screen md:flex md:flex-col md:justify-center py-24 md:py-0">
        {/* header */}
        <div className="px-5 md:px-10 mb-10 md:mb-12 flex items-end justify-between shrink-0">
          <div>
            <p className="font-mono2 text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/60 mb-4">
              <span className="text-ink">03</span> — Formatos destacados
            </p>
            <h2 className="font-display uppercase leading-[0.95] text-[11vw] md:text-[5.5vw]">
              Formatos que<br />se hacen <span className="text-ink">notar</span>
            </h2>
          </div>
          <p className="hidden md:block font-mono2 text-[10px] tracking-[0.25em] uppercase text-white/60 pb-2">
            Desliza para explorar →
          </p>
        </div>

        {/* cards track */}
        <div className="px-5 md:px-10">
          <div ref={trackRef} className="flex flex-col md:flex-row gap-6 md:gap-8 md:w-max">
            {FORMATS.map((f) => (
              <a
                key={f.id}
                href={f.url}
                onClick={(e) => {
                  e.preventDefault();
                  transitionTo(f.url);
                }}
                onMouseMove={tilt}
                onMouseLeave={untilt}
                data-cursor="VER"
                className="fmt-card group relative shrink-0 block w-full md:w-[30rem] lg:w-[34rem] bg-bone text-ink rounded-2xl overflow-hidden"
              >
                <div className="relative h-52 md:h-64">
                  <Visual type={f.visual} />
                  <span className="absolute top-4 left-4 font-display text-5xl text-white/90 mix-blend-difference">{f.id}</span>
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="font-display uppercase text-3xl md:text-4xl mb-3 group-hover:text-red transition-colors duration-300">{f.title}</h3>
                  <p className="text-ink/60 text-sm md:text-base leading-relaxed mb-6">{f.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 bg-ink text-bone font-mono2 text-[10px] tracking-[0.15em] uppercase px-4 py-2 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-red" />
                      {f.result}
                    </span>
                    <span className="w-10 h-10 rounded-full border border-ink/20 flex items-center justify-center group-hover:bg-red group-hover:border-red group-hover:text-white transition-all duration-300 group-hover:rotate-45">
                      ↗
                    </span>
                  </div>
                </div>
              </a>
            ))}

            {/* end CTA card */}
            <a
              href="#contacto"
              onClick={(e) => e.preventDefault()}
              data-cursor="ESCRIBE"
              className="group relative shrink-0 w-full md:w-[22rem] rounded-2xl border border-white/30 flex flex-col justify-between p-8 hover:bg-white/10 transition-colors duration-500 min-h-[20rem]"
            >
              <span className="font-mono2 text-[10px] tracking-[0.3em] uppercase text-white/60">¿Otro formato?</span>
              <div>
                <p className="font-display uppercase text-4xl md:text-5xl leading-none mb-6">
                  Hablemos<br />de tu<br />campaña
                </p>
                <span className="inline-flex items-center gap-3 font-mono2 text-[11px] tracking-[0.2em] uppercase">
                  Contactar <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* progress */}
        <div className="hidden md:block px-10 mt-12 shrink-0">
          <div className="h-[2px] bg-white/20 rounded-full overflow-hidden">
            <div className="fmt-progress h-full w-full bg-white origin-left scale-x-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
