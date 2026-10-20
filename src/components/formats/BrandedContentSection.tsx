import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowDown, ArrowUpRight, ChevronDown, Link2 } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/anim";
import { getLenis } from "@/lib/scroll";
import { requestContact } from "@/lib/contact";
import { getFormatThumbnailSources } from "@/lib/format-thumbnails";
import { BRANDED_FAMILY_ROUTES } from "@/lib/format-routes";
import { BRANDED_CHANNELS, BRANDED_FORMATS, getBrandedThumbnail, type BrandedChannel, type BrandedFormat } from "./branded-content";

const CHANNELS: BrandedChannel[] = ["web", "social"];
const refreshLayout = () => requestAnimationFrame(() => {
  getLenis()?.resize();
  ScrollTrigger.refresh();
});

function BrandedCard({ format, index }: { format: BrandedFormat; index: number }) {
  const thumbnail = getBrandedThumbnail(format.slug);

  return (
    <article data-branded-card className="group flex min-w-0 flex-col border-b border-white/15 pb-7">
      <figure className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#f5f5f5]">
        <img
          src={thumbnail}
          srcSet={getFormatThumbnailSources(thumbnail)}
          sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) 42vw, 540px"
          width={1448}
          height={1086}
          alt={format.imageAlt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.02]"
        />
      </figure>

      <div className="mt-6 flex items-start justify-between gap-5">
        <p className="font-mono2 text-[8px] uppercase leading-relaxed tracking-[0.18em] text-bone/45">{format.category}</p>
        <span aria-hidden="true" className="font-mono2 text-[9px] tabular-nums text-red">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h4 className="mt-3 max-w-lg font-display text-[2.8rem] uppercase leading-[0.95] text-bone lg:text-5xl">{format.title}</h4>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-bone/60">{format.description}</p>
      <p className="mt-5 text-[11px] font-medium text-bone/80">{format.specification}</p>

      <details onToggle={refreshLayout} className="group/integration mt-6 border-t border-white/12">
        <summary data-cursor="hover" className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 text-xs font-medium text-bone/70 transition-colors hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red [&::-webkit-details-marker]:hidden">
          Cómo se integra
          <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-open/integration:rotate-180" />
        </summary>
        <ul className="space-y-3 pb-6 pl-4 text-xs leading-relaxed text-bone/55 marker:text-red">
          {format.integration.map((detail) => <li key={detail} className="list-disc">{detail}</li>)}
        </ul>
      </details>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-white/12 pt-3">
        <div className="flex flex-wrap gap-x-5">
          {format.examples.map((example) => (
            <a
              key={example.url}
              href={example.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              aria-label={`${example.label} de ${format.title} (abre una nueva pestaña)`}
              className="inline-flex min-h-11 items-center gap-2 text-xs font-medium text-bone transition-colors hover:text-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
            >
              {example.label}<ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          ))}
          {!format.examples.length && <span className="py-3 text-[11px] text-bone/40">Producción a coordinar</span>}
        </div>
        <button
          type="button"
          onClick={() => requestContact(`Branded Content / ${BRANDED_CHANNELS[format.channel].label} / ${format.title}`)}
          data-cursor="hover"
          aria-label={`Consultar ${format.title}`}
          className="inline-flex min-h-11 items-center gap-2 text-xs font-medium text-bone/60 transition-colors hover:text-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
        >
          Consultar formato <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
}

export default function BrandedContentSection() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.utils.toArray<HTMLElement>("[data-branded-card]").forEach((card) => {
        gsap.fromTo(card, { y: 24, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, duration: 0.65, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 94%", once: true },
        });
      });
    }, rootRef);
    const frame = refreshLayout();
    return () => {
      cancelAnimationFrame(frame);
      context.revert();
    };
  }, []);

  return (
    <section ref={rootRef} id="area-branded-content" data-ecosystem-area="branded-content" aria-labelledby="branded-content-heading" className="bg-ink px-5 pb-24 pt-24 text-bone md:px-10 md:pb-36 md:pt-36">
      <div className="mx-auto max-w-[1120px]">
        <p data-area-reveal className="font-mono2 text-[9px] uppercase tracking-[0.24em] text-bone/40">Ecosistema / Branded Content</p>
        <div className="mt-8 grid gap-8 xl:grid-cols-12 xl:items-end">
          <h2 id="branded-content-heading" data-area-reveal className="font-display text-[15vw] uppercase leading-[0.84] md:text-[6.4vw] xl:col-span-8">Historias que<br /><span className="text-red">conectan</span></h2>
          <p data-area-reveal className="max-w-md text-sm leading-relaxed text-bone/55 xl:col-span-4 xl:pb-1">Informar, entretener, inspirar. Creamos contenido que conecta el universo de tu marca con los intereses de cada audiencia.</p>
        </div>

        <nav data-area-reveal aria-label="Explorar formatos de Branded Content" className="mt-12 grid gap-3 sm:grid-cols-2 md:mt-16 md:gap-4">
          {CHANNELS.map((key) => {
            const count = BRANDED_FORMATS.filter((format) => format.channel === key).length;
            return (
              <Link
                key={key}
                to={BRANDED_FAMILY_ROUTES[key].path}
                aria-label={`Ver ${count} formatos ${key === "web" ? "web" : "de redes sociales"}`}
                data-cursor="hover"
                className="group flex items-center justify-between gap-5 rounded-2xl border border-white/20 px-5 py-6 transition-colors hover:border-red hover:bg-white/[0.025] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red md:px-7 md:py-7"
              >
                <span>
                  <span className="block font-display text-3xl uppercase leading-none md:text-4xl">{BRANDED_CHANNELS[key].label}</span>
                  <span className="mt-3 block text-xs text-bone/55">{String(count).padStart(2, "0")} formatos para explorar</span>
                </span>
                <ArrowDown aria-hidden="true" className="h-5 w-5 shrink-0 text-red transition-transform group-hover:translate-y-1" />
              </Link>
            );
          })}
        </nav>

        {CHANNELS.map((key, channelIndex) => {
          const formats = BRANDED_FORMATS.filter((format) => format.channel === key);
          const family = BRANDED_CHANNELS[key];
          return (
          <section key={key} id={BRANDED_FAMILY_ROUTES[key].target} aria-labelledby={`branded-heading-${key}`} tabIndex={-1} className="mt-16 border-t border-white/20 pt-8 outline-none md:mt-24 md:pt-10">
              <div className="mb-10 grid gap-6 md:mb-12 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-6">
                  <p className="mb-5 font-mono2 text-[9px] uppercase tracking-[0.2em] text-bone/45">0{channelIndex + 1} / Branded Content</p>
                  <div className="flex items-center gap-5">
                    <h3 id={`branded-heading-${key}`} className="font-display text-5xl uppercase leading-[0.95] md:text-6xl">{family.label}</h3>
                    <Link to={BRANDED_FAMILY_ROUTES[key].path} aria-label={`Enlace directo a ${family.label}`} data-cursor="hover" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-bone/50 transition-colors hover:border-red hover:text-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red">
                      <Link2 aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  </div>
                  <p className="mt-5 text-sm font-medium text-bone/80">{family.title}</p>
                </div>
                <div className="lg:col-span-6">
                  <p className="mb-4 font-mono2 text-[9px] uppercase tracking-[0.18em] text-red">{String(formats.length).padStart(2, "0")} formatos</p>
                  <p className="max-w-lg text-sm leading-relaxed text-bone/50">{family.description}</p>
                </div>
              </div>
              <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:gap-x-10">
                {formats.map((format, index) => <BrandedCard key={format.slug} format={format} index={index} />)}
              </div>
          </section>
          );
        })}
        <p className="mt-10 max-w-2xl text-[10px] leading-relaxed text-bone/35">Miniaturas ilustrativas de cada formato. Los enlaces muestran las ejecuciones originales. Las duraciones son referenciales; consulta la disponibilidad y el alcance de cada propuesta con nuestro equipo.</p>
      </div>
    </section>
  );
}
