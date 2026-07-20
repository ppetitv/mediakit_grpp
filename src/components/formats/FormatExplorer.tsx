import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/anim";
import FormatPreview, { type FormatVisual } from "@/components/formats/FormatPreview";

type Device = "Todos" | "Mobile" | "Desktop";

interface FormatItem {
  id: string;
  title: string;
  device: Exclude<Device, "Todos"> | "Multiplataforma";
  visual: FormatVisual;
  description: string;
}

const FORMATS: FormatItem[] = [
  { id: "01", title: "Interstitial", device: "Multiplataforma", visual: "interstitial", description: "Una pieza de alto impacto que ocupa el foco de la navegación en un momento definido del recorrido." },
  { id: "02", title: "Interscroller", device: "Mobile", visual: "interscroller", description: "El anuncio se revela con el desplazamiento y convierte el scroll en parte natural de la experiencia." },
  { id: "03", title: "Skin", device: "Desktop", visual: "skin", description: "La marca enmarca el contenido editorial con presencia sostenida y una lectura clara." },
  { id: "04", title: "Skin Arco", device: "Desktop", visual: "skin-arch", description: "Una toma envolvente de cabecera y laterales que amplía la superficie visual de campaña." },
  { id: "05", title: "Widget", device: "Multiplataforma", visual: "widget", description: "Un módulo compacto y contextual que mantiene la campaña cerca del contenido relevante." },
  { id: "06", title: "Zócalo", device: "Multiplataforma", visual: "lower-third", description: "Una franja horizontal visible y directa, pensada para mensajes breves y llamados a la acción." },
  { id: "07", title: "Historias", device: "Multiplataforma", visual: "stories", description: "Una narrativa vertical y secuencial diseñada para consumirse con rapidez y participación." },
  { id: "08", title: "Sondeo", device: "Multiplataforma", visual: "poll", description: "Una pregunta integrada al contenido que invita a la audiencia a responder y tomar posición." },
  { id: "09", title: "Scratch", device: "Multiplataforma", visual: "scratch", description: "Una mecánica de descubrimiento que transforma una pieza estática en una interacción táctil." },
  { id: "10", title: "Antes y después", device: "Multiplataforma", visual: "before-after", description: "Un comparador visual que permite explorar dos estados de una misma historia o producto." },
  { id: "11", title: "Banner 360°", device: "Mobile", visual: "panorama", description: "Una experiencia móvil que responde al gesto para recorrer el contenido en todas sus perspectivas." },
  { id: "12", title: "Hot Spot", device: "Multiplataforma", visual: "hotspot", description: "Puntos activos dentro de la creatividad revelan información sin interrumpir la navegación." },
  { id: "13", title: "Contador", device: "Multiplataforma", visual: "countdown", description: "Una cuenta regresiva convierte una fecha, estreno o lanzamiento en un momento esperado." },
  { id: "14", title: "Social AD", device: "Multiplataforma", visual: "social", description: "La lógica visual de redes sociales se integra al entorno editorial de GRPP." },
  { id: "15", title: "Video Top Full", device: "Desktop", visual: "video", description: "Video de gran formato en la zona superior para presentar una campaña desde el primer vistazo." },
];

const FILTERS: Device[] = ["Todos", "Mobile", "Desktop"];

