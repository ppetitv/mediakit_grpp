import { useLayoutEffect, useRef } from "react";
import Magnetic from "@/components/Magnetic";
import { gsap } from "@/lib/anim";
import { getLenis } from "@/lib/scroll";

const benefits = [
  {
    id: "01",
    title: "Alcance",
    description:
      "Tu campaña puede llegar a una audiencia más amplia y especializada gracias a las comunidades cautivas de nuestros influencers.",
  },
  {
    id: "02",
    title: "Credibilidad y confianza",
    description:
      "Nuestros influencers construyen relaciones sólidas con sus seguidores basadas en la autenticidad y la confianza. Su recomendación resulta más creíble que la publicidad tradicional e influye en la decisión de compra.",
  },
  {
    id: "03",
    title: "Engagement",
    description:
      "Los seguidores de nuestros influencers están comprometidos con la persona que siguen y con su contenido, logrando una interacción más orgánica.",
  },
  {
    id: "04",
    title: "Territorios de contenido",
    description:
      "Contamos con influencers especializados en nichos específicos como belleza, moda, deportes y entretenimiento.",
  },
];

function StarMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className={className} fill="currentColor">
      <path d="M50 3.5 61.2 37l35.3.3-28.4 20.9 10.6 33.7L50 71.5 21.3 91.9l10.6-33.7L3.5 37.3l35.3-.3L50 3.5Z" />
    </svg>
  );
}

