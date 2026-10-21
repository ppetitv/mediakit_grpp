import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { test } from "node:test";
import { createModuleLoader } from "../src/lib/async-module.ts";

const root = new URL("../", import.meta.url);
const read = (file) => fs.readFile(new URL(file, root), "utf8");

test("route imports stay idle until intent and share a single request", async () => {
  let calls = 0;
  const module = { default: "formats" };
  const load = createModuleLoader(async () => { calls++; return module; });
  assert.equal(calls, 0);
  const first = load();
  assert.equal(first, load());
  assert.equal(await first, module);
  assert.equal(await load(), module);
  assert.equal(calls, 1);
});

test("a failed optional prefetch can retry on navigation", async () => {
  let calls = 0;
  const load = createModuleLoader(() => {
    if (++calls === 1) throw new Error("network unavailable");
    return Promise.resolve({ default: "formats" });
  });
  await assert.rejects(load(), /network unavailable/);
  assert.deepEqual(await load(), { default: "formats" });
  assert.equal(calls, 2);
});

test("home is eager, catalog is lazy, and entry no longer waits on a fake preloader", async () => {
  const app = await read("src/App.tsx");
  const home = await read("src/pages/Home.tsx");
  assert.match(app, /import Home from/);
  assert.match(app, /lazy\(loadFormatsPage\)/);
  assert.doesNotMatch(app, /import FormatosPage from/);
  assert.doesNotMatch(home, /Preloader|loaded|lenis\.stop/);
  assert.match(home, /<Hero\s*\/>/);
  assert.match(await read("index.html"), /rel="preload" href="\/fonts\/Graphik-Regular\.woff2" as="font"/);
  assert.match(await read("src/index.css"), /#hero \.reveal-line > span\s*\{\s*transform:\s*none;/);
  assert.match(await read("src/sections/Hero.tsx"), /gsap\.set\(words, \{ y: 0, yPercent: 100 \}\)/);
});

test("background reel has no initial source and releases playback resources on unmount", async () => {
  const reel = await read("src/components/DeferredReel.tsx");
  const markup = reel.slice(reel.indexOf("<video"));
  assert.doesNotMatch(markup, /\bsrc=/);
  assert.match(markup, /preload="none"/);
  assert.match(markup, /muted/);
  assert.match(markup, /loop/);
  assert.match(markup, /playsInline/);
  assert.match(reel, /observeMotionVisibility/);
  assert.match(reel, /video\.removeAttribute\("src"\)/);
});

function frameDurations(buffer) {
  assert.equal(buffer.toString("ascii", 8, 12), "WEBP");
  const durations = [];
  for (let offset = 12; offset + 8 <= buffer.length;) {
    const size = buffer.readUInt32LE(offset + 4);
    if (buffer.toString("ascii", offset, offset + 4) === "ANMF") {
      durations.push(buffer.readUIntLE(offset + 8 + 12, 3));
    }
    offset += 8 + size + (size % 2);
  }
  return durations;
}

test("lighter crowd keeps every original animation frame and timing, with a static fallback", async () => {
  const original = await fs.readFile(new URL("public/images/Crowdy2.webp", root));
  const optimized = await fs.readFile(new URL("public/images/hero-crowd.webp", root));
  const poster = await fs.readFile(new URL("public/images/hero-crowd-poster.webp", root));
  assert.deepEqual(frameDurations(optimized), frameDurations(original));
  assert.equal(frameDurations(original).length, 129);
  assert.equal(frameDurations(poster).length, 0);
  assert.ok(optimized.length < original.length * 0.8);
  assert.ok(poster.length < 30_000);
});
