import { ArrowUpRight } from "lucide-react";
import Magnetic from "@/components/Magnetic";
import { CONSULTATION_URL } from "@/lib/contact";

export default function Contact() {
  return (
    <section
      id="contacto"
      aria-labelledby="contact-heading"
      className="relative isolate scroll-mt-24 overflow-hidden border-t border-white/15 bg-ink px-5 py-12 text-bone md:px-10 md:py-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(227,6,19,0.17),transparent_62%)]" />
      <div className="mx-auto grid max-w-[1400px] gap-8 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:items-end md:gap-14">
        <h2 id="contact-heading" className="font-display text-[clamp(2.5rem,8vw,6rem)] uppercase leading-[0.9]">
          ¿Listo para impulsar <span className="block text-red">tu marca?</span>
        </h2>
        <div className="max-w-md border-t border-white/20 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <p className="text-sm leading-relaxed text-bone/75 md:text-base">
            Cuéntanos qué quieres lograr y solicita una propuesta comercial de Grupo RPP.
          </p>
          <Magnetic className="mt-5 w-full align-top sm:w-fit">
            <a
              href={CONSULTATION_URL}
              aria-describedby="contact-destination"
              data-cursor="hover"
              className="inline-flex min-h-12 w-full items-center justify-between gap-4 rounded-full bg-red px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-bone hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone"
            >
              Solicitar propuesta comercial <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
            </a>
          </Magnetic>
          <p id="contact-destination" className="mt-3 text-xs leading-relaxed text-bone/60">
            Completarás tu consulta en Impulsa tu Marca.
          </p>
        </div>
      </div>
    </section>
  );
}