function StarOutline({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className={className} fill="none">
      <path
        d="M50 3.5 61.2 37l35.3.3-28.4 20.9 10.6 33.7L50 71.5 21.3 91.9l10.6-33.7L3.5 37.3l35.3-.3L50 3.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function StarsSection() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-stars-cast]",
        { yPercent: 12, scale: 0.97, autoAlpha: 0 },
        {
          yPercent: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 1.15,
          ease: "power4.out",
          scrollTrigger: { trigger: "[data-stars-cast]", start: "top 88%", once: true },
        },
      );

      gsap.fromTo(
        "[data-stars-orbit]",
        { rotation: -9, scale: 0.88, autoAlpha: 0 },
        {
          rotation: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-stars-orbit]", start: "top 90%", once: true },
        },
      );

      gsap.fromTo(
        "[data-stars-card]",
        { y: 46, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          stagger: 0.09,
          ease: "power4.out",
          scrollTrigger: { trigger: "[data-stars-benefits]", start: "top 76%", once: true },
        },
      );

      gsap.fromTo(
        "[data-stars-benefit-reveal]",
        { y: 38, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: { trigger: "[data-stars-benefits-intro]", start: "top 78%", once: true },
        },
      );

      const horizontal = root.querySelector<HTMLElement>("[data-stars-horizontal]");
      const horizontalTrack = root.querySelector<HTMLElement>("[data-stars-horizontal-track]");
      if (horizontal && horizontalTrack) {
        media.add("(min-width: 768px)", () => {
          const horizontalTween = gsap.fromTo(
            horizontalTrack,
            { x: () => horizontal.clientWidth + 2 },
            {
              x: () => -horizontalTrack.scrollWidth - 2,
              ease: "none",
              scrollTrigger: {
                trigger: horizontal,
                start: "top top",
                end: () => `+=${Math.max(horizontalTrack.scrollWidth * 1.35, horizontal.clientWidth * 2)}`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            },
          );

          gsap.utils.toArray<HTMLElement>("[data-stars-horizontal-item]").forEach((item, index) => {
            gsap.fromTo(
              item,
              { yPercent: index % 2 === 0 ? -28 : 28, autoAlpha: 0.25 },
              {
                yPercent: 0,
                autoAlpha: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: item,
                  containerAnimation: horizontalTween,
                  start: "left 100%",
                  end: "left 55%",
                  scrub: 1,
                },
              },
            );
          });
        });

        media.add("(max-width: 767px)", () => {
          gsap.fromTo(
            horizontalTrack,
            { x: () => horizontal.clientWidth + 2 },
            {
              x: () => -horizontalTrack.scrollWidth - 2,
              ease: "none",
              scrollTrigger: {
                trigger: horizontal,
                start: "top 88%",
                end: "bottom 12%",
                scrub: 1,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      }

    }, root);

    return () => {
      media.revert();
      ctx.revert();
    };
  }, []);

  const scrollToContact = () => {
    const contact = document.getElementById("contacto");
    if (!contact) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(contact, { duration: 1.5 });
    else contact.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={rootRef} id="area-stars" data-ecosystem-area="stars" className="overflow-hidden">
      <div className="relative bg-red px-5 pb-24 pt-24 text-white md:px-10 md:pb-36 md:pt-36">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div data-stars-orbit className="absolute -left-[28rem] top-[34%] h-[58rem] w-[58rem] rounded-full border border-white/25 md:-left-[25rem] md:top-[22%]" />
          <div className="absolute -left-28 top-[49%] h-px w-[58%] -rotate-[19deg] bg-white/20 md:-left-14" />
          <StarMark className="absolute -right-16 top-14 h-72 w-72 rotate-12 text-white/[0.045] md:-right-20 md:h-[30rem] md:w-[30rem]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1320px]">
          <p data-area-reveal className="font-mono2 text-[9px] uppercase tracking-[0.24em] text-white/55">
            Ecosistema / Stars
          </p>

          <div className="mt-8">
            <h2 className="font-display text-[16vw] uppercase leading-[0.82] tracking-[0.01em] md:text-[clamp(4rem,5.8vw,5.75rem)]">
              <span className="block">
                <span data-area-reveal className="block">Los conductores</span>
              </span>
              <span className="block">
                <span data-area-reveal className="block">de la FM <span className="md:hidden">se</span></span>
              </span>
              <span className="block md:flex md:items-end md:gap-8">
                <span data-area-reveal className="block whitespace-nowrap text-ink">
                  <span className="md:hidden">convierten en</span>
                  <span className="hidden md:inline">se convierten en</span>
                </span>
                <span data-area-reveal className="stars-title-logo-anchor mt-8 block md:mt-0 md:shrink-0">
                  <img src="/images/stars_logo.svg" alt="Stars Grupo RPP" className="stars-title-logo brightness-0 invert" />
                </span>
              </span>
            </h2>
          </div>

          <div className="mt-10 grid md:mt-6 md:grid-cols-12 md:items-end">
            <div data-stars-cast className="relative z-10 mx-0 min-w-0 md:col-span-9 md:-ml-16 md:-mr-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-[1%] left-1/2 z-0 h-[5%] w-[68%] -translate-x-1/2 rounded-[50%] bg-ink/15 blur-xl md:bottom-[2%] md:h-[7%] md:w-[72%] md:blur-2xl"
              />
              <img
                src="/images/stars/Influencers Stars.avif"
                alt="Conductores e influencers de Stars Grupo RPP"
                loading="lazy"
                decoding="async"
                className="stars-cast-image relative z-10 mx-auto block h-auto max-w-full object-contain object-bottom md:w-[80%]"
              />
            </div>

            <div className="relative z-20 pb-16 md:col-span-3 md:pb-24 md:pl-6">
              <div data-area-reveal className="border-t border-white/30 py-6">
                <StarMark className="mb-5 h-7 w-7 text-white" />
                <p className="max-w-[19rem] text-sm font-semibold leading-relaxed text-white md:text-base">
                  Nuestros influencers cuentan con el soporte mediático de Grupo RPP.
                </p>
              </div>
              <div data-area-reveal className="border-t border-white/30 py-6">
                <StarMark className="mb-5 h-7 w-7 text-white" />
                <p className="max-w-[19rem] text-sm font-semibold leading-relaxed text-white md:text-base">
                  Los promocionamos en nuestra FM para potenciar sus KPIs y posicionarlos en territorios de valor para las marcas.
                </p>
              </div>
            </div>
          </div>

          <div data-stars-horizontal className="relative -mx-5 mt-6 flex min-h-[58dvh] items-center overflow-hidden md:-mx-10 md:mt-10 md:h-[100dvh] md:min-h-0">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute left-[14%] top-0 h-full w-px rotate-[18deg] bg-white/15" />
            </div>
            <p
              data-stars-horizontal-track
              aria-label="De la voz al impacto de marca. Stars Grupo RPP."
              className="relative z-10 flex w-max items-center gap-[8vw] whitespace-nowrap px-[8vw] font-display text-[18vw] uppercase leading-none text-white will-change-transform md:gap-[5vw] md:px-[5vw] md:text-[9vw]"
            >
              <span data-stars-horizontal-item>De la voz</span>
              <span data-stars-horizontal-item className="inline-flex h-[0.72em] w-[0.72em] shrink-0 items-center">
                <StarOutline className="h-full w-full" />
              </span>
              <span data-stars-horizontal-item>al impacto de marca</span>
              <span data-stars-horizontal-item className="stars-horizontal-logo-anchor inline-flex shrink-0 items-center">
                <img src="/images/stars_logo.svg" alt="" className="stars-horizontal-logo brightness-0 invert" />
              </span>
            </p>
          </div>

          <div data-stars-benefits-intro className="pt-24 md:pt-36">
            <p data-stars-benefit-reveal className="font-mono2 text-[9px] uppercase tracking-[0.24em] text-white/45">
              Stars / Valor para marcas
            </p>
            <div className="mt-8 grid gap-10 md:grid-cols-12 md:items-end">
              <h2 className="font-display text-[16vw] uppercase leading-[0.82] tracking-[0.01em] md:col-span-9 md:text-[7vw]">
                <span data-stars-benefit-reveal className="block">¿Cómo Stars</span>
                <span data-stars-benefit-reveal className="block text-ink">ayuda a tu marca?</span>
              </h2>
              <p data-stars-benefit-reveal className="max-w-sm pb-2 text-sm leading-relaxed text-white/65 md:col-span-3 md:text-base">
                Voces con comunidades propias, respaldadas por el alcance y la credibilidad del ecosistema Grupo RPP.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div data-stars-benefits className="relative bg-red px-5 pb-24 pt-12 text-ink md:px-10 md:pb-36 md:pt-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div data-stars-orbit className="absolute -bottom-[30rem] -left-[23rem] h-[58rem] w-[58rem] rounded-full border border-white/25" />
          <div className="absolute -bottom-14 left-20 h-px w-[42rem] rotate-[55deg] bg-white/20" />
          <span className="font-display absolute -bottom-24 right-5 text-[24rem] leading-none text-white/[0.08] md:right-16">‚</span>
        </div>

        <div className="relative z-10 mx-auto max-w-[1320px]">
          <div className="grid border-l border-t border-ink/20 sm:grid-cols-2 xl:grid-cols-4">
            {benefits.map((benefit) => (
              <article
                key={benefit.id}
                data-stars-card
                className="relative flex min-h-[25rem] flex-col overflow-hidden border-b border-r border-ink/20 bg-white p-6 text-ink md:min-h-[29rem] md:p-8"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono2 text-[9px] tracking-[0.2em] text-ink/45">
                    {benefit.id}
                  </span>
                  <img src="/images/acento.svg" alt="" className="h-9 w-auto md:h-11" />
                </div>
                <div className="mt-auto pt-16">
                  <h3 className="break-words font-display text-4xl uppercase leading-[0.92] md:text-[2.25rem] 2xl:text-5xl">
                    {benefit.title}
                  </h3>
                  <p className="mt-6 text-sm leading-relaxed text-ink/65">
                    {benefit.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div data-area-reveal className="mt-12 flex flex-col gap-7 pt-7 sm:flex-row sm:items-center sm:justify-between md:mt-16">
            <p className="max-w-lg text-sm leading-relaxed text-ink/65 md:text-base">
              Construyamos una campaña con la voz, el territorio y la comunidad adecuados para tu marca.
            </p>
            <Magnetic strength={0.2}>
              <button
                type="button"
                onClick={scrollToContact}
                data-cursor="hover"
                className="rounded-full bg-ink px-6 py-4 font-mono2 text-[9px] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-white hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
              >
                Quiero trabajar con Stars →
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
