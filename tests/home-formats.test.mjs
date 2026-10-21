import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const source = await fs.readFile(new URL("src/sections/Formats.tsx", root), "utf8");
const css = await fs.readFile(new URL("src/index.css", root), "utf8");

// These guard the structural fix. The actual CLS still needs a browser scroll trace.
test("home formats use native sticky, not GSAP fixed-position pinning", () => {
  assert.doesNotMatch(source, /\bpin\s*:/);
  assert.match(css, /\.formats-stage\s*\{[^}]*position:\s*sticky;/s);
  assert.match(css, /\.formats-runway\s*\{[^}]*height:\s*calc\(/s);
  assert.match(css, /var\(--format-count\) \* var\(--format-card-width\)/);
  assert.match(source, /"--format-count": FORMATS\.length/);
});

test("horizontal travel uses the content viewport and reaches the reserved section end", () => {
  assert.match(source, /Math\.max\(0, track\.scrollWidth - viewport\.clientWidth\)/);
  assert.match(source, /end:\s*"bottom bottom"/);
  assert.doesNotMatch(source, /track\.scrollWidth - window\.innerWidth/);
  assert.match(css, /var\(--format-cta-width\)/);
  assert.match(css, /2 \* var\(--format-gutter\) - 100cqw/);
});

test("motion has a reduced-motion and short-viewport fallback", () => {
  const query = "(min-width: 768px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";
  assert.ok(source.includes(query));
  assert.ok(css.includes(query));
  assert.match(css, /\.formats-track\s*\{\s*display:\s*grid;/);
  assert.match(source, /animationPlayState:\s*"paused"/);
  assert.match(source, /observer\.disconnect\(\)/);
  assert.match(source, /document\.removeEventListener\("visibilitychange", sync\)/);
});

test("every home format image points to an existing local asset", async () => {
  const sources = [...source.matchAll(/<img\s+src="([^"]+)"/g)].map(match => match[1]);
  assert.equal(sources.length, 2);
  for (const src of sources) {
    const file = new URL(path.join("public", src), root);
    assert.ok((await fs.stat(file)).size > 0, src);
  }
});
