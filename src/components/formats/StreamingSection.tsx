import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowDown, ArrowUpRight, CalendarDays, Link2, Play, Radio } from "lucide-react";
import { gsap } from "@/lib/anim";
import { STREAMING_FAMILY_ROUTES } from "@/lib/format-routes";
import { requestContact } from "@/lib/contact";
import { scrollToId } from "@/lib/scroll";
import Magnetic from "@/components/Magnetic";
import StreamingBenefits from "./StreamingBenefits";
import { STREAMING_CATALOG, type StreamingFamily, type StreamingProgram } from "./streaming-programs";

const FAMILIES: StreamingFamily[] = ["native", "hybrid"];
const imagePath = (name: string) => `/images/streaming/${name}.webp`;
const programCount = (family: StreamingFamily) => String(STREAMING_CATALOG[family].programs.length).padStart(2, "0");
const programAction = (family: StreamingFamily) => `Ver ${STREAMING_CATALOG[family].programs.length} ${family === "native" ? "nativos digitales" : "programas híbridos"}`;
const FAMILY_INTROS = {
  native: { eyebrow: "Creados para digital", summary: "Fútbol, música, misterio e historias creadas para las plataformas digitales." },
  hybrid: { eyebrow: "De la radio y la TV al streaming", summary: "Programas de radio y televisión que amplían su presencia y conversación en digital." },
};

const INTEGRATIONS = [
  {
    title: "Presencia en el programa",
    description: "Tu marca acompaña la emisión en los espacios visuales del programa.",
    options: ["Presentación y despedida", "Banners en pantalla", "Logo rotativo"],
  },
  {
    title: "Integración en el contenido",
    description: "La marca se suma a la conversación con una participación acordada con el equipo editorial.",
    options: ["Menciones en vivo", "Product placement", "Secuencias exclusivas"],
  },
  {
    title: "Amplificación digital",
    description: "La participación continúa en contenidos que la comunidad puede volver a ver y compartir.",
    options: ["Clips del programa", "Posts promocionales", "Presencia de marca en redes"],
  },
];

function ProgramCard({ program, family }: { program: StreamingProgram; family: StreamingFamily }) {
  return (
    <article className="group flex min-w-0 flex-col border-b border-ink/20 pb-7">
      <div className="relative aspect-[5/4] overflow-hidden rounded-2xl" style={{ backgroundColor: program.background }}>
        <div aria-hidden="true" className={`pointer-events-none absolute -bottom-[35%] -right-[25%] h-[110%] w-[110%] rounded-full border ${program.lightArtwork ? "border-ink/10" : "border-white/15"}`} />
        {program.poster && (
          <div
            className="absolute inset-x-0 bottom-0 aspect-video overflow-hidden"
            style={{
              maskImage: "linear-gradient(to bottom, transparent, black 28%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 28%)",
            }}
          >
            <img src={imagePath(program.poster)} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain transition-transform duration-700 motion-safe:group-hover:scale-[1.03]" />
          </div>
        )}
        <img src={imagePath(program.artwork)} alt="" loading="lazy" decoding="async" className="absolute left-5 top-6 z-10 h-[35%] w-[45%] object-contain object-left-top" />
        <span className={`absolute right-4 top-4 z-10 flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-wider ${program.lightArtwork ? "text-ink/65" : "text-white/70"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${program.recorded ? "bg-current" : "bg-red"}`} />
          {program.recorded ? "Grabado" : "En vivo"}
        </span>
        {program.cast.map((image, index) => (
          <img
            key={image}
            src={imagePath(image)}
            alt=""
            loading="lazy"
            decoding="async"
            className={`absolute bottom-0 object-contain object-bottom transition-transform duration-700 motion-safe:group-hover:scale-[1.03] ${program.cast.length > 1 ? `h-[76%] w-[52%] ${index === 0 ? "right-[15%]" : "right-[-12%]"}` : program.lightArtwork ? "right-0 h-[76%] w-[86%]" : "right-0 h-[84%] w-[75%]"}`}
          />
        ))}
      </div>
      <p className="mt-5 text-[9px] font-medium uppercase tracking-[0.16em] text-red">{program.topic}</p>
      <h4 className="mt-3 font-display text-[2.4rem] uppercase leading-[0.95] text-ink">{program.name}</h4>
      <p className="mt-3 text-xs font-medium leading-relaxed text-ink/65">{program.hosts ? `Con ${program.hosts}` : `${program.station} / YouTube`}</p>
      <p className="mb-6 mt-4 text-sm leading-relaxed text-ink/60">{program.description}</p>
      <div className="mt-auto">
        <p className="flex items-center gap-2 text-[11px] text-ink/55"><CalendarDays aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />{program.frequency}</p>
        {program.exampleUrl && (
          <a href={program.exampleUrl} target="_blank" rel="noopener noreferrer" data-cursor="hover" aria-label={`Ver episodio de ${program.name} en YouTube (abre una nueva pestaña)`} className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-medium text-ink/65 transition-colors hover:text-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red">
            <Play aria-hidden="true" className="h-3.5 w-3.5" />Ver en YouTube
          </a>
        )}
        <button
          type="button"
          onClick={() => requestContact(`Streaming / ${STREAMING_CATALOG[family].label} / ${program.name}`)}
          aria-label={`Consultar por ${program.name}`}
          data-cursor="hover"
          className="mt-5 flex min-h-11 w-full items-center justify-between border-t border-ink/15 pt-4 text-xs font-semibold text-ink transition-colors hover:text-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
        >
          Consultar programa <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
      </div>
    </article>
  );
}

