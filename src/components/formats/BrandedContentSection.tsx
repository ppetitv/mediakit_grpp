import { useLayoutEffect, useRef, type MouseEvent } from "react";
import { Link } from "react-router";
import { ArrowDown, Link2 } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/anim";
import { getLenis } from "@/lib/scroll";
import { getFormatThumbnailSources } from "@/lib/format-thumbnails";
import { BRANDED_FAMILY_ROUTES, getBrandedFormatPath } from "@/lib/format-routes";
import { BRANDED_CHANNELS, BRANDED_FORMATS, getBrandedThumbnail, type BrandedChannel, type BrandedFormat } from "./branded-content";

const CHANNELS: BrandedChannel[] = ["web", "social"];
const refreshLayout = () => requestAnimationFrame(() => {
  getLenis()?.resize();
  ScrollTrigger.refresh();
});

type OpenBrandedFormat = (format: BrandedFormat, event: MouseEvent<HTMLAnchorElement>) => void;

function BrandedCard({ format, onOpenFormat }: { format: BrandedFormat; onOpenFormat: OpenBrandedFormat }) {
  const thumbnail = getBrandedThumbnail(format.slug);
  return (
    <article data-branded-card className="min-w-0 border-t border-white/20">
      <Link
        to={getBrandedFormatPath(format.slug)}
        onClick={(event) => onOpenFormat(format, event)}
        data-cursor="ABRIR"
        aria-label={`Ver ficha de ${format.title}`}
        className="group block h-full py-8 pr-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red md:py-10"
      >
        <figure className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#f5f5f5]" data-gallery-preview>
          <img src={thumbnail} srcSet={getFormatThumbnailSources(thumbnail)} sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) 42vw, 540px" width={1448} height={1086} alt={format.imageAlt} loading="lazy" decoding="async" className="h-full w-full object-contain transition-transform duration-700 motion-safe:group-hover:scale-[1.02]" />
        </figure>
        <h4 className="mt-6 max-w-lg font-display text-[2.8rem] uppercase leading-[0.95] text-bone transition-colors group-hover:text-red lg:text-5xl">{format.title}</h4>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-bone/65">{format.description}</p>
      </Link>
    </article>
  );
}

export default function BrandedContentSection({ onOpenFormat }: { onOpenFormat: OpenBrandedFormat }) {
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
              <div className="grid gap-x-8 md:grid-cols-2 lg:gap-x-10">
                {formats.map((format) => <BrandedCard key={format.slug} format={format} onOpenFormat={onOpenFormat} />)}
              </div>
          </section>
          );
        })}
      </div>
    </section>
  );
}
