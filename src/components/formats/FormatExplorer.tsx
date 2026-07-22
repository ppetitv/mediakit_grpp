import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useLocation, useNavigate, useParams } from "react-router";
import { gsap, ScrollTrigger } from "@/lib/anim";
import { getLenis } from "@/lib/scroll";
import FormatPreview, { type FormatVisual } from "@/components/formats/FormatPreview";
import FormatAccordion, { type FormatSpecs } from "@/components/formats/FormatAccordion";
import FormatHighlights, { type FormatHighlight } from "@/components/formats/FormatHighlights";

type Device = "Todos" | "Mobile" | "Desktop";
type Availability = "Solo mobile" | "Solo desktop";
type Catalog = "rich-media" | "standard";
type EcosystemArea = "display" | "branded-content" | "streaming";

interface FormatItem {
  id: string;
  slug: string;
  title: string;
  device: Exclude<Device, "Todos"> | "Multiplataforma";
  visual: FormatVisual;
  description: string;
  availability?: Availability;
  imageSrc?: string;
  specs?: FormatSpecs;
  highlights?: FormatHighlight[];
}

function getFormatHighlights(format: FormatItem): FormatHighlight[] {
  if (format.highlights) return format.highlights;

  const defaultHighlightsMap: Record<string, FormatHighlight[]> = {
    interstitial: [
      { icon: "eye", title: "Alta atención visual", description: "El formato domina la pantalla en momentos clave de navegación sin distracciones." },
      { icon: "target", title: "Máxima recordación", description: "Posiciona el mensaje directamente en el centro del foco de atención." }
    ],
    interscroller: [
      { icon: "sparkles", title: "Experiencia inmersiva", description: "Se revela progresivamente con el desplazamiento integrándose al contenido." },
      { icon: "zap", title: "Sin fricción de lectura", description: "Ofrece alto impacto visual respetando el flujo de navegación del usuario." }
    ],
    skin: [
      { icon: "layers", title: "Presencia sostenida", description: "Enmarca todo el sitio manteniendo visibilidad constante durante la sesión." },
      { icon: "award", title: "Prestigio editorial", description: "Asocia la marca al entorno periodístico líder de GRPP." }
    ],
    "skin-arco": [
      { icon: "layers", title: "Cobertura 360° en pantalla", description: "Toma completa de cabecera y marcos laterales para máxima notoriedad." },
      { icon: "eye", title: "Dominio de portada", description: "Presencia imposible de ignorar en las secciones principales del portal." }
    ],
    top: [
      { icon: "trending", title: "Primer contacto garantizado", description: "Visibilidad inmediata en la zona superior al cargar la página." },
      { icon: "target", title: "Gran alcance masivo", description: "Ideal para campañas de lanzamiento con alta frecuencia de lectura." }
    ],
    caja: [
      { icon: "target", title: "Ubicación estratégica", description: "Acompaña la lectura en puntos de alto involucramiento de la audiencia." },
      { icon: "sparkles", title: "Formato ágil y versátil", description: "Excelente rendimiento para branding y llamados a la acción." }
    ]
  };

  if (defaultHighlightsMap[format.slug]) {
    return defaultHighlightsMap[format.slug];
  }

  return [
    { icon: "eye", title: "Alta visibilidad de campaña", description: "Diseñado para captar la atención dentro del flujo editorial de GRPP." },
    { icon: "target", title: "Conexión directa", description: "Optimizado para potenciar el recuerdo de marca y la conversión." }
  ];
}

