import { useEffect, useRef, type MouseEvent } from "react";
import { gsap } from "@/lib/anim";

export type FormatVisual =
  | "interstitial"
  | "interscroller"
  | "skin"
  | "skin-arch"
  | "widget"
  | "lower-third"
  | "stories"
  | "poll"
  | "scratch"
  | "before-after"
  | "panorama"
  | "hotspot"
  | "countdown"
  | "social"
  | "video";

interface FormatPreviewProps {
  visual: FormatVisual;
  title: string;
  interactive?: boolean;
  imageSrc?: string;
}

const ArticleLines = () => (
  <div className="space-y-1.5">
    <span className="block h-1.5 w-full rounded-full bg-ink/12" />
    <span className="block h-1.5 w-4/5 rounded-full bg-ink/12" />
    <span className="block h-1.5 w-11/12 rounded-full bg-ink/12" />
    <span className="block h-1.5 w-3/5 rounded-full bg-ink/12" />
  </div>
);

function AdCreative({ visual }: { visual: FormatVisual }) {
  switch (visual) {
    case "interstitial":
      return <div className="absolute inset-[12%] rounded-md bg-red shadow-[0_14px_35px_rgba(75,8,12,0.22)]" />;
    case "interscroller":
      return <div className="absolute inset-y-0 right-0 w-[42%] bg-red"><span className="absolute inset-x-4 top-1/2 h-px bg-white/55" /></div>;
    case "skin":
      return <><div className="absolute inset-y-0 left-0 w-[12%] bg-red" /><div className="absolute inset-y-0 right-0 w-[12%] bg-red" /></>;
    case "skin-arch":
      return <><div className="absolute inset-x-0 top-0 h-[16%] bg-red" /><div className="absolute inset-y-0 left-0 w-[10%] bg-red" /><div className="absolute inset-y-0 right-0 w-[10%] bg-red" /></>;
    case "widget":
      return <div className="absolute bottom-[8%] right-[7%] h-[43%] w-[34%] rounded-md bg-red"><span className="absolute left-3 right-3 top-3 h-1 rounded-full bg-white/70" /></div>;
    case "lower-third":
      return <div className="absolute inset-x-[6%] bottom-[8%] h-[18%] rounded-sm bg-red"><span className="absolute left-3 top-1/2 h-1 w-2/5 -translate-y-1/2 rounded-full bg-white/70" /></div>;
    case "stories":
      return <><div className="absolute bottom-[8%] left-[8%] h-[54%] w-[27%] rounded-md bg-red" /><div className="absolute bottom-[8%] right-[8%] h-[67%] w-[30%] rounded-md bg-red/75" /></>;
    case "poll":
      return <div className="absolute bottom-[8%] right-[7%] w-[42%] rounded-md bg-red p-3"><span className="block h-1 w-2/3 rounded-full bg-white/80" /><span className="mt-2 block h-3 rounded-sm border border-white/50" /></div>;
    case "scratch":
      return <div className="absolute bottom-[10%] left-[8%] h-[38%] w-[35%] overflow-hidden rounded-md bg-red"><span className="absolute -inset-5 rotate-12 bg-[repeating-linear-gradient(90deg,transparent_0_7px,rgba(255,255,255,.3)_7px_9px)]" /></div>;
    case "before-after":
      return <div className="absolute bottom-[9%] right-[8%] h-[45%] w-[40%] overflow-hidden rounded-md bg-red/30"><span className="absolute inset-y-0 left-0 w-1/2 bg-red" /><span className="absolute inset-y-0 left-1/2 w-px bg-white" /></div>;
    case "panorama":
      return <div className="absolute bottom-[6%] right-[8%] h-[72%] w-[30%] rounded-md bg-red"><span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono2 text-[8px] text-white">360°</span></div>;
    case "hotspot":
      return <><div className="absolute bottom-[8%] right-[8%] h-[38%] w-[30%] rounded-md bg-red" /><span className="absolute bottom-[28%] right-[20%] h-3 w-3 rounded-full border-2 border-white bg-red shadow-[0_0_0_5px_rgba(232,20,30,.2)]" /></>;
    case "countdown":
      return <div className="absolute inset-x-[9%] top-[8%] flex h-[16%] items-center justify-center gap-1 rounded-sm bg-red font-mono2 text-[9px] tracking-[0.18em] text-white"><span>02</span><span className="opacity-55">:</span><span>18</span><span className="opacity-55">:</span><span>43</span></div>;
    case "social":
      return <><div className="absolute bottom-[8%] left-[8%] h-[50%] w-[28%] rounded-md bg-red" /><div className="absolute right-[10%] top-[12%] h-[58%] w-[28%] rounded-md border border-red bg-bone" /></>;
    case "video":
      return <div className="absolute inset-x-[6%] top-[7%] h-[25%] bg-red"><span className="absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 border-y-[5px] border-l-[8px] border-y-transparent border-l-white" /></div>;
  }
}

