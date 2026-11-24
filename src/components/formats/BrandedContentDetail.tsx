import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AccordionSection } from "./FormatAccordion";
import FormatHighlights from "./FormatHighlights";
import { BRANDED_CHANNELS, type BrandedFormat } from "./branded-content";

export function BrandedContentNotFound() {
  useEffect(() => {
    document.title = "Formato no encontrado | Branded Content | GRPP";
  }, []);
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 text-bone md:px-10 md:py-36">
      <h1 className="max-w-3xl font-display text-6xl uppercase leading-none md:text-8xl">Formato no encontrado</h1>
      <p className="mt-6 text-base text-bone/70">Revisa los formatos disponibles en el catálogo de Branded Content.</p>
      <Link to="/formatos/branded-content" className="mt-10 inline-flex min-h-12 items-center border-b border-red text-base text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-red">Volver al catálogo</Link>
    </section>
  );
}

// Display and Branded Content share the dialog, media, title and navigation.
export default function BrandedContentDetail({ format }: { format: BrandedFormat }) {
  const initialSection = format.slug === "video-on-site" ? "examples" : "integration";
  const [openSection, setOpenSection] = useState<string | null>(initialSection);
  const toggle = (id: string) => setOpenSection((previous) => previous === id ? null : id);
  return (
    <div data-branded-detail={format.slug}>
      <FormatHighlights title="Branded Content" subtitle={format.category} highlights={[
        { icon: "layers", title: "Formato", description: format.specification },
        { icon: "target", title: "Canal", description: BRANDED_CHANNELS[format.channel].label },
      ]} />
      <div className="mt-8 w-full">
        <AccordionSection id="branded-integration" number="01" title="Cómo se integra" isOpen={openSection === "integration"} onToggle={() => toggle("integration")}>
          <ul className="space-y-3.5">
            {format.integration.map((detail) => <li key={detail} data-spec-card className="rounded-xl border border-white/10 bg-white/[0.025] p-4 font-sans text-xs leading-relaxed text-bone/70">{detail}</li>)}
          </ul>
        </AccordionSection>
        <AccordionSection id="branded-examples" number="02" title="Demos y ejemplos" isOpen={openSection === "examples"} onToggle={() => toggle("examples")}>
          <div className="space-y-3.5">
            {format.examples.map((example) => (
              <a key={example.url} href={example.url} target="_blank" rel="noopener noreferrer" data-spec-card data-cursor="hover" aria-label={`${example.label} de ${format.title} (abre una nueva pestaña)`} className="flex min-h-14 flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4 transition-colors hover:border-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red">
                <span className="font-sans text-sm font-semibold text-bone">{example.label}</span>
                <span className="font-sans text-xs text-bone/55">{new URL(example.url).hostname.replace(/^www\./, "")}</span>
              </a>
            ))}
            {format.examples.length > 0 ? <p className="font-sans text-xs leading-relaxed text-bone/55">Los ejemplos se abren en una nueva pestaña.</p> : <div data-spec-card className="rounded-xl border border-white/10 bg-white/[0.025] p-4"><p className="font-sans text-sm font-semibold text-bone">Producción a coordinar</p><p className="mt-2 font-sans text-xs leading-relaxed text-bone/70">Consulta la disponibilidad y el alcance de producción con nuestro equipo.</p></div>}
          </div>
        </AccordionSection>
        <AccordionSection id="branded-conditions" number="03" title="Condiciones" isOpen={openSection === "conditions"} onToggle={() => toggle("conditions")}>
          <div data-spec-card className="rounded-xl border border-white/10 bg-white/[0.025] p-4 font-sans text-xs leading-relaxed text-bone/70">Las ilustraciones representan el formato. Las duraciones son referenciales; la disponibilidad y el alcance final se coordinan según la propuesta de campaña.</div>
        </AccordionSection>
      </div>
    </div>
  );
}
