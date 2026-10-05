// ponytail: run with `node app/components/Section/stack-gap.check.mjs`.
// Keeps LatestProjectSection's gap maths honest — the projected gap between any two
// neighbouring cards must come out GAP_X no matter how far back they sit.
import assert from "node:assert/strict";

const GAP_X = 96;
const DEPTH = 0.2;
const TILT_Y = -28;
const PERSPECTIVE = 1800;
const w = 832; // card width at 52rem

const flat = w * Math.cos((TILT_Y * Math.PI) / 180);
const k = w * DEPTH;

// Same expression as render().
const planeX = (a) =>
    (GAP_X * a + ((flat * PERSPECTIVE) / k) * Math.log(1 + (k * a) / PERSPECTIVE)) *
    ((PERSPECTIVE + k * a) / PERSPECTIVE);

// What the browser draws: divide by the perspective foreshortening at that depth.
const shrink = (a) => PERSPECTIVE / (PERSPECTIVE + k * a);
const screenX = (a) => planeX(a) * shrink(a);
const halfWidth = (a) => (flat * shrink(a)) / 2;

for (let a = 0; a < 4; a++) {
    const gap = screenX(a + 1) - halfWidth(a + 1) - (screenX(a) + halfWidth(a));
    // Trapezoid integration of the shrink curve, so a pixel or two of drift is expected.
    assert.ok(Math.abs(gap - GAP_X) < 2, `step ${a}→${a + 1}: gap ${gap.toFixed(1)}px`);
}

assert.equal(planeX(0), 0, "centre card must sit at the origin");
console.log("stack gap: uniform within 2px across 4 steps");
