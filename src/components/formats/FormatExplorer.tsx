import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate, useParams } from "react-router";
import { gsap, ScrollTrigger } from "@/lib/anim";
import { getLenis } from "@/lib/scroll";
import FormatPreview, { type FormatVisual } from "@/components/formats/FormatPreview";

type Device = "Todos" | "Mobile" | "Desktop";

interface FormatItem {
  id: string;
  slug: string;
  title: string;
  device: Exclude<Device, "Todos"> | "Multiplataforma";
  visual: FormatVisual;
  description: string;
}

const FORMATS: FormatItem[] = [
  { id: "01", slug: "interstitial", title: "Interstitial", device: "Multiplataforma", visual: "interstitial", description: "Una pieza de alto impacto que ocupa el foco de la navegación en un momento definido del recorrido." },
  { id: "02", slug: "interscroller", title: "Interscroller", device: "Mobile", visual: "interscroller", description: "El anuncio se revela con el desplazamiento y convierte el scroll en parte natural de la experiencia." },
  { id: "03", slug: "skin", title: "Skin", device: "Desktop", visual: "skin", description: "La marca enmarca el contenido editorial con presencia sostenida y una lectura clara." },
  { id: "04", slug: "skin-arco", title: "Skin Arco", device: "Desktop", visual: "skin-arch", description: "Una toma envolvente de cabecera y laterales que amplía la superficie visual de campaña." },
  { id: "05", slug: "widget", title: "Widget", device: "Multiplataforma", visual: "widget", description: "Un módulo compacto y contextual que mantiene la campaña cerca del contenido relevante." },
  { id: "06", slug: "zocalo", title: "Zócalo", device: "Multiplataforma", visual: "lower-third", description: "Una franja horizontal visible y directa, pensada para mensajes breves y llamados a la acción." },
  { id: "07", slug: "historias", title: "Historias", device: "Multiplataforma", visual: "stories", description: "Una narrativa vertical y secuencial diseñada para consumirse con rapidez y participación." },
  { id: "08", slug: "sondeo", title: "Sondeo", device: "Multiplataforma", visual: "poll", description: "Una pregunta integrada al contenido que invita a la audiencia a responder y tomar posición." },
  { id: "09", slug: "scratch", title: "Scratch", device: "Multiplataforma", visual: "scratch", description: "Una mecánica de descubrimiento que transforma una pieza estática en una interacción táctil." },
  { id: "10", slug: "antes-y-despues", title: "Antes y después", device: "Multiplataforma", visual: "before-after", description: "Un comparador visual que permite explorar dos estados de una misma historia o producto." },
  { id: "11", slug: "banner-360", title: "Banner 360°", device: "Mobile", visual: "panorama", description: "Una experiencia móvil que responde al gesto para recorrer el contenido en todas sus perspectivas." },
  { id: "12", slug: "hot-spot", title: "Hot Spot", device: "Multiplataforma", visual: "hotspot", description: "Puntos activos dentro de la creatividad revelan información sin interrumpir la navegación." },
  { id: "13", slug: "contador", title: "Contador", device: "Multiplataforma", visual: "countdown", description: "Una cuenta regresiva convierte una fecha, estreno o lanzamiento en un momento esperado." },
  { id: "14", slug: "social-ad", title: "Social AD", device: "Multiplataforma", visual: "social", description: "La lógica visual de redes sociales se integra al entorno editorial de GRPP." },
  { id: "15", slug: "video-top-full", title: "Video Top Full", device: "Desktop", visual: "video", description: "Video de gran formato en la zona superior para presentar una campaña desde el primer vistazo." },
];

