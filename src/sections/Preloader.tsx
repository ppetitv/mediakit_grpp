import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/anim";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = rootRef.current!;
    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setGone(true);
        onDone();
      },
    });

    tl.to(counter, {
      v: 100,
      duration: 2.1,
      ease: "power2.inOut",
      onUpdate: () => setDisplay(Math.round(counter.v)),
    })
      .to(root.querySelector(".pre-center"), { yPercent: -120, duration: 0.6, ease: "power3.in" }, "+=0.15")
      .to(root.querySelector(".pre-meta"), { opacity: 0, duration: 0.3 }, "<")
      .to(root.querySelector(".pre-red"), { yPercent: -100, duration: 0.7, ease: "power4.inOut" }, "-=0.1")
      .to(root.querySelector(".pre-black"), { yPercent: -100, duration: 0.7, ease: "power4.inOut" }, "-=0.5")
      .set(root, { display: "none" });

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[400]">
      <div className="pre-black absolute inset-0 bg-ink flex items-center justify-center">
        <div className="pre-center overflow-hidden text-center">
          <p className="font-mono2 text-[10px] tracking-[0.35em] text-smoke uppercase mb-4">Grupo RPP — Media Kit</p>
          <img src="/images/grpp.svg" alt="GRPP" className="mx-auto h-20 md:h-28 w-auto" />
          <p className="font-mono2 text-[10px] tracking-[0.35em] text-smoke uppercase mt-4">©2026 — Conectando marcas</p>
        </div>
        <div className="pre-meta absolute bottom-8 left-6 md:left-10 font-mono2 text-xs text-smoke">CARGANDO EXPERIENCIA 360</div>
        <div className="pre-meta absolute bottom-6 right-6 md:right-10 font-display text-6xl md:text-8xl text-bone tabular-nums">
          {display}
          <span className="text-red text-3xl md:text-5xl align-top">%</span>
        </div>
        <div className="pre-meta absolute bottom-0 left-0 h-[2px] bg-red" style={{ width: `${display}%` }} />
      </div>
      <div className="pre-red absolute inset-0 bg-red -z-10" />
    </div>
  );
}
