import test from "node:test";
import assert from "node:assert/strict";
import { buildEmbedCode, DEFAULT_CUPRICE_BASE, getCssClasses } from "../src/tools.js";

test("buildEmbedCode returns default html pricing snippet", () => {
  const code = buildEmbedCode("share_123");

  assert.match(code, /data-cuprice-id="share_123"/);
  assert.match(code, new RegExp(`${DEFAULT_CUPRICE_BASE}/embed\\.js`));
  assert.doesNotMatch(code, /cuprice:plan-selected/);
});

test("buildEmbedCode returns nextjs billing snippet with event listener", () => {
  const code = buildEmbedCode("share_123", "nextjs", "billing", "https://example.com");

  assert.match(code, /import Script from "next\/script"/);
  assert.match(code, /data-cuprice-billing="share_123"/);
  assert.match(code, /https:\/\/example\.com\/embed\.js/);
  assert.match(code, /cuprice:plan-selected/);
});

test("getCssClasses returns known selectors", () => {
  const classes = getCssClasses();

  assert.ok(classes.length >= 10);
  assert.deepEqual(classes[0], {
    selector: ".cuprice-pricing-card",
    description: "Each plan card",
  });
  assert.ok(classes.some((entry) => entry.selector === ".cuprice-powered-by"));
});
