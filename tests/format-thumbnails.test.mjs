import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { test } from "node:test";
import { getFormatThumbnail, getFormatThumbnailSources } from "../src/lib/format-thumbnails.ts";

const source = await readFile(new URL("../src/components/formats/FormatExplorer.tsx", import.meta.url), "utf8");
const manifest = JSON.parse(await readFile(new URL("../public/images/formats/thumbnails/manifest.json", import.meta.url), "utf8"));
const catalogSlugs = (name) => [...source.match(new RegExp(`const ${name}: FormatItem\\[\\] = \\[([\\s\\S]*?)\\n\\];`))[1].matchAll(/slug: "([^"]+)"/g)].map((match) => match[1]);

test("every catalog format has its own high-resolution thumbnail", () => {
  const catalogs = { "rich-media": catalogSlugs("RICH_MEDIA_FORMATS"), standard: catalogSlugs("STANDARD_FORMATS") };
  assert.equal(catalogs["rich-media"].length, 15);
  assert.equal(catalogs.standard.length, 6);
  assert.equal(manifest.length, 21);
  for (const [catalog, slugs] of Object.entries(catalogs)) {
    for (const slug of slugs) {
      const entry = manifest.find((asset) => asset.catalog === catalog && asset.slug === slug);
      assert.ok(entry, `${catalog}/${slug} is missing`);
      assert.equal(entry.width, 1448);
      assert.equal(entry.height, 1086);
    }
  }
});

test("all 42 responsive assets are valid WebP files", async () => {
  for (const { catalog, slug, fullBytes, smallBytes } of manifest) {
    const src = getFormatThumbnail(catalog, slug);
    const sources = getFormatThumbnailSources(src);
    assert.match(sources, /-720\.webp 720w, .*\.webp 1448w$/);
    for (const [path, expectedSize] of [[src, fullBytes], [src.replace(".webp", "-720.webp"), smallBytes]]) {
      const buffer = await readFile(new URL(`../public${path}`, import.meta.url));
      assert.equal(buffer.toString("ascii", 0, 4), "RIFF");
      assert.equal(buffer.toString("ascii", 8, 12), "WEBP");
      assert.equal(buffer.length, expectedSize);
    }
  }
});

test("original PNGs and the five existing video sources remain available", async () => {
  for (const slug of catalogSlugs("STANDARD_FORMATS")) {
    assert.ok((await stat(new URL(`../public/images/formats/standard/${slug}.png`, import.meta.url))).size > 0);
  }
  const videos = [...source.matchAll(/src: "(\/images\/formats\/estandar\/[^\"]+)"/g)];
  assert.equal(videos.length, 5);
  for (const [, path] of videos) {
    assert.ok((await stat(new URL(`../public${path}`, import.meta.url))).size > 0);
  }
});
