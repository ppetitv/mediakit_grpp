import { Eye, Zap, Target, Sparkles, TrendingUp, Layers, Award } from "lucide-react";

export interface FormatHighlight {
  icon: "eye" | "zap" | "target" | "sparkles" | "trending" | "layers" | "award";
  title: string;
  description: string;
}

const ICON_MAP = {
  eye: Eye,
  zap: Zap,
  target: Target,
  sparkles: Sparkles,
  trending: TrendingUp,
  layers: Layers,
  award: Award,
};

export default function FormatHighlights({ highlights }: { highlights: FormatHighlight[] }) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div className="mt-8 border-t border-white/12 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono2 text-[9px] font-semibold uppercase tracking-[0.25em] text-red">
          Ventajas estratégicas
        </p>
        <span className="font-mono2 text-[8px] uppercase tracking-[0.2em] text-white/30">
          Impacto de marca
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {highlights.map((item, idx) => {
          const IconComponent = ICON_MAP[item.icon] || Eye;
          return (
            <div
              key={idx}
              className="relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-sm"
            >
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red/10 text-red">
                    <IconComponent className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-mono2 text-[8px] tracking-[0.18em] text-white/30">
                    0{idx + 1}
                  </span>
                </div>
                <h4 className="font-sans font-semibold text-xs uppercase tracking-wider text-bone">
                  {item.title}
                </h4>
                <p className="mt-1.5 font-sans text-xs leading-relaxed text-bone/55">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
