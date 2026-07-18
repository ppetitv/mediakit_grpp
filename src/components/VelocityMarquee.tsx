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
  const loopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const loop = loopRef.current;
    if (!track || !loop) return;

    let x = 0;
    let dir = reverse ? 1 : -1;
    let boost = 0;
    let cycleWidth = 0;

    const wrapX = (value: number) => {
      if (cycleWidth <= 0) return 0;
      const wrapped = value % cycleWidth;
      return wrapped > 0 ? wrapped - cycleWidth : wrapped;
    };

    const measure = () => {
      cycleWidth = loop.offsetWidth;
      x = wrapX(x);
      gsap.set(track, { x });
    };

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
      if (cycleWidth <= 0) return;
      boost *= 0.94;
      x += dir * (baseSpeed * (1 + boost) * delta) / 1000;
      x = wrapX(x);
      gsap.set(track, { x });
    };

    measure();
    gsap.ticker.add(tick);

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(loop);

    return () => {
      gsap.ticker.remove(tick);
      st.kill();
      resizeObserver.disconnect();
    };
  }, [baseSpeed, reverse]);

  const renderLoop = (duplicate = false) => (
    <div
      ref={duplicate ? undefined : loopRef}
      aria-hidden={duplicate || undefined}
      className="flex shrink-0 items-center"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex shrink-0 items-center">
          {children}
        </div>
      ))}
    </div>
  );

  return (
    <div className={`overflow-hidden ${className || ""}`}>
      <div ref={trackRef} className="marquee-track">
        {renderLoop()}
        {renderLoop(true)}
      </div>
    </div>
  );
}
