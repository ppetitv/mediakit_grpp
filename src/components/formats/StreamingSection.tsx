import { useLayoutEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { ArrowUpRight, CalendarDays, Play, Radio } from "lucide-react";
import { ScrollTrigger } from "@/lib/anim";
import { requestContact } from "@/lib/contact";
import { scrollToId } from "@/lib/scroll";
import Magnetic from "@/components/Magnetic";
import StreamingBenefits from "./StreamingBenefits";
import { STREAMING_CATALOG, type StreamingFamily, type StreamingProgram } from "./streaming-programs";

const FAMILIES: StreamingFamily[] = ["native", "hybrid"];
const imagePath = (name: string) => `/images/streaming/${name}.webp`;
const programCount = (family: StreamingFamily) => String(STREAMING_CATALOG[family].programs.length).padStart(2, "0");

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
  const [family, setFamily] = useState<StreamingFamily>("native");

  useLayoutEffect(() => {
    // Changing catalog height must also update the pinned sections below it.
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [family]);

  return (
    <section id="area-streaming" data-ecosystem-area="streaming" aria-labelledby="streaming-heading" className="overflow-hidden bg-[#dedcd6] text-ink">
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
          <span className="text-xs text-ink/60"><strong className="mr-1.5 text-ink">{programCount("native")}</strong>Nativos digitales</span>
          <span className="text-xs text-ink/60"><strong className="mr-1.5 text-ink">{programCount("hybrid")}</strong>Programas híbridos</span>
        </div>

        <Tabs.Root value={family} onValueChange={(value) => setFamily(value as StreamingFamily)} className="mt-14 md:mt-20">
          <Tabs.List aria-label="Oferta de programas de streaming" className="grid grid-cols-2 border-b border-ink/20">
            {FAMILIES.map((key) => (
              <Tabs.Trigger key={key} value={key} data-cursor="hover" className="flex min-h-20 min-w-0 items-center justify-between gap-2 border-b-[3px] border-transparent px-2 py-5 text-left text-sm font-semibold text-ink/45 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red data-[state=active]:border-red data-[state=active]:text-red sm:px-5 sm:text-lg">
                <span>{STREAMING_CATALOG[key].label}</span>
                <span className="text-[10px] font-normal tracking-widest">{programCount(key)}</span>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {FAMILIES.map((key) => (
            <Tabs.Content key={key} value={key} className="pt-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red">
              <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                <div className="max-w-xl">
                  <h3 className="text-sm font-semibold text-ink">{STREAMING_CATALOG[key].label}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/60">{STREAMING_CATALOG[key].description}</p>
                </div>
                <span className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-ink/40">Conoce los programas</span>
              </div>
              <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {STREAMING_CATALOG[key].programs.map((program) => <ProgramCard key={program.id} program={program} family={key} />)}
              </div>
            </Tabs.Content>
          ))}
        </Tabs.Root>
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
