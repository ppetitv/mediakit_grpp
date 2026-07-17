import { useEffect, useRef } from "react";
import { gsap } from "@/lib/anim";
import { scrollToId } from "@/lib/scroll";
import Magnetic from "@/components/Magnetic";

const SOCIALS = [
  { name: "X", path: "M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L2.8 2h6.4l4.4 5.9L18.9 2zm-1.1 18h1.7L7.1 3.9H5.3L17.8 20z" },
  { name: "IG", path: "M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.6 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3c1.2-.1 1.6-.1 4.8-.1zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm5.2-9.6a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" },
  { name: "LI", path: "M20.4 3H3.6C3.2 3 3 3.2 3 3.6v16.8c0 .4.2.6.6.6h16.8c.4 0 .6-.2.6-.6V3.6c0-.4-.2-.6-.6-.6zM8.3 18.4H5.7V9.7h2.6v8.7zM7 8.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm11.4 9.9h-2.6v-4.2c0-1 0-2.3-1.4-2.3s-1.7 1.1-1.7 2.3v4.2h-2.6V9.7h2.5v1.2h.1c.4-.7 1.2-1.4 2.5-1.4 2.7 0 3.2 1.8 3.2 4.1v4.8z" },
  { name: "YT", path: "M23.5 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.3-1C17.1 3.6 12 3.6 12 3.6s-5.1 0-8.3.3c-.4.1-1.4.1-2.3 1-.7.7-.9 2.3-.9 2.3S.3 9.1.3 11v1.8c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 8.1.3 8.1.3s5.1 0 8.3-.3c.4-.1 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8V11c0-1.9-.2-3.8-.2-3.8zM9.7 15V8.4l6.2 3.3-6.2 3.3z" },
];

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const q = gsap.utils.selector(rootRef);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        q(".footer-giant"),
        { yPercent: 40, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: rootRef.current, start: "top 85%", end: "top 35%", scrub: true },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={rootRef} className="relative bg-ink border-t border-white/10 overflow-hidden">
      <div className="px-5 md:px-10 pt-16 md:pt-24 pb-8">
        <div className="grid md:grid-cols-12 gap-10 pb-16">
          <div className="md:col-span-5">
            <img src="/images/grpp.svg" alt="GRPP" className="h-10 w-auto mb-4" />
            <p className="text-bone/45 text-sm leading-relaxed max-w-xs">
              La multiplataforma informativa más influyente del país. Conectamos marcas con millones de personas cada día.
            </p>
            <div className="flex gap-3 mt-8">
              {SOCIALS.map((s) => (
                <Magnetic key={s.name} strength={0.3}>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    aria-label={s.name}
                    data-cursor="hover"
                    className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-bone/60 hover:bg-red hover:border-red hover:text-white transition-colors duration-300"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono2 text-[10px] tracking-[0.3em] uppercase text-bone/35 mb-6">Menú</p>
            <ul className="space-y-3">
              {[
                { label: "Señal", id: "hero" },
                { label: "Audiencia", id: "audiencia" },
                { label: "Formatos", id: "formatos" },
                { label: "Marcas", id: "marcas" },
                { label: "Contacto", id: "contacto" },
              ].map((l) => (
                <li key={l.id}>
                  <button onClick={() => scrollToId(l.id)} data-cursor="hover" className="u-link text-bone/60 hover:text-bone text-sm transition-colors">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="font-mono2 text-[10px] tracking-[0.3em] uppercase text-bone/35 mb-6">¿Necesitas el media kit completo?</p>
            <p className="text-bone/60 text-sm leading-relaxed mb-6">Escríbenos y recibe tarifas, especificaciones técnicas y casos de éxito.</p>
            <button onClick={() => scrollToId("contacto")} data-cursor="hover" className="u-link font-mono2 text-[11px] tracking-[0.2em] uppercase text-red">
              comercial@grpp.pe →
            </button>
          </div>
        </div>

        <div className="footer-giant select-none pointer-events-none" aria-hidden>
          <img src="/images/grpp.svg" alt="" className="mx-auto w-[72vw] max-w-[880px] h-auto opacity-[0.06]" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 font-mono2 text-[10px] tracking-[0.2em] uppercase text-bone/35">
          <p>©2026 GRPP — Todos los derechos reservados</p>
          <p>Diseñado para conectar <span className="text-red">●</span> Lima, Perú</p>
        </div>
      </div>
    </footer>
  );
}
