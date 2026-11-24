import { Play } from "lucide-react";

export default function VideoDemoBadge({ descriptionId }: { descriptionId: string }) {
  return (
    <span className="pointer-events-none absolute bottom-4 right-4 grid size-12 place-items-center rounded-full border border-white/30 bg-ink/95 text-white shadow-md transition-colors group-hover:bg-red group-focus-visible:bg-red">
      <Play aria-hidden="true" className="ml-0.5 size-5 fill-current" />
      <span id={descriptionId} className="sr-only">Demo en video disponible en la ficha</span>
    </span>
  );
}