export default function FormatPreview({ visual, title, interactive = true, imageSrc }: FormatPreviewProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll("[data-preview-layer]"),
        { y: 14, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.06, ease: "power4.out" }
      );
    }, root);
    return () => ctx.revert();
  }, [visual]);

  const move = (event: MouseEvent<HTMLDivElement>) => {
    if (!interactive || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    gsap.to(root.querySelector("[data-browser]"), { x: x * 16, y: y * 12, rotateX: y * -3, rotateY: x * 4, duration: 0.7, ease: "power3.out" });
    gsap.to(root.querySelector("[data-orbit]"), { x: x * -28, y: y * -22, duration: 0.9, ease: "power3.out" });
  };

  const leave = () => {
    const root = rootRef.current;
    if (!root) return;
    gsap.to(root.querySelectorAll("[data-browser], [data-orbit]"), { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 1, ease: "elastic.out(1, 0.45)" });
  };

  return (
    <div ref={rootRef} onMouseMove={move} onMouseLeave={leave} className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] bg-[#dad8d2] md:rounded-[2rem]" aria-label={`Vista conceptual del formato ${title}`}>
      <div data-orbit className="absolute -right-[8%] -top-[10%] h-[45%] w-[45%] rounded-full border border-ink/10" />
      <div data-orbit className="absolute -bottom-[18%] -left-[12%] h-[55%] w-[55%] rounded-full border border-red/25" />

      <div data-browser data-preview-layer className="absolute inset-[11%_9%_10%] overflow-hidden rounded-lg bg-bone shadow-[0_30px_70px_rgba(22,22,24,.18)] [transform-style:preserve-3d]">
        <div className="flex h-[13%] items-center gap-1.5 border-b border-ink/10 px-3">
          <span className="h-1.5 w-1.5 rounded-full bg-red" />
          <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
          <span className="ml-auto h-1.5 w-1/4 rounded-full bg-ink/10" />
        </div>
        {imageSrc ? (
          <div className="absolute inset-x-[5%] bottom-[5%] top-[17%] overflow-hidden rounded-md bg-white">
            <img data-preview-layer src={imageSrc} alt={`Ejemplo del formato ${title}`} className="h-full w-full object-contain" />
          </div>
        ) : (
          <div className="absolute inset-x-[7%] bottom-[8%] top-[20%]">
            <div className="mb-[7%] h-[10%] w-2/5 rounded-sm bg-ink/85" />
            <div className="w-[58%]"><ArticleLines /></div>
            <div className="absolute bottom-0 left-0 w-[62%]"><ArticleLines /></div>
            <div className="absolute bottom-0 right-0 h-[34%] w-[28%] bg-ink/[0.08]" />
            <div data-preview-layer className="absolute inset-0"><AdCreative visual={visual} /></div>
          </div>
        )}
      </div>

      <span data-preview-layer className="absolute right-5 top-5 font-display text-4xl uppercase text-ink/15 md:right-7 md:top-7 md:text-6xl">GRPP</span>
    </div>
  );
}
