import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/anim";

/** Custom cursor: red dot + lagging ring. Reacts to [data-cursor] targets. */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [variant, setVariant] = useState<"default" | "hover" | "label">("default");

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.body.classList.add("custom-cursor");

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      gsap.set(dot, { x: pos.x, y: pos.y });
    };

    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      gsap.set(ring, { x: ringPos.x, y: ringPos.y });
    };
    gsap.ticker.add(tick);

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      if (t) {
        const mode = t.dataset.cursor || "hover";
        if (mode === "default") {
          setVariant("default");
          setLabel("");
        } else if (mode === "hover") {
          setVariant("hover");
          setLabel("");
        } else {
          setVariant("label");
          setLabel(mode);
        }
      } else {
        setVariant("default");
        setLabel("");
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      document.body.classList.remove("custom-cursor");
      gsap.ticker.remove(tick);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className={`cursor-ring ${variant === "hover" ? "is-hover" : ""} ${variant === "label" ? "is-label" : ""}`}>
        <span className="cursor-label">{label}</span>
      </div>
    </>
  );
}
