import assert from "node:assert/strict";
import { test } from "node:test";
import { matchRoutes } from "react-router";
import { FORMAT_SECTION_ROUTES, getFormatSection } from "../src/lib/format-routes.ts";

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
