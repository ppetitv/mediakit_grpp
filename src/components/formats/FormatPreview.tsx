import { getFormatThumbnailSources } from "@/lib/format-thumbnails";

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
  imageSrc: string;
  priority?: boolean;
  sizes?: string;
}

export default function FormatPreview({
  visual,
  title,
  imageSrc,
  priority = false,
  sizes = "(max-width: 767px) calc(100vw - 40px), (max-width: 1599px) calc((100vw - 330px) * 0.75), 952px",
}: FormatPreviewProps) {
  return (
    <div data-format-preview={visual} className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] bg-[#f5f5f5] md:rounded-[2rem]">
      <img
        src={imageSrc}
        srcSet={getFormatThumbnailSources(imageSrc)}
        sizes={sizes}
        width={1448}
        height={1086}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        alt={`Vista conceptual del formato ${title}`}
        className="block h-full w-full object-contain"
      />
    </div>
  );
}
