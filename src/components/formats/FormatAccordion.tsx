import { useRef, useState, useLayoutEffect } from "react";
import { gsap } from "@/lib/anim";

export interface FormatSpecs {
  fichaTecnica: {
    tipoCompra: string;
    pesoMaximo: string;
    tiempoEntrega: string;
    audio: string;
  };
  especificaciones: {
    dimensiones: string;
    formatosPermitidos: string;
    cierreControles?: string;
    observaciones: string;
  };
  dispositivos: {
    plataformas: string;
    comportamiento: string;
    aspectRatio: string;
  };
}

interface AccordionItemProps {
  id: string;
  number: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionSection({ number, title, isOpen, onToggle, children }: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const isFirstRenderRef = useRef(true);

  useLayoutEffect(() => {
    const content = contentRef.current;
    const inner = innerRef.current;
    const icon = iconRef.current;
    if (!content || !inner) return;

    const cards = inner.querySelectorAll("[data-spec-card]");

    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      if (isOpen) {
        gsap.set(content, { height: "auto" });
        gsap.set(inner, { autoAlpha: 1, y: 0 });
        if (cards.length) gsap.set(cards, { autoAlpha: 1, y: 0, scale: 1 });
        if (icon) gsap.set(icon, { rotate: 45, backgroundColor: "#e30613", borderColor: "#e30613", color: "#ffffff" });
      } else {
        gsap.set(content, { height: 0 });
        gsap.set(inner, { autoAlpha: 0, y: -10 });
        if (cards.length) gsap.set(cards, { autoAlpha: 0, y: 12, scale: 0.97 });
        if (icon) gsap.set(icon, { rotate: 0, backgroundColor: "transparent", borderColor: "rgba(255,255,255,0.2)", color: "#f5f3ef" });
      }
      return;
    }

    if (isOpen) {
      const targetHeight = inner.offsetHeight;
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      if (icon) {
        tl.to(
          icon,
          {
            rotate: 45,
            backgroundColor: "#e30613",
            borderColor: "#e30613",
            color: "#ffffff",
            duration: 0.45,
            ease: "back.out(1.7)",
          },
          0
        );
      }

      tl.fromTo(
        content,
        { height: content.offsetHeight },
        {
          height: targetHeight,
          duration: 0.5,
          ease: "power4.out",
          onComplete: () => {
            gsap.set(content, { height: "auto" });
          },
        },
        0
      );

      tl.fromTo(
        inner,
        { autoAlpha: 0, y: -8 },
        { autoAlpha: 1, y: 0, duration: 0.35 },
        0.05
      );

      if (cards.length) {
        tl.fromTo(
          cards,
          { autoAlpha: 0, y: 14, scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            stagger: 0.05,
            duration: 0.45,
            ease: "back.out(1.2)",
          },
          0.1
        );
      }
    } else {
      const currentHeight = content.offsetHeight;
      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

      if (icon) {
        tl.to(
          icon,
          {
            rotate: 0,
            backgroundColor: "transparent",
            borderColor: "rgba(255,255,255,0.2)",
            color: "#f5f3ef",
            duration: 0.35,
            ease: "power2.out",
          },
          0
        );
      }

      if (cards.length) {
        tl.to(
          cards,
          {
            autoAlpha: 0,
            y: -6,
            scale: 0.97,
            stagger: 0.02,
            duration: 0.2,
          },
          0
        );
      }

      tl.to(
        inner,
        { autoAlpha: 0, y: -6, duration: 0.2 },
        0
      );

      tl.fromTo(
        content,
        { height: currentHeight },
        {
          height: 0,
          duration: 0.4,
          ease: "power4.inOut",
        },
        0.05
      );
    }
  }, [isOpen]);

