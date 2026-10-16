import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve, join } from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const sourceFile = process.argv[2];
if (!sourceFile) throw new Error("Provide a JSON array of { catalog, slug, path } source images.");
const sources = JSON.parse(await readFile(sourceFile, "utf8"));
const outputRoot = resolve("public/images/formats/thumbnails");
const manifest = [];

for (const { catalog, slug, path } of sources) {
  if (!["standard", "rich-media"].includes(catalog) || !/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(`Invalid thumbnail identifier: ${catalog}/${slug}`);
  }
  const directory = join(outputRoot, catalog);
  await mkdir(directory, { recursive: true });
  const { width, height } = await sharp(path).metadata();
  if (width < 1400 || Math.abs(width / height - 4 / 3) > 0.01) {
    throw new Error(`Expected a high-resolution 4:3 image: ${path}`);
  }
  const full = await sharp(path).webp({ quality: 92, effort: 6 }).toFile(join(directory, `${slug}.webp`));
  const small = await sharp(path).resize({ width: 720 }).webp({ quality: 90, effort: 6 }).toFile(join(directory, `${slug}-720.webp`));
  manifest.push({ catalog, slug, width, height, fullBytes: full.size, smallBytes: small.size });
}

await writeFile(join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ thumbnails: manifest.length, files: manifest.length * 2, fullBytes: manifest.reduce((sum, asset) => sum + asset.fullBytes, 0), smallBytes: manifest.reduce((sum, asset) => sum + asset.smallBytes, 0) }, null, 2));
