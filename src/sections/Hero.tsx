import { useEffect, useRef } from "react";
import { gsap } from "@/lib/anim";
import { scrollToId } from "@/lib/scroll";
import Magnetic from "@/components/Magnetic";

const ROTATING = ["CONECTADAS", "INFORMADAS", "PRESENTES", "EN ACCIÓN"];

export default function Hero({ started }: { started: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotRef = useRef<HTMLSpanElement>(null);

  /* ---------- intro reveal ---------- */
  useEffect(() => {
    if (!started) return;
    const q = gsap.utils.selector(rootRef);
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.to(q(".reveal-line > span"), { y: 0, duration: 1.3, stagger: 0.09 }, 0.1)
      .fromTo(q(".hero-fade"), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.08 }, 0.6)
      .fromTo(q(".hero-badge"), { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 1.2, ease: "elastic.out(1,0.5)" }, 0.9);
    return () => {
      tl.kill();
    };
  }, [started]);

  /* ---------- rotating word ---------- */
  useEffect(() => {
    const el = rotRef.current!;
    const words = el.querySelectorAll<HTMLElement>(".rot-word");
    gsap.set(words, { yPercent: 100 });
    gsap.set(words[0], { yPercent: 0 });
    let i = 0;
    const spin = () => {
      const current = words[i % words.length];
      const next = words[(i + 1) % words.length];
      gsap.to(current, { yPercent: -100, duration: 0.7, ease: "power4.inOut" });
      gsap.fromTo(next, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: "power4.inOut" });
      i++;
    };
    const id = window.setInterval(spin, 2600);
    return () => window.clearInterval(id);
  }, []);

  /* ---------- equalizer canvas ---------- */
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = 0;
    let h = 0;
    let raf = 0;
    let lastTime = 0;
    let isVisible = false;
    let reduceMotion = motionQuery.matches;
    const mouse = { x: 0.5, energy: 0 };
    let t = 0;
    let gap = 18;
    let profiles: Array<{ amplitude: number; phase: number; speed: number; width: number }> = [];
    let redrawStatic = () => {};

    const noise = (index: number, seed: number) => {
      const value = Math.sin((index + 1) * seed) * 43758.5453;
      return value - Math.floor(value);
    };

    const buildProfiles = () => {
      gap = w < 768 ? 16 : 18;
      const count = Math.ceil(w / gap);
      profiles = Array.from({ length: count }, (_, index) => ({
        amplitude: 0.65 + noise(index, 12.9898) * 0.35,
        phase: noise(index, 78.233) * Math.PI * 2,
        speed: 0.7 + noise(index, 39.425) * 0.45,
        width: 2.5 + noise(index, 53.127) * 1.75,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildProfiles();
      if (reduceMotion) redrawStatic();
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      if (reduceMotion) return;
      mouse.x = e.clientX / window.innerWidth;
      mouse.energy = Math.min(mouse.energy + 0.16, 0.8);
    };
    window.addEventListener("mousemove", onMove);

    const drawFrame = (now: number, animate: boolean) => {
      const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
      lastTime = now;
      if (animate) {
        t += delta * 0.58;
        mouse.energy *= Math.pow(0.955, delta * 60);
      }

      ctx.clearRect(0, 0, w, h);
      const base = h;
      profiles.forEach((profile, i) => {
        const p = profiles.length > 1 ? i / (profiles.length - 1) : 0.5;
        const dist = Math.abs(p - mouse.x);
        const proximity = Math.max(0, 1 - dist * 8);
        const boost = animate ? proximity * (0.05 + mouse.energy * 0.32) : 0;
        const primary = 0.5 + Math.sin(t * profile.speed + profile.phase) * 0.5;
        const secondary = 0.5 + Math.sin(t * 0.52 + i * 0.19) * 0.5;
        const wave = (0.07 + primary * 0.12 + secondary * 0.05) * profile.amplitude;
        const bh = Math.min((wave + boost) * h, h * 0.62);
        const x = i * gap + gap * 0.5;
        const g = ctx.createLinearGradient(0, base - bh, 0, base);
        g.addColorStop(0, `rgba(232,20,30,${0.38 + proximity * mouse.energy * 0.22})`);
        g.addColorStop(1, "rgba(232,20,30,0)");
        ctx.fillStyle = g;
        ctx.fillRect(x, base - bh, profile.width, bh);
      });
    };
    redrawStatic = () => drawFrame(performance.now(), false);

    const draw = (now: number) => {
      drawFrame(now, true);
      raf = isVisible && !reduceMotion ? requestAnimationFrame(draw) : 0;
    };

    const start = () => {
      if (reduceMotion) {
        t = 0.8;
        drawFrame(performance.now(), false);
      } else if (isVisible && !raf) {
        lastTime = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        start();
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    observer.observe(rootRef.current!);

    const onMotionChange = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      start();
    };
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  /* ---------- scroll parallax ---------- */
  useEffect(() => {
    const q = gsap.utils.selector(rootRef);
    const tween = gsap.to(q(".hero-inner"), {
      yPercent: -18,
      opacity: 0.15,
      ease: "none",
      scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section ref={rootRef} id="hero" className="relative min-h-screen flex flex-col overflow-hidden bg-ink">
      {/* backdrop image */}
      <div className="absolute inset-0 opacity-40">
        <img src="/images/signal.png" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/40 to-ink" />
      </div>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-full h-[20vh] md:h-[24vh] opacity-80 pointer-events-none"
      />

      <div className="hero-inner relative z-10 flex-1 flex flex-col justify-center px-5 md:px-10 pt-28 pb-40">
        <p className="hero-fade max-w-full whitespace-normal font-mono2 text-[9px] leading-relaxed md:text-xs tracking-[0.18em] md:tracking-[0.35em] uppercase text-bone/60 mb-6 md:mb-10">
          Media Kit 2026 <span className="text-red mx-1 md:mx-2">●</span> GRUPO RPP
        </p>

        <h1 className="font-display uppercase leading-[0.92] text-bone text-[15vw] md:text-[10.5vw]">
          <span className="reveal-line"><span>Conectamos</span></span>
          <span className="reveal-line"><span>marcas <span className="text-bone">con</span></span></span>
          <span className="reveal-line"><span><span className="text-image-mask">millones</span> de</span></span>
          <span className="reveal-line"><span>
            personas{" "}
            <span ref={rotRef} className="relative inline-block overflow-hidden align-bottom text-red h-[0.98em]">
              <span className="invisible whitespace-nowrap">INFORMADAS</span>
              {ROTATING.map((w, i) => (
                <span key={i} className="rot-word block absolute left-0 top-0 whitespace-nowrap">
                  {w}
                </span>
              ))}
            </span>
          </span></span>
        </h1>

        <div className="mt-8 md:mt-12 flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
          <p className="hero-fade max-w-md text-bone/60 text-base md:text-lg leading-relaxed">
            Tu marca entra en la conversación que informa, entretiene y mueve al Perú.
          </p>
          <div className="hero-fade flex items-center gap-4">
            <Magnetic>
              <button
                onClick={() => scrollToId("formatos")}
                data-cursor="hover"
                className="group bg-red text-white font-mono2 text-[11px] tracking-[0.18em] uppercase px-8 py-4 rounded-full overflow-hidden relative"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-ink">Explorar formatos</span>
                <span className="absolute inset-0 bg-bone translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              </button>
            </Magnetic>
            <Magnetic>
              <button
                onClick={() => scrollToId("audiencia")}
                data-cursor="hover"
                className="u-link font-mono2 text-[11px] tracking-[0.18em] uppercase text-bone/80 px-2 py-4"
              >
                Conocer el alcance →
              </button>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* rotating badge */}
      <div className="hero-badge absolute hidden md:block right-8 md:right-14 top-24 md:top-32 z-10 w-24 h-24 md:w-36 md:h-36">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_14s_linear_infinite]">
          <defs>
            <path id="circlePath" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
          </defs>
          <text className="fill-bone/70" style={{ fontSize: "9.2px", fontFamily: "Graphik, system-ui, sans-serif", letterSpacing: "0.22em" }}>
            <textPath href="#circlePath" textLength="238" lengthAdjust="spacingAndGlyphs">
              MEDIA KIT 2026 • GRPP • MEDIA KIT 2026 •
            </textPath>
          </text>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-red animate-pulse" />
        </div>
      </div>

      {/* bottom meta */}
      <div className="hero-fade relative z-10 px-5 md:px-10 pb-8 flex items-center justify-between font-mono2 text-[10px] tracking-[0.25em] uppercase text-bone/40">
        <span className="hidden md:block">Scroll para explorar ↓</span>
      </div>
    </section>
  );
}
