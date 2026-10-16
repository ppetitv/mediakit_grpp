export function getFormatThumbnail(catalog: "rich-media" | "standard", slug: string): string {
  return `/images/formats/thumbnails/${catalog}/${slug}.webp`;
}

export function getFormatThumbnailSources(src: string): string {
  return `${src.replace(/\.webp$/, "-720.webp")} 720w, ${src} 1448w`;
}
