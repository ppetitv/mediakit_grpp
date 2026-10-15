export const FORMAT_SECTION_ROUTES = {
  display: { path: "/formatos/display", target: "area-display", label: "Display" },
  "rich-media": { path: "/formatos/rich-media", target: "catalog-rich-media", label: "Rich Media" },
  standard: { path: "/formatos/standard", target: "catalog-standard", label: "Estándar" },
  "branded-content": { path: "/formatos/branded-content", target: "area-branded-content", label: "Branded Content" },
  streaming: { path: "/formatos/streaming", target: "area-streaming", label: "Streaming" },
  stars: { path: "/formatos/stars", target: "area-stars", label: "Stars" },
} as const;

export type FormatSection = keyof typeof FORMAT_SECTION_ROUTES;

export function getFormatSection(pathname: string): FormatSection {
  const path = pathname.replace(/\/+$/, "");
  for (const key of Object.keys(FORMAT_SECTION_ROUTES) as FormatSection[]) {
    if (FORMAT_SECTION_ROUTES[key].path === path) return key;
  }
  if (path.startsWith("/formatos/standard/")) return "standard";
  return path === "/formatos" ? "display" : "rich-media";
}
