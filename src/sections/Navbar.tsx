import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/anim";
import { scrollToId } from "@/lib/scroll";
import Magnetic from "@/components/Magnetic";

const LINKS = [
  { label: "Home", id: "hero" },
  { label: "Audiencia", id: "audiencia" },
  { label: "Formatos", id: "formatos" },
  { label: "Marcas", id: "marcas" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const nav = navRef.current!;
    let lastY = 0;

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        nav.classList.toggle("nav-scrolled", y > 60);
        if (y > lastY && y > 140 && !open) {
          gsap.to(nav, { yPercent: -110, duration: 0.5, ease: "power3.out" });
        } else {
          gsap.to(nav, { yPercent: 0, duration: 0.5, ease: "power3.out" });
        }
        lastY = y;
      },
    });
    return () => st.kill();
  }, [open]);

  useEffect(() => {
    const menu = document.getElementById("mobile-menu");
    if (!menu) return;
    if (open) {
      gsap.set(menu, { display: "flex" });
      gsap.fromTo(menu, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power4.inOut" });
      gsap.fromTo(menu.querySelectorAll(".m-link"), { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, delay: 0.3, duration: 0.7, ease: "power4.out" });
    } else {
      gsap.to(menu, { clipPath: "inset(0 0 100% 0)", duration: 0.55, ease: "power4.inOut", onComplete: () => gsap.set(menu, { display: "none" }) });
    }
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), open ? 500 : 0);
  };

  return (
    <>
      <header
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[150] px-5 md:px-10 py-4 flex items-center justify-between transition-[background-color,backdrop-filter,border-color] duration-500 [&.nav-scrolled]:bg-ink/70 [&.nav-scrolled]:backdrop-blur-xl [&.nav-scrolled]:border-b [&.nav-scrolled]:border-white/10"
      >
        <button onClick={() => go("hero")} data-cursor="hover" className="flex items-center" aria-label="Ir al inicio">
          <img src="/images/grpp.svg" alt="GRPP" className="h-8 md:h-9 w-auto" />
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              data-cursor="hover"
              className="u-link font-mono2 text-[11px] tracking-[0.2em] uppercase text-bone/70 hover:text-bone transition-colors"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Magnetic className="hidden md:inline-block">
            <button
              onClick={() => go("contacto")}
              data-cursor="hover"
              className="bg-red text-white font-mono2 text-[11px] tracking-[0.18em] uppercase px-6 py-3 rounded-full hover:bg-bone hover:text-ink transition-colors duration-300"
            >
              Hablemos
            </button>
          </Magnetic>
          <button
            onClick={() => setOpen(!open)}
            data-cursor="hover"
            className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-[6px]"
            aria-label="Menú"
          >
            <span className={`block w-6 h-[2px] bg-bone transition-transform duration-300 ${open ? "rotate-45 translate-y-[4px]" : ""}`} />
            <span className={`block w-6 h-[2px] bg-bone transition-transform duration-300 ${open ? "-rotate-45 -translate-y-[4px]" : ""}`} />
          </button>
        </div>
      </header>

      <div id="mobile-menu" className="fixed inset-0 z-[140] bg-red hidden flex-col justify-center px-8" style={{ clipPath: "inset(0 0 100% 0)" }}>
        {LINKS.concat({ label: "Contacto", id: "contacto" }).map((l, i) => (
          <button key={l.id} onClick={() => go(l.id)} className="m-link text-left py-2">
            <span className="font-mono2 text-xs text-white/60 mr-4">0{i + 1}</span>
            <span className="font-display text-5xl text-white uppercase">{l.label}</span>
          </button>
        ))}
        <p className="m-link absolute bottom-8 left-8 font-mono2 text-[10px] tracking-[0.3em] text-white/60 uppercase">GRPP® — Media Kit 2026</p>
      </div>
    </>
  );
}