const FILTERS: Device[] = ["Todos", "Mobile", "Desktop"];
const GALLERY_RHYTHM = [
  "md:col-span-7",
  "md:col-span-5 md:mt-28",
  "md:col-span-5 md:mt-8",
  "md:col-span-7 md:mt-24",
  "md:col-span-8",
  "md:col-span-4 md:mt-36",
  "md:col-span-6 md:mt-10",
  "md:col-span-6 md:mt-28",
  "md:col-span-5",
  "md:col-span-7 md:mt-24",
  "md:col-span-8 md:mt-8",
  "md:col-span-4 md:mt-36",
  "md:col-span-6",
  "md:col-span-6 md:mt-24",
  "md:col-span-9 md:col-start-3 md:mt-10",
];

function getSourceTransform(rect: DOMRect | null) {
  if (!rect) return { x: window.innerWidth * 0.08, y: window.innerHeight * 0.46, scaleX: 0.84, scaleY: 0.08 };
  return {
    x: rect.left,
    y: rect.top,
    scaleX: Math.max(0.05, rect.width / window.innerWidth),
    scaleY: Math.max(0.05, rect.height / window.innerHeight),
  };
}

export default function FormatExplorer() {
  const navigate = useNavigate();
  const { formatSlug } = useParams();
  const rootRef = useRef<HTMLElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const sourceRectRef = useRef<DOMRect | null>(null);
  const detailTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasOpenedRef = useRef(false);
  const closingRef = useRef(false);
  const [filter, setFilter] = useState<Device>("Todos");
  const visibleFormats = filter === "Todos" ? FORMATS : FORMATS.filter((format) => format.device === filter || format.device === "Multiplataforma");
  const selected = FORMATS.find((format) => format.slug === formatSlug) ?? null;

  useEffect(() => {
    document.title = selected
      ? `${selected.title} | Formatos GRPP`
      : "Formatos digitales | GRPP Media Kit 2026";
  }, [selected]);

  const applyFilter = (nextFilter: Device) => {
    setFilter(nextFilter);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  const openDetail = (format: FormatItem, event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const preview = event.currentTarget.querySelector<HTMLElement>("[data-gallery-preview]");
    sourceRectRef.current = (preview ?? event.currentTarget).getBoundingClientRect();
    gsap.fromTo(event.currentTarget, { scale: 1 }, { scale: 0.985, duration: 0.14, yoyo: true, repeat: 1, ease: "power2.inOut" });
    navigate(`/formatos/${format.slug}`);
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.utils.toArray<HTMLElement>("[data-gallery-item]").forEach((item) => {
        gsap.fromTo(item, { y: 54, autoAlpha: 0 }, {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: { trigger: item, start: "top 88%", once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [filter]);

  const setDetailNode = useCallback((node: HTMLDivElement | null) => {
    detailRef.current = node;
    if (!node) {
      detailTimelineRef.current?.kill();
      hasOpenedRef.current = false;
      return;
    }

    const runEntrance = () => {
      const overlay = overlayRef.current;
      if (hasOpenedRef.current) return;
      hasOpenedRef.current = true;
      getLenis()?.stop();
      gsap.set(node, { autoAlpha: 1 });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (overlay) gsap.set(overlay, { autoAlpha: 1 });
        return;
      }

      detailTimelineRef.current?.kill();
      const timeline = gsap.timeline();
      detailTimelineRef.current = timeline;
      if (overlay) timeline.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: "power2.out" });
      timeline
        .fromTo(
          node,
          { ...getSourceTransform(sourceRectRef.current), transformOrigin: "top left", borderRadius: 28 },
          { x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: 0, duration: 0.95, ease: "power4.inOut" },
          overlay ? "-=0.25" : 0
        )
        .fromTo(node.querySelectorAll("[data-detail-reveal]"), { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.06, ease: "power3.out" }, "-=0.34");
    };

    runEntrance();
  }, []);

  useLayoutEffect(() => {
    if (!selected || !hasOpenedRef.current) return;
    const detail = detailRef.current;
    if (!detail) return;
    gsap.set(detail, { autoAlpha: 1 });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(detail.querySelectorAll("[data-detail-reveal]"), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.05, ease: "power3.out" });
    }
  }, [selected]);

  useEffect(() => () => getLenis()?.start(), []);

  const closeDetail = (afterClose?: () => void) => {
    if (!selected || closingRef.current) return;
    const detail = detailRef.current;
    const overlay = overlayRef.current;
    if (!detail || !overlay || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      navigate("/formatos", { replace: true });
      getLenis()?.start();
      sourceRectRef.current = null;
      afterClose?.();
      return;
    }

    closingRef.current = true;
    gsap.timeline({
      onComplete: () => {
        navigate("/formatos", { replace: true });
        getLenis()?.start();
        closingRef.current = false;
        sourceRectRef.current = null;
        afterClose?.();
      },
    })
      .to(detail, { ...getSourceTransform(sourceRectRef.current), transformOrigin: "top left", borderRadius: 28, duration: 0.78, ease: "power4.inOut" })
      .to(overlay, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, "-=0.3");
  };

  const stepDetail = (direction: -1 | 1) => {
    if (!selected) return;
    const index = visibleFormats.findIndex((format) => format.id === selected.id);
    const nextIndex = (index + direction + visibleFormats.length) % visibleFormats.length;
    const nextFormat = visibleFormats[nextIndex];
    if (nextFormat) navigate(`/formatos/${nextFormat.slug}`, { replace: true });
  };

  const consultFormat = () => {
    closeDetail(() => {
      const contact = document.getElementById("contacto");
      if (!contact) return;
      requestAnimationFrame(() => getLenis()?.scrollTo(contact, { duration: 1.5 }));
    });
  };

  return (
    <section ref={rootRef} id="catalogo-formatos" className="relative bg-bone text-ink">
      <div
        className="sticky z-20 border-b border-ink/15 bg-bone/90 px-5 py-4 backdrop-blur-xl transition-[top] duration-500 md:px-10 md:py-5"
        style={{ top: "var(--nav-offset, 0px)" }}
      >
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="font-mono2 text-[9px] uppercase tracking-[0.28em] text-ink/50 md:text-[10px]">Catálogo / Display / Rich Media</p>
          <div className="flex w-fit gap-1 rounded-full border border-ink/15 p-1" role="group" aria-label="Filtrar formatos por dispositivo">
            {FILTERS.map((item) => (
              <button key={item} onClick={() => applyFilter(item)} aria-pressed={filter === item} data-cursor="hover" className={`rounded-full px-4 py-2 font-mono2 text-[9px] uppercase tracking-[0.16em] transition-colors duration-300 ${filter === item ? "bg-ink text-bone" : "text-ink/55 hover:text-ink"}`}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-16 md:px-10 md:pb-40 md:pt-24">
        <div className="mb-16 grid gap-8 md:mb-20 md:grid-cols-12 md:items-end">
          <h2 className="font-display text-[16vw] uppercase leading-[0.82] tracking-[0.01em] md:col-span-8 md:text-[7.2vw]">Explora cada<br /><span className="text-red">posibilidad</span></h2>
          <div className="md:col-span-4 md:pb-2">
            <p className="max-w-sm text-sm leading-relaxed text-ink/[0.58] md:text-base">Conoce cómo tu idea puede aparecer, moverse y responder dentro del ecosistema digital de GRPP.</p>
            <p className="mt-5 font-mono2 text-[9px] uppercase tracking-[0.2em] text-ink/35">{String(visibleFormats.length).padStart(2, "0")} formatos disponibles</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-7 gap-y-16 md:grid-cols-12 md:gap-x-10 md:gap-y-24">
          {visibleFormats.map((format, index) => (
            <article key={format.id} data-gallery-item className={GALLERY_RHYTHM[index % GALLERY_RHYTHM.length]}>
              <a href={`/formatos/${format.slug}`} onClick={(event) => openDetail(format, event)} data-cursor="ABRIR" className="group block w-full text-left active:scale-[0.99]" aria-label={`Abrir detalle de ${format.title}`}>
                <div data-gallery-preview className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
                  <FormatPreview visual={format.visual} title={format.title} />
                  <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/[0.06]" />
                  <span className="absolute bottom-5 right-5 flex h-12 w-12 translate-y-3 items-center justify-center rounded-full bg-red text-xl text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:bottom-7 md:right-7 md:h-14 md:w-14">↗</span>
                </div>
                <div className="mt-5 grid grid-cols-[auto_1fr] gap-4 md:mt-7 md:gap-6">
                  <span className="pt-1 font-mono2 text-[9px] tracking-[0.16em] text-red">{format.id}</span>
                  <div className="border-t border-ink/15 pt-4 md:pt-5">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-4xl uppercase leading-none transition-colors duration-300 group-hover:text-red md:text-5xl lg:text-6xl">{format.title}</h3>
                      <span className="shrink-0 rounded-full border border-ink/15 px-2.5 py-1.5 font-mono2 text-[7px] uppercase tracking-[0.13em] text-ink/45">{format.device}</span>
                    </div>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/50 md:mt-4">{format.description}</p>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>

      <Dialog.Root open={selected !== null} onOpenChange={(open) => { if (!open) closeDetail(); }}>
        <Dialog.Portal>
          <Dialog.Overlay ref={overlayRef} className="fixed inset-0 z-[230] bg-ink/60 backdrop-blur-sm" />
          {selected && (
            <Dialog.Content ref={setDetailNode} onEscapeKeyDown={(event) => { event.preventDefault(); closeDetail(); }} className="fixed inset-0 z-[240] overflow-y-auto bg-ink text-bone outline-none" style={{ visibility: "hidden", willChange: "transform" }} aria-describedby="format-detail-description">
              <div className="mx-auto flex min-h-[100dvh] max-w-[1600px] flex-col px-5 pb-8 pt-6 md:px-10 md:pb-10 md:pt-8">
                <div className="flex items-center justify-between border-b border-white/12 pb-5">
                  <p data-detail-reveal className="font-mono2 text-[9px] uppercase tracking-[0.25em] text-bone/40">Formato {selected.id} / {String(visibleFormats.length).padStart(2, "0")}</p>
                  <button onClick={() => closeDetail()} data-cursor="hover" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-xl text-bone transition-colors hover:bg-bone hover:text-ink" aria-label="Cerrar detalle">×</button>
                </div>

                <div className="grid flex-1 items-center gap-10 py-10 md:grid-cols-12 md:gap-12 md:py-12">
                  <div data-detail-reveal className="md:col-span-8">
                    <FormatPreview key={selected.id} visual={selected.visual} title={selected.title} />
                  </div>
                  <div className="md:col-span-4">
                    <span data-detail-reveal className="inline-flex rounded-full border border-white/15 px-3 py-2 font-mono2 text-[8px] uppercase tracking-[0.16em] text-bone/50">{selected.device}</span>
                    <Dialog.Title data-detail-reveal className="mt-6 font-display text-[18vw] uppercase leading-[0.82] text-bone md:text-[6vw]">{selected.title}</Dialog.Title>
                    <Dialog.Description id="format-detail-description" data-detail-reveal className="mt-7 max-w-md text-sm leading-relaxed text-bone/55 md:text-base">{selected.description}</Dialog.Description>
                    <button onClick={consultFormat} data-detail-reveal data-cursor="hover" className="mt-9 rounded-full bg-red px-6 py-4 font-mono2 text-[9px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-bone hover:text-ink">Consultar este formato →</button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/12 pt-5">
                  <button onClick={() => stepDetail(-1)} data-cursor="hover" className="font-mono2 text-[9px] uppercase tracking-[0.2em] text-bone/50 transition-colors hover:text-bone">← Anterior</button>
                  <button onClick={() => stepDetail(1)} data-cursor="hover" className="font-mono2 text-[9px] uppercase tracking-[0.2em] text-bone/50 transition-colors hover:text-bone">Siguiente →</button>
                </div>
              </div>
            </Dialog.Content>
          )}
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