function getFormatSpecs(format: FormatItem): FormatSpecs {
  if (format.specs) return format.specs;

  const isMobileOnly = format.availability === "Solo mobile";
  const isDesktopOnly = format.availability === "Solo desktop";

  const defaultSpecsMap: Record<string, FormatSpecs> = {
    interstitial: {
      fichaTecnica: { tipoCompra: "CPM / CPD Directa", pesoMaximo: "150 KB (Initial) / 2 MB (Polite)", tiempoEntrega: "48h hábiles antes del inicio", audio: "Mute por defecto / Activación por tap" },
      especificaciones: { dimensiones: "320x480 (Mobile) / 800x600 (Desktop)", formatosPermitidos: "HTML5, Zip, JPG, PNG", cierreControles: "Botón 'Cerrar ×' visible a los 3 seg", observaciones: "Debe ser totalmente responsive e incluir botón de cierre visible en la esquina superior derecha." },
      dispositivos: { plataformas: "Multiplataforma (iOS, Android, Web)", comportamiento: "Pantalla completa overlay con bloqueo temporal de scroll", aspectRatio: "9:16 (Mobile) / 4:3 (Desktop)" }
    },
    interscroller: {
      fichaTecnica: { tipoCompra: "CPM Directo", pesoMaximo: "200 KB (HTML5) / 5 MB (Video)", tiempoEntrega: "48h hábiles", audio: "Sin audio o mute por defecto" },
      especificaciones: { dimensiones: "360x640 px (Viewport reveal)", formatosPermitidos: "HTML5, MP4, WebM, JPG", cierreControles: "No requiere cierre (scroll natural)", observaciones: "El formato se revela progresivamente en el fondo a medida que el usuario navega la nota editorial." },
      dispositivos: { plataformas: "Solo Mobile (Web / App)", comportamiento: "Parallax / Parallax Reveal en viewport scroll", aspectRatio: "9:16 vertical scroll" }
    },
    skin: {
      fichaTecnica: { tipoCompra: "CPD / CPM Directo", pesoMaximo: "250 KB por lateral", tiempoEntrega: "48h hábiles", audio: "Sin sonido" },
      especificaciones: { dimensiones: "1920x1080 px (Canvas global) / 160px cada lateral", formatosPermitidos: "HTML5, JPG, PNG", cierreControles: "Pieza fija de acompañamiento", observaciones: "Debe mantener la legibilidad central del contenido editorial de 1200px intacta." },
      dispositivos: { plataformas: "Solo Desktop", comportamiento: "Background fijo / Sticky lateral", aspectRatio: "16:9 Adaptable a pantallas > 1280px" }
    },
    "skin-arco": {
      fichaTecnica: { tipoCompra: "CPD Exclusivo", pesoMaximo: "350 KB total", tiempoEntrega: "72h hábiles", audio: "Sin sonido" },
      especificaciones: { dimensiones: "Header 1920x250 + Laterales 160x900 px", formatosPermitidos: "HTML5, Zip con assets", cierreControles: "Envolvente fija", observaciones: "Toma completa de cabecera y marcos laterales para máximo impacto de marca." },
      dispositivos: { plataformas: "Solo Desktop", comportamiento: "Cabecera sincronizada con bordes laterales", aspectRatio: "Envolvente Desktop (> 1366px)" }
    },
    top: {
      fichaTecnica: { tipoCompra: "CPM / CPD", pesoMaximo: "100 KB initial", tiempoEntrega: "24h hábiles", audio: "Sin audio" },
      especificaciones: { dimensiones: "970x90 px (Desktop) / 320x50 px (Mobile)", formatosPermitidos: "HTML5, JPG, GIF, PNG", observaciones: "Ubicación destacada en la zona superior de todo el sitio." },
      dispositivos: { plataformas: "Multiplataforma", comportamiento: "Header banner fijo o fluido", aspectRatio: "10:1 (Desktop) / 6:1 (Mobile)" }
    },
    caja: {
      fichaTecnica: { tipoCompra: "CPM Run of Site", pesoMaximo: "120 KB", tiempoEntrega: "24h hábiles", audio: "Sin audio" },
      especificaciones: { dimensiones: "300x250 px (MREC) / 300x600 px (Half Page)", formatosPermitidos: "HTML5, JPG, PNG", observaciones: "Integra perfectamente en barras laterales y dentro de cuerpos de noticias." },
      dispositivos: { plataformas: "Multiplataforma", comportamiento: "Inline / Sidebar Sticky", aspectRatio: "6:5 (300x250) / 1:2 (300x600)" }
    }
  };

  if (defaultSpecsMap[format.slug]) {
    return defaultSpecsMap[format.slug];
  }

  return {
    fichaTecnica: {
      tipoCompra: "CPM / CPD Directa",
      pesoMaximo: isMobileOnly ? "150 KB" : "250 KB",
      tiempoEntrega: "48h hábiles antes del inicio de campaña",
      audio: "Mute por defecto / Activación opcional por interacción de usuario",
    },
    especificaciones: {
      dimensiones: isMobileOnly ? "320x100 px / 360x640 px" : isDesktopOnly ? "970x250 px / 1920x1080 canvas" : "Multiplataforma adaptable",
      formatosPermitidos: "HTML5, MP4 (H.264), JPG, PNG",
      cierreControles: "Integrados según comportamiento del formato",
      observaciones: "Todos los códigos y etiquetas de seguimiento deben servirse bajo protocolo HTTPS estricto.",
    },
    dispositivos: {
      plataformas: format.availability ?? (format.device === "Desktop" ? "Solo Desktop" : format.device === "Mobile" ? "Solo Mobile" : "Multiplataforma (Desktop + Mobile)"),
      comportamiento: "Adaptación fluida según viewport del navegador",
      aspectRatio: isMobileOnly ? "9:16 / 1:1" : isDesktopOnly ? "16:9 / 4:1" : "Responsive 16:9 & 9:16",
    },
  };
}