export default function StreamingSection() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-streaming-family]").forEach((section) => {
          const timeline = gsap.timeline({
            scrollTrigger: { trigger: section, start: "top 85%", toggleActions: "play none none reverse" },
          });
          timeline
            .from(section.querySelector("[data-family-divider]"), { scaleX: 0, transformOrigin: "left", duration: 0.8, ease: "power2.inOut" })
            .from(section.querySelector("[data-family-heading]"), { y: 20, duration: 0.7, ease: "power3.out" }, 0.2);
        });
      });
    }, rootRef);
    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <section ref={rootRef} id="area-streaming" data-ecosystem-area="streaming" aria-labelledby="streaming-heading" className="overflow-hidden bg-[#dedcd6] text-ink">
      <div className="mx-auto max-w-[1320px] px-5 pb-20 pt-24 md:px-10 md:pb-28 md:pt-36">
        <p data-area-reveal className="font-mono2 text-[9px] uppercase tracking-[0.24em] text-ink/40">Ecosistema / Streaming</p>
        <div className="mt-8 grid gap-8 xl:grid-cols-12 xl:items-end">
          <h2 id="streaming-heading" data-area-reveal className="font-display text-[12vw] uppercase leading-[0.84] sm:text-[11vw] md:text-[6.4vw] xl:col-span-8">
            Voces propias.<br /><span className="text-red">Comunidades reales.</span>
          </h2>
          <p data-area-reveal className="max-w-md text-sm leading-relaxed text-ink/60 xl:col-span-4 xl:pb-1">
            Conecta tu marca con los programas nativos digitales y el streaming híbrido de Grupo RPP. Música, entretenimiento y conversación con el respaldo de nuestro ecosistema de medios.
          </p>
        </div>

        <div data-area-reveal className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-y border-ink/15 py-5 md:mt-12 md:gap-x-9">
          <span className="flex items-center gap-3 text-xs font-medium"><Radio aria-hidden="true" className="h-4 w-4 text-red" />Programas en vivo y grabados</span>
          <span className="text-xs text-ink/60">{STREAMING_CATALOG.native.programs.length + STREAMING_CATALOG.hybrid.programs.length} programas para conectar con tu audiencia</span>
        </div>

        <nav aria-label="Explorar programas de streaming" className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            {FAMILIES.map((key) => (
              <Link key={key} to={STREAMING_FAMILY_ROUTES[key].path} aria-label={programAction(key)} data-cursor="hover" className="group flex min-w-0 flex-col rounded-2xl border border-ink/20 bg-bone/60 p-5 transition-colors hover:border-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <span className="pt-1 text-[9px] font-medium uppercase tracking-[0.14em] text-ink/60">{FAMILY_INTROS[key].eyebrow}</span>
                  <span aria-hidden="true" className="font-display text-3xl leading-none text-red sm:text-5xl">{programCount(key)}</span>
                </div>
                <span className="mt-3 font-display text-[2.25rem] uppercase leading-none sm:mt-5 sm:text-[2.6rem]">{STREAMING_CATALOG[key].label}</span>
                <p className="mb-4 mt-2 max-w-md text-[13px] leading-relaxed text-ink/65 sm:mb-6 sm:mt-3 sm:text-sm">{FAMILY_INTROS[key].summary}</p>
                <span className="mt-auto flex min-h-11 items-center justify-between gap-3 border-t border-ink/15 pt-3 text-xs font-semibold sm:pt-4">
                  {programAction(key)}
                  <ArrowDown aria-hidden="true" className="h-4 w-4 shrink-0 text-red" />
                </span>
              </Link>
            ))}
        </nav>
        <div className="mt-16 space-y-20 md:mt-24 md:space-y-28">
          {FAMILIES.map((key, index) => (
            <section key={key} id={STREAMING_FAMILY_ROUTES[key].target} data-streaming-family tabIndex={-1} aria-labelledby={`${key}-programs-heading`} className="outline-none">
              <div data-family-divider aria-hidden="true" className="h-px bg-ink/25" />
              <div className="mb-10 mt-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
                <div className="max-w-xl">
                  <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-red">0{index + 1} / {FAMILY_INTROS[key].eyebrow}</p>
                  <div data-family-heading className="mt-5 flex items-start gap-3">
                    <h3 id={`${key}-programs-heading`} className="min-w-0 font-display text-[2.65rem] uppercase leading-[0.95] sm:text-6xl md:text-[4.4vw]">{STREAMING_CATALOG[key].label}</h3>
                    <span className="mt-1 shrink-0 text-xs font-medium text-red"><span className="sr-only">Programas: </span>{programCount(key)}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink/60">{STREAMING_CATALOG[key].description}</p>
                </div>
                <Link to={STREAMING_FAMILY_ROUTES[key].path} aria-label={`Enlace directo a ${STREAMING_CATALOG[key].label}`} className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start text-xs text-ink/65 underline decoration-ink/25 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red xl:self-auto"><Link2 aria-hidden="true" className="h-3.5 w-3.5" />Enlace directo</Link>
              </div>
              <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {STREAMING_CATALOG[key].programs.map((program) => <ProgramCard key={program.id} program={program} family={key} />)}
              </div>
              {key === "native" && (
                <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-ink/15 pt-6 sm:flex-row sm:items-center">
                  <p className="max-w-sm text-sm leading-relaxed text-ink/60">La oferta continúa desde la radio y la TV.</p>
                  <Link to={STREAMING_FAMILY_ROUTES.hybrid.path} className="inline-flex min-h-11 shrink-0 items-center gap-3 rounded-full border border-ink/25 px-5 py-3 text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red">Ver {STREAMING_CATALOG.hybrid.programs.length} programas híbridos<ArrowDown aria-hidden="true" className="h-4 w-4 text-red" /></Link>
                </div>
              )}
            </section>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-[10px] leading-relaxed text-ink/45">Ofertas de referencia: julio y agosto de 2026. La frecuencia y disponibilidad de los programas se confirman con el equipo comercial y editorial.</p>
      </div>

      <StreamingBenefits />

      <div className="bg-ink px-5 py-20 text-bone md:px-10 md:py-28">
        <div className="mx-auto max-w-[1240px]">
          <div data-area-reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="text-[9px] uppercase tracking-[0.22em] text-bone/40">Opciones de auspicio</p>
              <h3 className="mt-6 font-display text-[12vw] uppercase leading-[0.9] sm:text-6xl md:text-[5vw]">Así participa <span className="text-red">tu marca</span></h3>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-bone/55 lg:col-span-5">Elige un programa afín a tu audiencia. Combinamos espacios de presencia, contenido y amplificación según los objetivos de tu campaña.</p>
          </div>
          <div data-area-reveal className="mt-12 grid border-t border-white/15 lg:grid-cols-3">
            {INTEGRATIONS.map((integration, index) => (
              <div key={integration.title} className="border-b border-white/15 py-8 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
                <span className="font-display text-3xl text-red">0{index + 1}</span>
                <h4 className="mt-5 text-base font-semibold">{integration.title}</h4>
                <p className="mt-4 text-sm leading-relaxed text-bone/55">{integration.description}</p>
                <ul className="mt-6 space-y-3">
                  {integration.options.map((option) => <li key={option} className="flex items-center gap-3 text-xs text-bone/75"><span aria-hidden="true" className="h-1 w-1 shrink-0 bg-red" />{option}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-7 text-[10px] leading-relaxed text-bone/40">Las integraciones disponibles dependen del programa y requieren coordinación comercial y validación editorial.</p>
          <div data-area-reveal className="mt-14 flex flex-col items-start justify-between gap-7 border-t border-white/15 pt-8 lg:flex-row lg:items-center">
            <div>
              <h3 className="text-lg font-semibold">Una propuesta para tu campaña</h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone/55">Cuéntanos qué quieres lograr y te ayudamos a elegir el programa y la participación adecuados para tu marca.</p>
            </div>
            <Magnetic className="shrink-0">
              <button type="button" onClick={() => window.setTimeout(() => scrollToId("contacto"), 0)} data-cursor="hover" className="inline-flex min-h-12 items-center gap-5 rounded-full bg-red px-6 py-4 text-xs font-semibold text-white transition-colors hover:bg-bone hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone">
                Contactar con el equipo <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
