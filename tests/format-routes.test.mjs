import assert from "node:assert/strict";
import { test } from "node:test";
import { matchRoutes } from "react-router";
import { FORMAT_SECTION_ROUTES, STREAMING_FAMILY_ROUTES, BRANDED_FAMILY_ROUTES, getFormatSection, getFormatSectionTarget } from "../src/lib/format-routes.ts";

const routes = [
  ...Object.values(FORMAT_SECTION_ROUTES).map(({ path }) => ({ path })),
  { path: "/formatos/standard/:formatSlug" },
  { path: "/formatos/:formatSlug?" },
];

for (const [section, { path }] of Object.entries(FORMAT_SECTION_ROUTES)) {
  test(`${section} resolves as a section, not as a format detail`, () => {
    assert.equal(getFormatSection(path), section);
    assert.equal(getFormatSection(`${path}/`), section);
    const matches = matchRoutes(routes, path);
    assert.ok(matches);
    assert.equal(matches.at(-1).params.formatSlug, undefined);
  });
}

test("existing individual format URLs keep their catalog and slug", () => {
  for (const [path, section, slug] of [
    ["/formatos/interstitial", "rich-media", "interstitial"],
    ["/formatos/standard/top", "standard", "top"],
    ["/formatos/standard/doble-caja", "standard", "doble-caja"],
  ]) {
    assert.equal(getFormatSection(path), section);
    assert.equal(matchRoutes(routes, path).at(-1).params.formatSlug, slug);
  }
});

test("the existing catalog entry point remains available", () => {
  assert.equal(getFormatSection("/formatos"), "display");
  assert.ok(matchRoutes(routes, "/formatos"));
});

test("streaming families have direct links to visible sections", () => {
  for (const { path, target } of Object.values(STREAMING_FAMILY_ROUTES)) {
    const url = new URL(path, "http://localhost");
    assert.equal(getFormatSection(url.pathname), "streaming");
    assert.equal(getFormatSectionTarget(url.pathname, url.hash), target);
    assert.equal(matchRoutes(routes, url.pathname).at(-1).params.formatSlug, undefined);
  }
});

test("unknown or unrelated fragments cannot override a section destination", () => {
  assert.equal(getFormatSectionTarget("/formatos/streaming", "#missing"), "area-streaming");
  assert.equal(getFormatSectionTarget("/formatos/standard", "#streaming-hibrido"), "catalog-standard");
  assert.equal(getFormatSectionTarget("/formatos/branded-content", "#missing"), "area-branded-content");
  assert.equal(getFormatSectionTarget("/formatos/streaming", "#branded-web"), "area-streaming");
});

test("branded content channels have direct links to their visible sections", () => {
  for (const { path, target } of Object.values(BRANDED_FAMILY_ROUTES)) {
    const url = new URL(path, "http://localhost");
    assert.equal(getFormatSection(url.pathname), "branded-content");
    assert.equal(getFormatSectionTarget(url.pathname, url.hash), target);
    assert.equal(matchRoutes(routes, url.pathname).at(-1).params.formatSlug, undefined);
  }
});