const RICH_MEDIA_FORMATS: FormatItem[] = [
  { id: "01", slug: "interstitial", title: "Interstitial", device: "Multiplataforma", visual: "interstitial", description: "Una pieza de alto impacto que ocupa el foco de la navegación en un momento definido del recorrido." },
  { id: "02", slug: "interscroller", title: "Interscroller", device: "Mobile", visual: "interscroller", description: "El anuncio se revela con el desplazamiento y convierte el scroll en parte natural de la experiencia.", availability: "Solo mobile" },
  { id: "03", slug: "skin", title: "Skin", device: "Desktop", visual: "skin", description: "La marca enmarca el contenido editorial con presencia sostenida y una lectura clara.", availability: "Solo desktop" },
  { id: "04", slug: "skin-arco", title: "Skin Arco", device: "Desktop", visual: "skin-arch", description: "Una toma envolvente de cabecera y laterales que amplía la superficie visual de campaña.", availability: "Solo desktop" },
  { id: "05", slug: "widget", title: "Widget", device: "Multiplataforma", visual: "widget", description: "Un módulo compacto y contextual que mantiene la campaña cerca del contenido relevante." },
  { id: "06", slug: "zocalo", title: "Zócalo", device: "Multiplataforma", visual: "lower-third", description: "Una franja horizontal visible y directa, pensada para mensajes breves y llamados a la acción." },
  { id: "07", slug: "historias", title: "Historias", device: "Multiplataforma", visual: "stories", description: "Una narrativa vertical y secuencial diseñada para consumirse con rapidez y participación." },
  { id: "08", slug: "sondeo", title: "Sondeo", device: "Multiplataforma", visual: "poll", description: "Una pregunta integrada al contenido que invita a la audiencia a responder y tomar posición." },
  { id: "09", slug: "scratch", title: "Scratch", device: "Multiplataforma", visual: "scratch", description: "Una mecánica de descubrimiento que transforma una pieza estática en una interacción táctil." },
  { id: "10", slug: "antes-y-despues", title: "Antes y después", device: "Multiplataforma", visual: "before-after", description: "Un comparador visual que permite explorar dos estados de una misma historia o producto." },
  { id: "11", slug: "banner-360", title: "Banner 360°", device: "Mobile", visual: "panorama", description: "Una experiencia móvil que responde al gesto para recorrer el contenido en todas sus perspectivas.", availability: "Solo mobile" },
  { id: "12", slug: "hot-spot", title: "Hot Spot", device: "Multiplataforma", visual: "hotspot", description: "Puntos activos dentro de la creatividad revelan información sin interrumpir la navegación." },
  { id: "13", slug: "contador", title: "Contador", device: "Multiplataforma", visual: "countdown", description: "Una cuenta regresiva convierte una fecha, estreno o lanzamiento en un momento esperado." },
  { id: "14", slug: "social-ad", title: "Social AD", device: "Multiplataforma", visual: "social", description: "La lógica visual de redes sociales se integra al entorno editorial de GRPP." },
  { id: "15", slug: "video-top-full", title: "Video Top Full", device: "Desktop", visual: "video", description: "Video de gran formato en la zona superior para presentar una campaña desde el primer vistazo." },
];

const STANDARD_FORMATS: FormatItem[] = [
  { id: "01", slug: "top", title: "Top", device: "Multiplataforma", visual: "video", imageSrc: "/images/formats/standard/top.png", description: "Una franja horizontal ubicada en la zona superior que asegura presencia desde el primer contacto con el contenido." },
  { id: "02", slug: "caja", title: "Caja", device: "Multiplataforma", visual: "widget", imageSrc: "/images/formats/standard/caja.png", description: "Una pieza rectangular versátil que acompaña la lectura y mantiene la marca visible dentro del recorrido editorial." },
  { id: "03", slug: "middle", title: "Middle", device: "Multiplataforma", visual: "lower-third", imageSrc: "/images/formats/standard/middle.png", description: "Un formato horizontal integrado a mitad de página, pensado para alcanzar a una audiencia ya involucrada con el contenido." },
  { id: "04", slug: "doble-caja", title: "Doble Caja", device: "Desktop", visual: "skin", imageSrc: "/images/formats/standard/doble-caja.png", description: "Dos espacios coordinados que amplían la presencia de campaña y permiten construir una comunicación visual complementaria.", availability: "Solo desktop" },
  { id: "05", slug: "destaque", title: "Destaque", device: "Multiplataforma", visual: "hotspot", imageSrc: "/images/formats/standard/destaque.png", description: "Una posición de alta visibilidad que separa la campaña del flujo habitual y refuerza la recordación de marca." },
  { id: "06", slug: "intertexto", title: "Intertexto", device: "Multiplataforma", visual: "before-after", imageSrc: "/images/formats/standard/intertexto.png", description: "Una pieza insertada entre bloques editoriales que aparece de forma natural durante la lectura del artículo." },
];

