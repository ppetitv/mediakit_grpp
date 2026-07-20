import { useEffect, useRef, type ReactNode, type Ref } from "react";
import { useLocation, useNavigate } from "react-router";
import { gsap, ScrollTrigger } from "@/lib/anim";
import { PageTransitionContext } from "@/lib/page-transition";

const PAGE_LABELS: Record<string, string> = {
  "/": "Inicio",
  "/formatos": "Formatos",
};

export default function PageTransition({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const redLayerRef = useRef<HTMLDivElement>(null);
  const inkLayerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const runningRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => () => {
    timelineRef.current?.kill();
  }, []);

  const transitionTo = (path: string) => {
    const targetUrl = new URL(path, window.location.origin);
    const current = `${location.pathname}${location.hash}`;
    const target = `${targetUrl.pathname}${targetUrl.hash}`;

    if (target === current || runningRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      navigate(target);
      return;
    }

    const root = rootRef.current;
    const redLayer = redLayerRef.current;
    const inkLayer = inkLayerRef.current;
    const label = labelRef.current;
    if (!root || !redLayer || !inkLayer || !label) {
      navigate(target);
      return;
    }

    runningRef.current = true;
    label.textContent = PAGE_LABELS[targetUrl.pathname] ?? "GRPP";
    timelineRef.current?.kill();

    const timeline = gsap.timeline({
      defaults: { ease: "power4.inOut" },
      onComplete: () => {
        runningRef.current = false;
        gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
      },
    });
    timelineRef.current = timeline;

    timeline
      .set(root, { autoAlpha: 1, pointerEvents: "auto" })
      .set([redLayer, inkLayer], { xPercent: -112 })
      .set(label, { yPercent: 120, autoAlpha: 0 })
      .to(redLayer, { xPercent: 0, duration: 0.82 })
      .to(inkLayer, { xPercent: 0, duration: 0.86 }, "-=0.64")
      .to(label, { yPercent: 0, autoAlpha: 1, duration: 0.48, ease: "power3.out" }, "-=0.34")
      .add(() => {
        window.scrollTo(0, 0);
        navigate(target);
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, "+=0.06")
      .to(label, { yPercent: -120, autoAlpha: 0, duration: 0.38, ease: "power3.in" }, "+=0.12")
      .to(inkLayer, { xPercent: 112, duration: 0.82 }, "-=0.04")
      .to(redLayer, { xPercent: 112, duration: 0.86 }, "-=0.66");
  };

  return (
    <PageTransitionContext.Provider value={{ transitionTo }}>
      {children}
      <div ref={rootRef} aria-hidden="true" className="invisible pointer-events-none fixed inset-0 z-[500] overflow-hidden">
        <SwipeLayer ref={redLayerRef} color="red" />
        <SwipeLayer ref={inkLayerRef} color="ink">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <span ref={labelRef} className="font-display text-[18vw] uppercase leading-none tracking-[0.02em] text-bone md:text-[9vw]" />
          </div>
          <p className="absolute bottom-7 left-6 font-mono2 text-[8px] uppercase tracking-[0.3em] text-bone/35 md:bottom-9 md:left-10 md:text-[10px]">GRPP / Media Kit 2026</p>
        </SwipeLayer>
      </div>
    </PageTransitionContext.Provider>
  );
}

interface SwipeLayerProps {
  children?: ReactNode;
  color: "red" | "ink";
  ref: Ref<HTMLDivElement>;
}

function SwipeLayer({ children, color, ref }: SwipeLayerProps) {
  const fill = color === "red" ? "var(--red)" : "var(--ink)";

  return (
    <div ref={ref} className="absolute inset-y-0 left-0 w-[128vw] will-change-transform md:w-[118vw]">
      <div className="absolute inset-y-0 left-0 w-[100vw]" style={{ backgroundColor: fill }}>
        {children}
      </div>
      <svg className="absolute inset-y-0 left-[calc(100vw-1px)] h-full w-[28vw] md:w-[18vw]" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0 0 C130 18 130 82 0 100 Z" fill={fill} />
      </svg>
    </div>
  );
}