  return (
    <div className="relative border-b border-white/12 first:border-t">
      <button
        onClick={onToggle}
        data-cursor="hover"
        className={`group flex w-full items-center justify-between py-4 text-left transition-colors duration-300 ${
          isOpen ? "text-white" : "text-bone/80 hover:text-white"
        }`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3.5">
          <span className={`font-mono2 text-[10px] tracking-[0.2em] transition-colors duration-300 ${isOpen ? "text-red font-bold" : "text-red/70 group-hover:text-red"}`}>
            {number}
          </span>
          <span className="font-display text-lg uppercase tracking-wider">{title}</span>
        </div>
        <span
          ref={iconRef}
          className="flex h-7 w-7 items-center justify-center rounded-full font-mono2 text-xs transition-shadow duration-300 group-hover:shadow-[0_0_12px_rgba(227,6,19,0.3)]"
        >
          +
        </span>
      </button>
      <div ref={contentRef} className="overflow-hidden" style={{ height: 0 }}>
        <div ref={innerRef} className="pb-6 pt-1" style={{ opacity: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function FormatAccordion({ specs }: { specs: FormatSpecs }) {
  const [openSection, setOpenSection] = useState<string | null>("ficha");

  const toggle = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mt-8 w-full">
      <AccordionSection
        id="ficha"
        number="01"
        title="Ficha técnica"
        isOpen={openSection === "ficha"}
        onToggle={() => toggle("ficha")}
      >
        <dl className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div data-spec-card className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <dt className="font-mono2 text-[9px] uppercase tracking-[0.2em] text-bone/45">Tipo de compra</dt>
            <dd className="mt-1 font-sans text-sm font-semibold text-bone">{specs.fichaTecnica.tipoCompra}</dd>
          </div>
          <div data-spec-card className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <dt className="font-mono2 text-[9px] uppercase tracking-[0.2em] text-bone/45">Peso máximo</dt>
            <dd className="mt-1 font-sans text-sm font-semibold text-bone">{specs.fichaTecnica.pesoMaximo}</dd>
          </div>
          <div data-spec-card className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <dt className="font-mono2 text-[9px] uppercase tracking-[0.2em] text-bone/45">Tiempo de entrega</dt>
            <dd className="mt-1 font-sans text-sm font-semibold text-bone">{specs.fichaTecnica.tiempoEntrega}</dd>
          </div>
          <div data-spec-card className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <dt className="font-mono2 text-[9px] uppercase tracking-[0.2em] text-bone/45">Reglas de audio</dt>
            <dd className="mt-1 font-sans text-sm font-semibold text-bone">{specs.fichaTecnica.audio}</dd>
          </div>
        </dl>
      </AccordionSection>

      <AccordionSection
        id="specs"
        number="02"
        title="Especificaciones"
        isOpen={openSection === "specs"}
        onToggle={() => toggle("specs")}
      >
        <dl className="space-y-3.5">
          <div data-spec-card className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <dt className="font-mono2 text-[9px] uppercase tracking-[0.2em] text-bone/45">Dimensiones</dt>
            <dd className="mt-1 font-sans text-sm font-semibold text-bone">{specs.especificaciones.dimensiones}</dd>
          </div>
          <div data-spec-card className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <dt className="font-mono2 text-[9px] uppercase tracking-[0.2em] text-bone/45">Formatos permitidos</dt>
            <dd className="mt-1 font-sans text-sm font-semibold text-bone">{specs.especificaciones.formatosPermitidos}</dd>
          </div>
          {specs.especificaciones.cierreControles && (
            <div data-spec-card className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
              <dt className="font-mono2 text-[9px] uppercase tracking-[0.2em] text-bone/45">Cierre / Controles</dt>
              <dd className="mt-1 font-sans text-sm font-semibold text-bone">{specs.especificaciones.cierreControles}</dd>
            </div>
          )}
          <div data-spec-card className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <dt className="font-mono2 text-[9px] uppercase tracking-[0.2em] text-bone/45">Observaciones</dt>
            <dd className="mt-1 font-sans text-xs leading-relaxed text-bone/70">{specs.especificaciones.observaciones}</dd>
          </div>
        </dl>
      </AccordionSection>

      <AccordionSection
        id="devices"
        number="03"
        title="Dispositivos"
        isOpen={openSection === "devices"}
        onToggle={() => toggle("devices")}
      >
        <dl className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          <div data-spec-card className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <dt className="font-mono2 text-[9px] uppercase tracking-[0.2em] text-bone/45">Plataformas</dt>
            <dd className="mt-1 font-sans text-sm font-semibold text-bone">{specs.dispositivos.plataformas}</dd>
          </div>
          <div data-spec-card className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <dt className="font-mono2 text-[9px] uppercase tracking-[0.2em] text-bone/45">Comportamiento</dt>
            <dd className="mt-1 font-sans text-sm font-semibold text-bone">{specs.dispositivos.comportamiento}</dd>
          </div>
          <div data-spec-card className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <dt className="font-mono2 text-[9px] uppercase tracking-[0.2em] text-bone/45">Aspect Ratio</dt>
            <dd className="mt-1 font-sans text-sm font-semibold text-bone">{specs.dispositivos.aspectRatio}</dd>
          </div>
        </dl>
      </AccordionSection>
    </div>
  );
}