const CATALOGS: Record<Catalog, { label: string; heading: [string, string]; description: string; formats: FormatItem[] }> = {
  "rich-media": {
    label: "Rich Media",
    heading: ["Experiencias que", "responden"],
    description: "Conoce cómo tu idea puede aparecer, moverse y responder dentro del ecosistema digital de GRPP.",
    formats: RICH_MEDIA_FORMATS,
  },
  standard: {
    label: "Estándar",
    heading: ["Presencia en", "cada lectura"],
    description: "Piezas clásicas de display con excelente alcance y frecuencia. Ideales para mantener presencia continua y reforzar recordación de marca.",
    formats: STANDARD_FORMATS,
  },
};

const CATALOG_ORDER: Catalog[] = ["rich-media", "standard"];
const ECOSYSTEM_AREAS: { id: EcosystemArea; label: string }[] = [
  { id: "display", label: "Display" },
  { id: "branded-content", label: "Branded Content" },
  { id: "streaming", label: "Streaming" },
];
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

function PlatformBadge({ availability }: { availability: Availability }) {
  const isMobile = availability === "Solo mobile";

  return (
    <span className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 font-mono2 text-[7px] uppercase tracking-[0.13em] text-ink ${isMobile ? "bg-[#ffe500]" : "bg-[#83e6bd]"}`}>
      {isMobile ? (
        <span aria-hidden="true" className="h-3 w-2 rounded-[2px] border border-current" />
      ) : (
        <span aria-hidden="true" className="flex flex-col items-center">
          <span className="h-2 w-3.5 rounded-[1px] border border-current" />
          <span className="h-px w-2 bg-current" />
        </span>
      )}
      {availability}
    </span>
  );
}

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
  const location = useLocation();
  const { formatSlug } = useParams();
  const rootRef = useRef<HTMLElement>(null);
  const indexRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const sourceRectRef = useRef<DOMRect | null>(null);
  const detailTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasOpenedRef = useRef(false);
  const closingRef = useRef(false);
  const routeCatalog: Catalog = location.pathname.startsWith("/formatos/standard") ? "standard" : "rich-media";
  const selectedCatalogData = CATALOGS[routeCatalog];
  const selected = selectedCatalogData.formats.find((format) => format.slug === formatSlug) ?? null;
  const catalogBasePath = routeCatalog === "standard" ? "/formatos/standard" : "/formatos";
  const selectedIndex = selected ? selectedCatalogData.formats.findIndex((format) => format.id === selected.id) : -1;
  const previousFormat = selectedIndex >= 0
    ? selectedCatalogData.formats[(selectedIndex - 1 + selectedCatalogData.formats.length) % selectedCatalogData.formats.length]
    : null;
  const nextFormat = selectedIndex >= 0
    ? selectedCatalogData.formats[(selectedIndex + 1) % selectedCatalogData.formats.length]
    : null;
  const [activeSection, setActiveSection] = useState<Catalog>(routeCatalog);
  const [activeArea, setActiveArea] = useState<EcosystemArea>("display");
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    if (!selected) return;
    const fullUrl = `${window.location.origin}${catalogBasePath}/${selected.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    document.title = selected
      ? `${selected.title} | ${selectedCatalogData.label} | Formatos GRPP`
      : "Catálogo de formatos digitales | GRPP";
  }, [selected, selectedCatalogData.label]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-catalog-section]").forEach((section) => {
        const intro = section.querySelector("[data-catalog-intro]");
        const signal = section.querySelector("[data-catalog-signal]");
        const headingLines = section.querySelectorAll("[data-catalog-heading-line]");
        const copy = section.querySelectorAll("[data-catalog-copy]");

        if (intro && !reduceMotion) {
          const timeline = gsap.timeline({
            scrollTrigger: { trigger: intro, start: "top 82%", once: true },
            defaults: { ease: "power4.out" },
          });
          timeline
            .fromTo(signal, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.65 })
            .fromTo(headingLines, { yPercent: 115 }, { yPercent: 0, duration: 0.85, stagger: 0.08 }, "-=0.38")
            .fromTo(copy, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.06 }, "-=0.48");
        }

        const sectionId = section.dataset.catalogSection as Catalog;
        ScrollTrigger.create({
          trigger: section,
          start: "top 42%",
          end: "bottom 42%",
          onEnter: () => setActiveSection(sectionId),
          onEnterBack: () => setActiveSection(sectionId),
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-ecosystem-area]").forEach((section) => {
        const areaId = section.dataset.ecosystemArea as EcosystemArea;
        const reveals = section.querySelectorAll("[data-area-reveal]");
        if (reveals.length && !reduceMotion) {
          gsap.fromTo(reveals, { y: 36, autoAlpha: 0 }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.85,
            stagger: 0.08,
            ease: "power4.out",
            scrollTrigger: { trigger: section, start: "top 78%", once: true },
          });
        }
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          invalidateOnRefresh: true,
          onToggle: (self) => {
            if (self.isActive) setActiveArea(areaId);
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const pendingImages = Array.from(root.querySelectorAll("img")).filter((image) => !image.complete);
    const refresh = () => ScrollTrigger.refresh();
    pendingImages.forEach((image) => image.addEventListener("load", refresh, { once: true }));
    requestAnimationFrame(refresh);
    return () => pendingImages.forEach((image) => image.removeEventListener("load", refresh));
  }, []);

  const scrollToCatalog = (catalog: Catalog) => {
    const target = document.getElementById(`catalog-${catalog}`);
    if (!target) return;
    setActiveArea("display");
    setActiveSection(catalog);
    const offset = window.innerWidth < 768 ? -(indexRef.current?.offsetHeight ?? 0) - 12 : -24;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { offset, duration: 1.25 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToArea = (area: EcosystemArea) => {
    const target = document.getElementById(`area-${area}`);
    if (!target) return;
    setActiveArea(area);
    const offset = window.innerWidth < 768 ? -(indexRef.current?.offsetHeight ?? 0) - 12 : -24;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { offset, duration: 1.35 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  const openDetail = (format: FormatItem, catalog: Catalog, event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const preview = event.currentTarget.querySelector<HTMLElement>("[data-gallery-preview]");
    sourceRectRef.current = (preview ?? event.currentTarget).getBoundingClientRect();
    gsap.fromTo(event.currentTarget, { scale: 1 }, { scale: 0.985, duration: 0.14, yoyo: true, repeat: 1, ease: "power2.inOut" });
    const basePath = catalog === "standard" ? "/formatos/standard" : "/formatos";
    navigate(`${basePath}/${format.slug}`);
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
  }, []);

  useEffect(() => {
    if (formatSlug || routeCatalog !== "standard") return;
    requestAnimationFrame(() => {
      const target = document.getElementById("catalog-standard");
      if (!target) return;
      const offset = -(indexRef.current?.offsetHeight ?? 0) - 12;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(target, { offset, duration: 1.25 });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  }, [formatSlug, routeCatalog]);

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
      navigate(catalogBasePath, { replace: true });
      getLenis()?.start();
      sourceRectRef.current = null;
      afterClose?.();
      return;
    }

    closingRef.current = true;
    gsap.timeline({
      onComplete: () => {
        navigate(catalogBasePath, { replace: true });
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
    const formats = selectedCatalogData.formats;
    const index = formats.findIndex((format) => format.id === selected.id);
    const nextIndex = (index + direction + formats.length) % formats.length;
    const targetFormat = formats[nextIndex];
    if (targetFormat) {
      detailRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      navigate(`${catalogBasePath}/${targetFormat.slug}`, { replace: true });
    }
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
        ref={indexRef}
        className="sticky z-20 border-b border-ink/15 bg-bone/95 px-5 py-3 backdrop-blur-xl transition-[top] duration-500 md:hidden"
        style={{ top: "var(--nav-offset, 0px)" }}
      >
        <div className="relative">
          <label className="relative block">
            <span className="sr-only">Área del ecosistema</span>
            <select value={activeArea} onChange={(event) => scrollToArea(event.target.value as EcosystemArea)} className="h-12 w-full appearance-none rounded-lg border border-ink/25 bg-white px-4 pr-11 text-sm font-semibold text-ink outline-none transition-colors focus:border-red">
              {ECOSYSTEM_AREAS.map((area) => <option key={area.id} value={area.id}>{area.label}</option>)}
            </select>
            <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-ink/55">⌄</span>
          </label>
          {activeArea === "display" && (
            <nav className="mt-2 flex overflow-x-auto border-b border-ink/15 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Secciones de Display">
              {CATALOG_ORDER.map((catalog) => {
                const active = activeSection === catalog;
                return (
                  <button key={catalog} onClick={() => scrollToCatalog(catalog)} aria-current={active ? "location" : undefined} className={`min-h-11 shrink-0 border-b-2 px-4 text-sm font-semibold transition-colors ${active ? "border-red text-red" : "border-transparent text-ink/45"}`}>
                    {CATALOGS[catalog].label}
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] md:grid md:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="relative hidden border-r border-ink/12 bg-bone md:block">
          <div className="sticky px-7 py-10" style={{ top: "calc(var(--nav-offset, 0px) + 1.5rem)" }}>
            <p className="font-mono2 text-[9px] uppercase tracking-[0.22em] text-ink/35">Índice del catálogo</p>
            <nav className="mt-7" aria-label="Ecosistema de formatos">
              {ECOSYSTEM_AREAS.map((area) => {
                const active = activeArea === area.id;
                return (
                  <div key={area.id} className="border-t border-ink/12 py-4 first:border-t-0 first:pt-0">
                    <button onClick={() => scrollToArea(area.id)} data-cursor="hover" aria-current={active ? "location" : undefined} className={`w-full rounded-md border-l-[3px] px-4 py-3 text-left text-lg font-semibold leading-tight transition-colors duration-300 ${active ? "border-red bg-red text-white" : "border-transparent text-ink/45 hover:bg-ink/[0.04] hover:text-ink"}`}>
                      {area.label}
                    </button>
                    {area.id === "display" && (
                      <div className="ml-[3px] mt-3 space-y-1 border-l border-ink/12 pl-4">
                        {CATALOG_ORDER.map((catalog) => {
                          const sectionActive = activeArea === "display" && activeSection === catalog;
                          return (
                            <button key={catalog} onClick={() => scrollToCatalog(catalog)} data-cursor="hover" aria-current={sectionActive ? "location" : undefined} className={`block w-full rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors ${sectionActive ? "bg-red/[0.08] text-red" : "text-ink/45 hover:bg-ink/[0.04] hover:text-ink"}`}>
                              {CATALOGS[catalog].label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        <div data-catalog-content className="min-w-0">
          <div id="area-display" data-ecosystem-area="display">
          {CATALOG_ORDER.map((catalog, catalogIndex) => {
          const catalogData = CATALOGS[catalog];
          const catalogBasePath = catalog === "standard" ? "/formatos/standard" : "/formatos";
          return (
            <section key={catalog} id={`catalog-${catalog}`} data-catalog-section={catalog} className={catalogIndex === 0 ? "bg-bone" : "border-t border-ink/12 bg-[#e9e7e1]"}>
              <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-20 md:px-10 md:pb-40 md:pt-32">
                <div data-catalog-intro>
                  <div data-catalog-signal className="mb-7 h-[3px] w-16 bg-red md:mb-10 md:w-24" />
                  <div className="mb-16 grid gap-8 md:mb-24 md:grid-cols-12 md:items-end">
                    <h2 className="font-display text-[16vw] uppercase leading-[0.82] tracking-[0.01em] md:col-span-8 md:text-[7.2vw]">
                      <span className="block overflow-hidden"><span data-catalog-heading-line className="block">{catalogData.heading[0]}</span></span>
                      <span className="block overflow-hidden text-red"><span data-catalog-heading-line className="block">{catalogData.heading[1]}</span></span>
                    </h2>
                    <div className="md:col-span-4 md:pb-2">
                      <p data-catalog-copy className="font-mono2 text-[8px] uppercase tracking-[0.22em] text-ink/35">Display / {catalogData.label}</p>
                      <p data-catalog-copy className="mt-5 max-w-sm text-sm leading-relaxed text-ink/[0.58] md:text-base">{catalogData.description}</p>
                      <p data-catalog-copy className="mt-5 font-mono2 text-[9px] uppercase tracking-[0.2em] text-ink/35">{String(catalogData.formats.length).padStart(2, "0")} formatos disponibles</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-x-7 gap-y-16 md:grid-cols-12 md:gap-x-10 md:gap-y-24">
                  {catalogData.formats.map((format, index) => (
                    <article key={`${catalog}-${format.id}`} data-gallery-item className={GALLERY_RHYTHM[index % GALLERY_RHYTHM.length]}>
                      <a href={`${catalogBasePath}/${format.slug}`} onClick={(event) => openDetail(format, catalog, event)} data-cursor="ABRIR" className="group block w-full text-left active:scale-[0.99]" aria-label={`Abrir detalle de ${format.title}`}>
                        <div data-gallery-preview className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
                          <FormatPreview visual={format.visual} title={format.title} imageSrc={format.imageSrc} />
                          <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/[0.06]" />
                          <span className="absolute bottom-5 right-5 flex h-12 w-12 translate-y-3 items-center justify-center rounded-full bg-red text-xl text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:bottom-7 md:right-7 md:h-14 md:w-14">↗</span>
                        </div>
                        <div className="mt-5 grid grid-cols-[auto_1fr] gap-4 md:mt-7 md:gap-6">
                          <span className="pt-1 font-mono2 text-[9px] tracking-[0.16em] text-red">{format.id}</span>
                          <div className="border-t border-ink/15 pt-4 md:pt-5">
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="font-display text-4xl uppercase leading-none transition-colors duration-300 group-hover:text-red md:text-5xl lg:text-6xl">{format.title}</h3>
                              {format.availability && <PlatformBadge availability={format.availability} />}
                            </div>
                            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/50 md:mt-4">{format.description}</p>
                          </div>
                        </div>
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
          </div>

          <section id="area-branded-content" data-ecosystem-area="branded-content" className="bg-ink px-5 py-24 text-bone md:px-10 md:py-36">
            <div className="mx-auto max-w-[1120px]">
              <p data-area-reveal className="font-mono2 text-[9px] uppercase tracking-[0.24em] text-bone/40">Ecosistema / Branded Content</p>
              <div className="mt-8 grid gap-10 md:grid-cols-12 md:items-end">
                <h2 data-area-reveal className="font-display text-[15vw] uppercase leading-[0.84] md:col-span-8 md:text-[6.4vw]">Historias que<br /><span className="text-red">conectan</span></h2>
                <p data-area-reveal className="max-w-sm text-sm leading-relaxed text-bone/55 md:col-span-4 md:text-base">Contenido especial y branded content pensados para conectar a las marcas con cada audiencia del ecosistema GRPP.</p>
              </div>
              <div data-area-reveal className="mt-16 grid border-y border-white/15 sm:grid-cols-3 md:mt-24">
                {["Web", "Redes Sociales", "Mailing"].map((item) => (
                  <div key={item} className="flex min-h-28 items-center border-b border-white/15 px-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 md:min-h-36 md:px-7">
                    <span className="text-lg font-semibold md:text-xl">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="area-streaming" data-ecosystem-area="streaming" className="bg-[#dedcd6] px-5 py-24 text-ink md:px-10 md:py-36">
            <div className="mx-auto max-w-[1120px]">
              <p data-area-reveal className="font-mono2 text-[9px] uppercase tracking-[0.24em] text-ink/35">Ecosistema / Streaming</p>
              <div className="mt-8 grid gap-10 md:grid-cols-12 md:items-end">
                <h2 data-area-reveal className="font-display text-[15vw] uppercase leading-[0.84] md:col-span-8 md:text-[6.4vw]">Contenido que<br /><span className="text-red">se escucha</span></h2>
                <p data-area-reveal className="max-w-sm text-sm leading-relaxed text-ink/55 md:col-span-4 md:text-base">Soluciones de audio y escucha digital que acompañan a la audiencia dentro y fuera de la pantalla.</p>
              </div>
              <div data-area-reveal className="mt-16 grid border-y border-ink/15 sm:grid-cols-3 md:mt-24">
                <div className="flex min-h-28 items-center border-b border-ink/15 px-5 sm:border-b-0 sm:border-r md:min-h-36 md:px-7"><img src="/images/stars_logo.svg" alt="Stars" className="h-10 w-auto max-w-[130px]" /></div>
                <div className="flex min-h-28 items-center border-b border-ink/15 px-5 sm:border-b-0 sm:border-r md:min-h-36 md:px-7"><img src="/images/audioplayer_logo.svg" alt="Audioplayer" className="h-10 w-auto max-w-[150px]" /></div>
                <div className="flex min-h-28 items-center px-5 md:min-h-36 md:px-7"><span className="text-lg font-semibold md:text-xl">Streaming</span></div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Dialog.Root open={selected !== null} onOpenChange={(open) => { if (!open) closeDetail(); }}>
        <Dialog.Portal>
          <Dialog.Overlay ref={overlayRef} className="fixed inset-0 z-[230] bg-ink/60 backdrop-blur-sm" />
          {selected && (
            <Dialog.Content ref={setDetailNode} data-lenis-prevent onEscapeKeyDown={(event) => { event.preventDefault(); closeDetail(); }} className="fixed inset-0 z-[240] h-[100dvh] max-h-[100dvh] touch-pan-y overflow-x-hidden overflow-y-auto overscroll-contain bg-ink text-bone outline-none [-webkit-overflow-scrolling:touch]" style={{ visibility: "hidden", willChange: "transform" }} aria-describedby="format-detail-description">
              <div className="mx-auto flex min-h-full max-w-[1600px] flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-[calc(env(safe-area-inset-top)+1.5rem)] md:px-10 md:pb-10 md:pt-8">
                <div className="flex items-center justify-between border-b border-white/12 pb-5">
                  <p data-detail-reveal className="font-mono2 text-[9px] uppercase tracking-[0.25em] text-bone/40">Formato {selected.id} / {String(selectedCatalogData.formats.length).padStart(2, "0")}</p>
                  <div className="flex items-center gap-3">
                    <button onClick={() => closeDetail()} data-cursor="hover" className="hidden font-mono2 text-[8px] uppercase tracking-[0.18em] text-bone/50 transition-colors hover:text-bone sm:block">← Todos los formatos</button>
                    <button onClick={() => closeDetail()} data-cursor="hover" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-xl text-bone transition-colors hover:bg-bone hover:text-ink" aria-label="Cerrar detalle">×</button>
                  </div>
                </div>

                <div className="grid flex-1 items-center gap-10 py-10 md:grid-cols-12 md:gap-12 md:py-12">
                  <div data-detail-reveal className="md:col-span-8">
                    <FormatPreview key={`${routeCatalog}-${selected.id}`} visual={selected.visual} title={selected.title} imageSrc={selected.imageSrc} />
                  </div>
                  <div className="md:col-span-4">
                    {selected.availability && <div data-detail-reveal><PlatformBadge availability={selected.availability} /></div>}
                    <Dialog.Title data-detail-reveal className={`${selected.availability ? "mt-6" : "mt-0"} font-display text-[18vw] uppercase leading-[0.82] text-bone md:text-[6vw]`}>{selected.title}</Dialog.Title>
                    <Dialog.Description id="format-detail-description" data-detail-reveal className="mt-7 max-w-md text-sm leading-relaxed text-bone/55 md:text-base">{selected.description}</Dialog.Description>
                    <div data-detail-reveal>
                      <FormatHighlights highlights={getFormatHighlights(selected)} />
                    </div>
                    <div data-detail-reveal>
                      <FormatAccordion specs={getFormatSpecs(selected)} />
                    </div>
                    <div data-detail-reveal className="mt-8 flex flex-wrap gap-3">
                      <button onClick={consultFormat} data-cursor="hover" className="rounded-full bg-red px-6 py-4 font-mono2 text-[9px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-bone hover:text-ink">Consultar este formato →</button>
                      <button onClick={copyUrl} data-cursor="hover" className="rounded-full border border-white/20 px-5 py-4 font-mono2 text-[9px] uppercase tracking-[0.18em] text-bone transition-colors hover:border-white hover:bg-white/10">
                        {copied ? "¡Enlace copiado! ✓" : "Copiar enlace ↗"}
                      </button>
                    </div>
                  </div>
                </div>

                <nav data-detail-reveal className="mt-6 border-t border-white/12 pt-5 md:mt-8" aria-label="Navegación del catálogo">
                  <div className="mb-4 flex items-center justify-between font-mono2 text-[9px] uppercase tracking-[0.2em] text-bone/40">
                    <span>Explora el catálogo</span>
                    <span>{String(selectedIndex + 1).padStart(2, "0")} / {String(selectedCatalogData.formats.length).padStart(2, "0")}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <button onClick={() => stepDetail(-1)} data-cursor="hover" className="order-2 flex h-14 w-full items-center justify-between rounded-full border border-white/20 px-5 font-mono2 text-[9px] uppercase tracking-[0.16em] text-bone/70 transition-colors hover:border-bone hover:bg-white/[0.08] hover:text-bone sm:order-1">
                      <span>← Anterior</span>
                      <span className="max-w-[52%] truncate text-bone/40">{previousFormat?.title}</span>
                    </button>
                    <button onClick={() => closeDetail()} data-cursor="hover" className="order-3 flex h-14 items-center justify-center rounded-full border border-white/20 px-5 font-mono2 text-[8px] uppercase tracking-[0.16em] text-bone/70 transition-colors hover:border-bone hover:bg-white/[0.08] hover:text-bone sm:order-2">Ver todos los formatos</button>
                    <button onClick={() => stepDetail(1)} data-cursor="hover" className="group order-1 flex h-14 w-full items-center justify-between rounded-full bg-bone px-6 font-mono2 text-[9px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-red hover:text-white sm:order-3">
                      <span>Siguiente</span>
                      <span className="flex min-w-0 items-center gap-3"><span className="truncate">{nextFormat?.title}</span><span className="text-base leading-none transition-transform group-hover:translate-x-1">→</span></span>
                    </button>
                  </div>
                </nav>
              </div>
            </Dialog.Content>
          )}
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
