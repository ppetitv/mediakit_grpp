import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/anim";

interface Props {
  children: ReactNode;
  className?: string;
  baseSpeed?: number; // px per second
  reverse?: boolean;
}

/** Infinite marquee whose speed & direction react to scroll velocity */
export default function VelocityMarquee({ children, className, baseSpeed = 90, reverse = false }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current!;
    let x = 0;
    let dir = reverse ? 1 : -1;
    let boost = 0;

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        boost = Math.min(Math.abs(self.getVelocity()) / 300, 8);
        if (self.direction === 1) dir = reverse ? 1 : -1;
        else dir = reverse ? -1 : 1;
      },
    });

    const tick = (_: number, delta: number) => {
      const half = track.scrollWidth / 2;
      if (half <= 0) return;
      boost *= 0.94;
      x += dir * (baseSpeed * (1 + boost) * delta) / 1000;
      if (x <= -half) x += half;
      if (x >= 0) x -= half;
      gsap.set(track, { x });
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, [baseSpeed, reverse]);

  return (
    <div className={`overflow-hidden ${className || ""}`}>
      <div ref={trackRef} className="marquee-track">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
