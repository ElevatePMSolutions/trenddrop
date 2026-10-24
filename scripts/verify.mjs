#!/usr/bin/env node
// Zero-dependency verifier for index.html. Exit 1 on any failure.
// Static checks always run. Browser render runs only if Playwright is installed.
import { readFileSync, mkdirSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

// createRequire honors NODE_PATH, so a globally installed Playwright is found; ESM import() is not.
const require = createRequire(import.meta.url);

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const file = resolve(root, "index.html");
const html = readFileSync(file, "utf8");
const failures = [];
const ok = (cond, msg) => { if (!cond) failures.push(msg); };

const BEEHIIV_FORM = "65db508b-8c20-47c1-beef-c47bc5ee5386";
const FALLBACK = "https://trenddropweekly.beehiiv.com/subscribe";
const MAX_BYTES = 10 * 1024;

// --- static checks -----------------------------------------------------------
ok(/^<!doctype html>/i.test(html.trim()), "missing <!doctype html> at top");
ok(/<html[^>]*\blang="en"/i.test(html), "<html> missing lang=\"en\"");
ok(/<meta charset="utf-8">/i.test(html), "missing <meta charset=\"utf-8\">");
ok(/<meta name="viewport"/i.test(html), "missing viewport meta");
ok(/<title>[^<]{10,}<\/title>/i.test(html), "missing or too-short <title>");
ok(html.includes(`data-beehiiv-form="${BEEHIIV_FORM}"`), `beehiiv form id ${BEEHIIV_FORM} missing or changed`);
ok(html.includes(FALLBACK), `fallback subscribe link ${FALLBACK} missing`);
ok(!/\bhttp:\/\//.test(html), "insecure http:// reference found");
ok(statSync(file).size <= MAX_BYTES, `index.html is ${statSync(file).size} bytes, limit ${MAX_BYTES}`);

// Balanced tags for the elements we actually use (void elements excluded).
const VOID = new Set(["meta", "link", "br", "hr", "img", "input", "source"]);
const counts = {};
for (const m of html.matchAll(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi)) {
  const tag = m[1].toLowerCase();
  if (VOID.has(tag)) continue;
  const closing = m[0].startsWith("</");
  counts[tag] = (counts[tag] || 0) + (closing ? -1 : 1);
}
for (const [tag, n] of Object.entries(counts)) ok(n === 0, `unbalanced <${tag}> (net ${n})`);

// External scripts limited to beehiiv.
for (const m of html.matchAll(/<script[^>]*\bsrc="([^"]+)"/gi)) {
  ok(m[1].startsWith("https://subscribe-forms.beehiiv.com/"), `unexpected external script: ${m[1]}`);
}

// --- browser render (optional) ----------------------------------------------
let rendered = "skipped (playwright not installed)";
let pw = null;
try { pw = require("playwright"); } catch { /* not installed locally; fine */ }
if (pw) {
  const outDir = resolve(root, ".verify");
  mkdirSync(outDir, { recursive: true });
  const browser = await pw.chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } }); // phone first
  const consoleErrors = [];
  const blocked = new Set();
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    // Loads we aborted on purpose (see route below) are not page bugs.
    if (/Failed to load resource/.test(msg.text()) && blocked.has(msg.location()?.url)) return;
    consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(String(err)));
  // Block third-party network so the check is deterministic and offline-safe.
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (url.startsWith("file://")) return route.continue();
    blocked.add(url);
    return route.abort();
  });
  await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
  const h1 = await page.locator("h1").count();
  ok(h1 === 1, `expected exactly one <h1>, found ${h1}`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  ok(!overflow, "horizontal overflow at 390px width");
  ok(consoleErrors.length === 0, `console errors: ${consoleErrors.join(" | ")}`);
  await page.screenshot({ path: resolve(outDir, "index-mobile.png"), fullPage: true });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.screenshot({ path: resolve(outDir, "index.png"), fullPage: true });
  await browser.close();
  rendered = "ok, screenshots in .verify/";
}

// --- report ------------------------------------------------------------------
console.log(`verify: static checks ${failures.length ? "FAILED" : "passed"}; render ${rendered}`);
for (const f of failures) console.log(`  ✗ ${f}`);
process.exit(failures.length ? 1 : 0);
