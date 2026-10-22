import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { test } from "node:test";

const source = await fs.readFile(new URL("../src/components/formats/StarsSection.tsx", import.meta.url), "utf8");
const css = await fs.readFile(new URL("../src/index.css", import.meta.url), "utf8");

test("Stars reserves its journey in CSS instead of mutating pin spacers", () => {
  assert.doesNotMatch(source, /\bpin\s*:/);
  assert.match(source, /data-stars-runway/);
  assert.match(source, /trigger: runway/);
  assert.match(source, /end: "bottom bottom"/);
  assert.match(css, /\.stars-runway\s*\{\s*height: calc\(100svh \+ 220vw\)/);
  assert.match(css, /\.stars-stage\s*\{\s*position: sticky/);
  assert.match(source, /className="overflow-x-clip"/);
});

test("Stars keeps text readable without motion and in short viewports", () => {
  const query = "(min-width: 768px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";
  assert.ok(source.includes(query));
  assert.ok(css.includes(query));
  assert.match(css, /\.stars-horizontal-track\s*\{[^}]*flex-wrap: wrap;[^}]*white-space: normal;/s);
});
