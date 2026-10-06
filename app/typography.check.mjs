// ponytail: run with `node app/typography.check.mjs`.
// Holds the three typography invariants a reviewer can't eyeball: the 12px floor,
// clamp monotonicity, and contrast against the real palette hexes. Everything else
// about the type system is one hand review away — this only guards the regressions.
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath, not .pathname — the repo path contains a space, which arrives %20-encoded.
const APP = fileURLToPath(new URL(".", import.meta.url));
const CSS = readFileSync(join(APP, "globals.css"), "utf8");

const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith(".tsx") ? [join(dir, e.name)] : []
    );
const FILES = walk(APP).map((p) => [p, readFileSync(p, "utf8")]);

/* ── 1. The 12px floor ─────────────────────────────────────────────────────────
   The one a reviewer misses: a stray 10px arbitrary size looks fine in a diff.
   Scans raw source, comments included — so don't write such a class in prose. */
const FLOOR_PX = 12;
for (const [path, src] of FILES) {
    for (const [, px] of src.matchAll(/text-\[(\d+(?:\.\d+)?)px\]/g)) {
        assert.ok(+px >= FLOOR_PX, `${path}: text-[${px}px] is under the ${FLOOR_PX}px floor`);
    }
    // A clamp's lower bound is what a phone actually gets, so it's the one that counts.
    for (const [, rem] of src.matchAll(/text-\[clamp\(\s*(\d+(?:\.\d+)?)rem/g)) {
        assert.ok(+rem * 16 >= FLOOR_PX, `${path}: clamp floor ${rem}rem is under ${FLOOR_PX}px`);
    }
}

/* ── 2. Clamp monotonicity ─────────────────────────────────────────────────────
   A clamp that shrinks as the viewport grows is the BannerSection bug. Check the
   token/base clamps in globals.css across the widths we actually care about. */
const WIDTHS = [320, 360, 375, 414, 640, 767, 768, 769, 1023, 1024, 1280, 1536, 1920];
// clamp(<rem>, <rem> + <vw>vw, <rem>)
const CLAMP = /clamp\(\s*([\d.]+)rem\s*,\s*([\d.]+)rem\s*\+\s*([\d.]+)vw\s*,\s*([\d.]+)rem\s*\)/g;
const clamps = [...CSS.matchAll(CLAMP)];
assert.ok(clamps.length >= 3, `expected the lead/readout/h1/h2 clamps, found ${clamps.length}`);
for (const [raw, lo, base, vw, hi] of clamps) {
    const at = (w) => Math.min(Math.max(+lo * 16, +base * 16 + (+vw / 100) * w), +hi * 16);
    for (let i = 1; i < WIDTHS.length; i++) {
        assert.ok(
            at(WIDTHS[i]) >= at(WIDTHS[i - 1]) - 1e-9,
            `${raw} shrinks from ${WIDTHS[i - 1]}px to ${WIDTHS[i]}px`
        );
    }
    assert.ok(at(WIDTHS[0]) * 1 >= FLOOR_PX, `${raw} floor is under ${FLOOR_PX}px`);
}

/* ── 3. No clamp fighting a breakpoint override ────────────────────────────────
   This IS the BannerSection bug as a rule: a fluid size plus a stepped one at a
   breakpoint means the stepped value wins there, whatever the curve says. */
for (const [path, src] of FILES) {
    for (const [, cls] of src.matchAll(/className=[{`"']([^`"'}]*text-\[clamp\([^`"'}]*)/g)) {
        const bp = cls.match(/\b(sm|md|lg|xl|2xl):text-(?!\[0?\.\d+em\])/);
        assert.ok(!bp, `${path}: a clamp sized element also has ${bp?.[0]}… — the breakpoint wins`);
    }
}

/* ── 4. Contrast against the real hexes ───────────────────────────────────────
   "Is diamond-100/80 over diamond-900 still 4.5:1 after I nudged a hex" is not a
   question anyone answers by looking. Parsed from globals.css so editing the
   palette fails here rather than silently shipping. */
const PALETTE = Object.fromEntries(
    [...CSS.matchAll(/--color-(diamond-[\w-]+):\s*(#[0-9A-Fa-f]{6})/g)].map(([, k, v]) => [k, v])
);
// Badge's worst-case backdrop comes from stock Tailwind, not @theme, so it's literal.
PALETTE["cyan-300"] = "#67e8f9";
assert.ok(PALETTE["diamond-900"], "palette did not parse out of globals.css");

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const lum = ([r, g, b]) => {
    const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const over = (fg, bg, a) => rgb(fg).map((c, i) => a * c + (1 - a) * rgb(bg)[i]);
const ratio = (a, b) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
};

// [foreground, alpha, background, minimum] — one row per real call site.
const PAIRS = [
    ["diamond-100", 0.8, "diamond-900", 4.5], // TicketCard meta + stub
    ["diamond-100", 0.8, "diamond-800", 4.5], // ContactSection url label
    ["diamond-100", 0.7, "diamond-900", 3.0], // ProjectOverlay fraction (large text)
    ["diamond-900", 0.8, "diamond-50", 4.5],  // ProjectOverlay scroll hint
    ["diamond-900", 0.7, "diamond-50", 3.0],  // ServiceSection fraction (large text)
    ["diamond-50", 0.8, "diamond-700", 4.5],  // NavTag fraction
    ["diamond-600", 1.0, "diamond-50", 4.5],  // AboutSection highlight
    ["diamond-900", 1.0, "diamond-50", 4.5],  // body ink
    ["diamond-900", 1.0, "cyan-300", 4.5],    // Badge chip on its palest variant
];
for (const [fg, alpha, bg, min] of PAIRS) {
    const r = ratio(over(PALETTE[fg], PALETTE[bg], alpha), rgb(PALETTE[bg]));
    assert.ok(r >= min, `${fg}/${alpha * 100} on ${bg}: ${r.toFixed(2)}:1, needs ${min}:1`);
}

console.log(
    `typography: ${FILES.length} files, ${FLOOR_PX}px floor held, ` +
        `${clamps.length} clamps monotonic, ${PAIRS.length} contrast pairs pass`
);