export default function FormatExplorer() {
  const rootRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<Device>("Todos");
  const [activeId, setActiveId] = useState(FORMATS[0].id);
  const visibleFormats = filter === "Todos" ? FORMATS : FORMATS.filter((format) => format.device === filter || format.device === "Multiplataforma");
  const active = visibleFormats.find((format) => format.id === activeId) ?? visibleFormats[0];

  const applyFilter = (nextFilter: Device) => {
    const nextVisible = nextFilter === "Todos" ? FORMATS : FORMATS.filter((format) => format.device === nextFilter || format.device === "Multiplataforma");
    setFilter(nextFilter);
    setActiveId((current) => nextVisible.some((format) => format.id === current) ? current : nextVisible[0].id);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-format-row]").forEach((row) => {
          ScrollTrigger.create({
            trigger: row,
            start: "top 52%",
            end: "bottom 52%",
            onToggle: (self) => {
              if (self.isActive) setActiveId(row.dataset.formatRow ?? FORMATS[0].id);
            },
          });
        });
        gsap.fromTo("[data-format-row]", { x: 44, autoAlpha: 0 }, {
          x: 0,
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.045,
          ease: "power4.out",
          scrollTrigger: { trigger: "[data-format-list]", start: "top 80%" },
        });
      }, root);
      return () => ctx.revert();
    });

    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-mobile-format]").forEach((item) => {
          gsap.fromTo(item, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: "power4.out", scrollTrigger: { trigger: item, start: "top 88%" } });
        });
      }, root);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [filter]);

  if (!active) return null;

  return (
    <section ref={rootRef} id="catalogo-formatos" className="relative bg-bone text-ink">
      <div className="border-b border-ink/15 px-5 py-6 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <p className="font-mono2 text-[10px] uppercase tracking-[0.28em] text-ink/50">Catálogo / Display / Rich Media</p>
          <div className="flex gap-1 rounded-full border border-ink/15 p-1" role="group" aria-label="Filtrar formatos por dispositivo">
            {FILTERS.map((item) => (
              <button key={item} onClick={() => applyFilter(item)} aria-pressed={filter === item} data-cursor="hover" className={`rounded-full px-4 py-2 font-mono2 text-[9px] uppercase tracking-[0.16em] transition-colors duration-300 ${filter === item ? "bg-ink text-bone" : "text-ink/55 hover:text-ink"}`}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-32">
        <div className="mb-16 grid gap-8 md:grid-cols-12 md:items-end md:mb-24">
          <h2 className="font-display text-[17vw] uppercase leading-[0.82] tracking-[0.01em] md:col-span-8 md:text-[8vw]">Formatos que<br /><span className="text-red">piden acción</span></h2>
          <p className="max-w-sm text-sm leading-relaxed text-ink/[0.58] md:col-span-4 md:pb-2 md:text-base">Formatos dinámicos que integran movimiento, desplazamiento y participación para captar atención sin desconectarse del contenido.</p>
        </div>

        <div className="hidden md:grid md:grid-cols-12 md:gap-10 lg:gap-16">
          <div className="md:col-span-7 lg:col-span-8">
            <div className="sticky top-24">
              <div key={active.id} className="relative">
                <FormatPreview visual={active.visual} title={active.title} />
                <div className="mt-7 grid grid-cols-12 gap-5">
                  <p className="col-span-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-red">{active.id} / 15</p>
                  <div className="col-span-10 flex items-start justify-between gap-8 border-t border-ink/15 pt-5">
                    <div>
                      <h3 className="font-display text-5xl uppercase leading-none lg:text-7xl">{active.title}</h3>
                      <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/55 lg:text-base">{active.description}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-ink/15 px-3 py-2 font-mono2 text-[8px] uppercase tracking-[0.16em] text-ink/55">{active.device}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div data-format-list className="md:col-span-5 lg:col-span-4">
            {visibleFormats.map((format) => (
              <button key={format.id} data-format-row={format.id} onMouseEnter={() => setActiveId(format.id)} onFocus={() => setActiveId(format.id)} onClick={() => setActiveId(format.id)} data-cursor="VER" className={`group flex min-h-24 w-full items-center gap-5 border-t px-1 py-5 text-left transition-colors duration-300 last:border-b ${active.id === format.id ? "border-red text-red" : "border-ink/15 text-ink hover:text-red"}`}>
                <span className="w-8 font-mono2 text-[9px] tracking-[0.15em] opacity-50">{format.id}</span>
                <span className="font-display text-3xl uppercase leading-none lg:text-4xl">{format.title}</span>
                <span className={`ml-auto text-xl transition-transform duration-500 ${active.id === format.id ? "translate-x-0 rotate-45" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}>↗</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-14 md:hidden">
          {visibleFormats.map((format) => (
            <article key={format.id} data-mobile-format>
              <FormatPreview visual={format.visual} title={format.title} interactive={false} />
              <div className="mt-5 flex items-start gap-4">
                <span className="pt-1 font-mono2 text-[9px] tracking-[0.16em] text-red">{format.id}</span>
                <div className="flex-1 border-t border-ink/15 pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-4xl uppercase leading-none">{format.title}</h3>
                    <span className="rounded-full border border-ink/15 px-2 py-1 font-mono2 text-[7px] uppercase tracking-[0.12em] text-ink/50">{format.device}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink/55">{format.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
