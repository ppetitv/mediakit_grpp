import { useEffect, useRef } from "react";
import { gsap } from "@/lib/anim";
import { createSettlingLoop } from "@/lib/frame-tasks";

/** Custom cursor: red dot + lagging ring. Reacts to [data-cursor] targets. */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const media = gsap.matchMedia();
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;
    media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      document.body.classList.add("custom-cursor");
      ring.classList.remove("is-hover", "is-label");
      label.textContent = "";
      const pos = { x: 0, y: 0 };
      const ringPos = { ...pos };
      let initialized = false;
      let mode = "default";
      const dotX = gsap.quickSetter(dot, "x", "px");
      const dotY = gsap.quickSetter(dot, "y", "px");
      const ringX = gsap.quickSetter(ring, "x", "px");
      const ringY = gsap.quickSetter(ring, "y", "px");
      const loop = createSettlingLoop(gsap.ticker, (delta) => {
        const amount = 1 - Math.pow(0.84, Math.min(delta / (1000 / 60), 3));
        ringPos.x += (pos.x - ringPos.x) * amount;
        ringPos.y += (pos.y - ringPos.y) * amount;
        const moving = Math.abs(pos.x - ringPos.x) + Math.abs(pos.y - ringPos.y) > 0.1;
        if (!moving) { ringPos.x = pos.x; ringPos.y = pos.y; }
        dotX(pos.x); dotY(pos.y);
        ringX(ringPos.x); ringY(ringPos.y);
        return moving;
      }, active => { ring.dataset.cursorActive = String(active); });

      const onMove = (e: PointerEvent) => {
        if (e.pointerType === "touch" || document.visibilityState !== "visible") return;
        pos.x = e.clientX;
        pos.y = e.clientY;
        if (!initialized) {
          ringPos.x = pos.x; ringPos.y = pos.y;
          initialized = true;
        }
        dot.style.visibility = ring.style.visibility = "visible";
        loop.start();
      };
      const hide = () => {
        loop.stop();
        dot.style.visibility = ring.style.visibility = "hidden";
        initialized = false;
      };
      const onOver = (e: PointerEvent) => {
        const target = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-cursor]") : null;
        const nextMode = target?.dataset.cursor || (target ? "hover" : "default");
        if (mode === nextMode) return;
        mode = nextMode;
        const isLabel = mode !== "default" && mode !== "hover";
        ring.classList.toggle("is-hover", mode === "hover");
        ring.classList.toggle("is-label", isLabel);
        label.textContent = isLabel ? mode : "";
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerover", onOver, { passive: true });
      document.addEventListener("mouseleave", hide);
      document.addEventListener("visibilitychange", hide);
      return () => {
        document.body.classList.remove("custom-cursor");
        hide();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
        document.removeEventListener("mouseleave", hide);
        document.removeEventListener("visibilitychange", hide);
      };
    });
    return () => media.revert();
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ visibility: "hidden" }} />
      <div ref={ringRef} data-cursor-active="false" className="cursor-ring" style={{ visibility: "hidden" }}>
        <span ref={labelRef} className="cursor-label" />
      </div>
    </>
  );
}
