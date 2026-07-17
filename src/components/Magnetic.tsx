import { useRef, type ReactNode, type MouseEvent } from "react";
import { gsap } from "@/lib/anim";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

/** Magnetic hover wrapper — element is attracted toward the cursor */
export default function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(el, { x: x * strength, y: y * strength, duration: 0.6, ease: "power3.out" });
    const inner = el.firstElementChild;
    if (inner) gsap.to(inner, { x: x * strength * 0.4, y: y * strength * 0.4, duration: 0.6, ease: "power3.out" });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
    const inner = el.firstElementChild;
    if (inner) gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
  };

  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave} style={{ display: "inline-block" }}>
      {children}
    </div>
  );
}
