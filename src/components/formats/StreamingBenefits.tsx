import { useLayoutEffect, useRef } from "react";
import { Handshake, MonitorSmartphone, ShieldCheck, UsersRound } from "lucide-react";
import { gsap } from "@/lib/anim";

const RING_LENGTH = 2 * Math.PI * 48;

const BENEFITS = [
  {
    title: "Audiencias",
    accent: "reales",
    icon: UsersRound,
    description: "Comunidad activa, fiel y de alta participación mediante interacciones tanto en diferido como en vivo.",
  },
  {
    title: "Integración",
    accent: "orgánica",
    icon: MonitorSmartphone,
    description: "Nuestras menciones y secuencias se integran de forma natural al contenido, generando credibilidad y aceptación.",
  },
  {
    title: "Ecosistema",
    accent: "multiplataforma",
    icon: ShieldCheck,
    description: "Amplificamos tu mensaje en radio, TV, digital y streaming para maximizar el alcance y el impacto.",
  },
  {
    title: "Flexibilidad",
    accent: "comercial",
    icon: Handshake,
    description: "Soluciones a la medida de tus objetivos de marca, desde branding hasta secuencias exclusivas y experiencias personalizadas.",
  },
];

export default function StreamingBenefits() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add({
        motion: "(prefers-reduced-motion: no-preference)",
        wide: "(min-width: 1280px)",
      }, (match) => {
        if (!match.conditions?.motion) return;

        gsap.from("[data-benefits-intro]", {
          y: 28,
          autoAlpha: 0,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-benefits-heading]",
            start: "top 85%",
            end: "top 55%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        gsap.fromTo("[data-benefits-progress]", { scaleX: 0 }, {
          scaleX: 1,
          ease: "none",
          transformOrigin: "left center",
          scrollTrigger: { trigger: root, start: "top 75%", end: "bottom 75%", scrub: 0.6 },
        });

        gsap.utils.toArray<HTMLElement>("[data-streaming-benefit]").forEach((card, index) => {
          const timeline = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: card,
              start: `top ${match.conditions?.wide ? 84 - index * 4 : 82}%`,
              end: "top 36%",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
          timeline
            .from(card, { y: 56, autoAlpha: 0, duration: 0.65 })
            .fromTo(card.querySelector("[data-benefit-ring]"), {
              strokeDashoffset: RING_LENGTH,
            }, { strokeDashoffset: 0, duration: 1.4, ease: "none" }, 0.1)
            .from(card.querySelector("[data-benefit-icon]"), {
              scale: 0.8, autoAlpha: 0, duration: 0.6,
            }, 0.2)
            .from(card.querySelectorAll("[data-benefit-copy]"), {
              y: 14, autoAlpha: 0, duration: 0.65, stagger: 0.1,
            }, 0.25)
            .from(card.querySelector("[data-benefit-rule]"), {
              scaleX: 0, transformOrigin: "left center", duration: 0.65,
            }, 0.4);
        });
      });
    }, root);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="relative bg-ink px-5 pb-4 pt-20 text-bone md:px-10 md:pt-28">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-white/15">
        <div data-benefits-progress className="h-full bg-red" />
      </div>
      <div className="mx-auto max-w-[1240px] border-b border-white/15 pb-16 md:pb-20">
        <div data-benefits-heading className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p data-benefits-intro className="text-[9px] uppercase tracking-[0.22em] text-bone/45">El valor de conectar</p>
            <h3 data-benefits-intro className="mt-6 font-display text-[12vw] uppercase leading-[0.95] sm:text-6xl md:text-[5vw]">
              ¿Por qué <span className="text-red">streaming</span><br />de GRPP?
            </h3>
          </div>
          <p data-benefits-intro className="max-w-md text-sm leading-relaxed text-bone/65 lg:col-span-5 lg:pb-1">
            Más que contenido, creamos <span className="text-bone">conexiones reales</span> entre marcas y audiencias.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
          {BENEFITS.map(({ title, accent, icon: Icon, description }, index) => (
            <article key={title} data-streaming-benefit className="relative flex min-w-0 flex-col rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 md:px-5 md:py-7">
              <span aria-hidden="true" className="absolute right-5 top-5 text-[9px] tracking-widest text-bone/30">0{index + 1}</span>
              <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
                <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90 fill-none">
                  <circle cx="50" cy="50" r="48" className="stroke-white/10" strokeWidth="1" />
                  <circle data-benefit-ring cx="50" cy="50" r="48" strokeDasharray={RING_LENGTH} strokeDashoffset="0" className="stroke-red" strokeWidth="1.5" />
                </svg>
                <Icon data-benefit-icon aria-hidden="true" className="h-10 w-10 text-bone" strokeWidth={1.25} />
              </div>
              <h4 data-benefit-copy className="font-display text-[2.1rem] uppercase leading-none xl:text-[1.8rem] 2xl:text-[2.1rem]">
                {title}<br /><span className="text-red">{accent}</span>
              </h4>
              <div data-benefit-rule aria-hidden="true" className="my-6 h-px w-12 bg-red" />
              <p data-benefit-copy className="text-[13px] leading-relaxed text-bone/65">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
