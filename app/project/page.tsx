"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import LatestProjectCard, { type Project } from "../components/TicketCard";
import projectData from "@/public/data/project_data.json";

const PROJECTS = projectData as Project[];

/* ── tweakables ─────────────────────────────────────────────────────────────
   Design px, scaled to the screen by `s`. CARD_W is the width we give the
   ticket; CARD_H has to match what TicketCard actually renders, see cardH(). */
const cardW = () =>
    window.innerWidth >= 768
        ? Math.min(window.innerWidth * 0.78, 832)
        : 440;
const GAP = 120;
/* Degrees, same on every card. Written as rotateX→rotateY→rotateZ, which CSS
   applies right-to-left: Z spins the card in its own plane first, then Y yaws it,
   then X lays it back. What each one buys you:
     x  lays the card back so you look down its face. This is the one that reads as
        "object on a surface" — too little and it's a flat rectangle with a skew.
     y  yaw. Keep it small: past ~10 it starts fighting z and the card reads twisted
        rather than tilted.
     z  the casual in-plane angle. Carries most of the character.
   Alternatives worth trying: { x: 52, y: 0, z: -24 } for a flatter, more top-down
   iso, or { x: 22, y: -16, z: -6 } to go back to a shelf-like three-quarter view. */
const TILT = { x: 38, y: 3, z: -20 };
/* Raised from 900: at x:38 a short perspective stretches the receding edge hard
   enough to look like a fisheye. Bigger = gentler, flatter-but-cleaner falloff. */
const PERSPECTIVE = 1300;
const SMOOTH = 0.12; // camera lerp per frame; lower = floatier
const THROW = 160;   // inertia multiplier on release
const WHEEL = 1;
const LEAN = 0.25;   // how much the tilt leans into the drag
const LEAN_MAX = 12; // degrees
/* ──────────────────────────────────────────────────────────────────────── */

/** TicketCard sizes itself with h-64 sm:h-88 md:h-100, and those are viewport
    breakpoints, not container ones — so the grid has to read the same ladder to
    know its own cell height. Change the heights there, change these. */
const cardH = () =>
    window.matchMedia("(min-width: 768px)").matches ? 400 // md:h-100
        : window.matchMedia("(min-width: 640px)").matches ? 352 // sm:h-88
            : 256; // h-64

/** Fisher-Yates. Runs on the client only — shuffling during render would give the
    server a different order than the client and blow up hydration. */
const shuffled = <T,>(a: T[]) => {
    const out = [...a];
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
};

type Slot = { a: number; b: number; x: number; y: number; h: number; c: number; r: number };

export default function Page() {
    const stageRef = useRef<HTMLDivElement>(null);
    const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
    // nx/ny drive how many cards React renders; deck maps each slot to a project.
    const [grid, setGrid] = useState<{ nx: number; ny: number; deck: number[] } | null>(null);

    // Everything the ticker reads, kept off React so a frame never triggers a render.
    const view = useRef({ W: 0, H: 0, s: 1, cellW: 1, cellH: 1, nx: 0, ny: 0, Tx: 1, Ty: 1 });
    const cam = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
    const slots = useRef<Slot[]>([]);

    // The page is a fixed, self-scrolling stage; let it own the viewport while mounted.
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, []);

    // Measure + (re)build the pool. Runs once and on resize.
    useEffect(() => {
        const measure = () => {
            const v = view.current;
            const oldW = v.cellW, oldH = v.cellH, had = v.nx > 0;

            v.W = window.innerWidth;
            v.H = window.innerHeight;
            v.s = Math.max(0.6, Math.min(v.W / 1600, 1));
            v.cellW = (cardW() + GAP) * v.s;
            v.cellH = (cardH() + GAP) * v.s;

            // +2 of slack so a card is always waiting just off each edge.
            v.nx = Math.ceil(v.W / v.cellW) + 2;
            v.ny = Math.ceil(v.H / v.cellH) + 2;
            v.Tx = v.nx * v.cellW;
            v.Ty = v.ny * v.cellH;

            // Keep the camera pointing at the same cell across a resize.
            if (had) {
                cam.current.x *= v.cellW / oldW;
                cam.current.tx *= v.cellW / oldW;
                cam.current.y *= v.cellH / oldH;
                cam.current.ty *= v.cellH / oldH;
            }

            const count = v.nx * v.ny;
            slots.current = Array.from({ length: count }, (_, i) => ({
                a: i % v.nx, b: Math.floor(i / v.nx), x: 0, y: 0, h: 0, c: 0, r: 0,
            }));

            // Randomised for now. The deck is longer than PROJECTS, so it repeats —
            // dealing it row-major keeps repeats off each other's shoulders.
            const bag = shuffled(PROJECTS.map((_, i) => i));
            setGrid({ nx: v.nx, ny: v.ny, deck: Array.from({ length: count }, (_, i) => bag[i % bag.length]) });
        };

        measure();
        let t: ReturnType<typeof setTimeout>;
        const ro = new ResizeObserver(() => { clearTimeout(t); t = setTimeout(measure, 60); });
        ro.observe(document.documentElement);
        return () => { clearTimeout(t); ro.disconnect(); };
    }, []);

    // Ticker + input. Rebound whenever the pool changes size.
    useEffect(() => {
        const stage = stageRef.current;
        if (!stage || !grid) return;

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const clamp = gsap.utils.clamp;
        // Held locally so the cleanup kills tweens on the same object the effect used.
        const camera = cam.current;

        let mx: number | null = null, my: number | null = null;
        let dragging = false;
        let prevX = 0, prevY = 0, dvx = 0, dvy = 0;

        /* Hit test in the card's OWN frame. An axis-aligned CARD_W x cardH box is wrong
           twice over: rotateZ turns the card in the plane, and rotateX foreshortens its
           height to cos(x) of the original. On a phone the cells sit close enough
           together that the sloppy box regularly claimed a neighbour. */
        const RAD = Math.PI / 180;
        const cz = Math.cos(TILT.z * RAD), sz = Math.sin(TILT.z * RAD);
        const fore = Math.cos(TILT.x * RAD);
        const inside = (px: number, py: number, p: Slot, s: number) => {
            const dx = px - p.x, dy = py - p.y;
            const lx = dx * cz + dy * sz;   // undo the in-plane spin
            const ly = -dx * sz + dy * cz;
            return Math.abs(lx) < (cardW() * s) / 2 && Math.abs(ly) < (cardH() * s * fore) / 2;
        };
        /** Nearest card under a point, or null. Nearest, not first-match: the boxes
            overlap, so pool order picks an arbitrary one. */
        const pick = (px: number, py: number) => {
            const v = view.current;
            let best: Slot | null = null, bestD = Infinity;
            for (const p of slots.current) {
                const d = (px - p.x) ** 2 + (py - p.y) ** 2;
                if (d < bestD && inside(px, py, p, v.s)) { best = p; bestD = d; }
            }
            return best;
        };

        const render = (_t: number, dt: number) => {
            const v = view.current, c = camera;
            // Frame-rate independent: same feel at 60Hz and 144Hz.
            const k = reduce ? 1 : 1 - Math.pow(1 - SMOOTH, dt / 16.667);
            c.x += (c.tx - c.x) * k;
            c.y += (c.ty - c.y) * k;
            dvx += ((c.x - prevX) - dvx) * 0.2; // smoothed camera speed, drives the lean
            dvy += ((c.y - prevY) - dvy) * 0.2;
            prevX = c.x; prevY = c.y;

            let hover: Slot | null = null, hoverD = Infinity;

            for (const p of slots.current) {
                // Each slot wraps on its own, which is what makes the grid endless.
                const rawX = p.a * v.cellW - c.x + v.Tx / 2, qx = Math.floor(rawX / v.Tx);
                const rawY = p.b * v.cellH - c.y + v.Ty / 2, qy = Math.floor(rawY / v.Ty);
                p.c = p.a - qx * v.nx;
                p.r = p.b - qy * v.ny;
                p.x = v.W / 2 + (rawX - qx * v.Tx - v.Tx / 2);
                p.y = v.H / 2 + (rawY - qy * v.Ty - v.Ty / 2);

                // No setItem() here, unlike the HTML: the repeat period IS the pool, so
                // mod(c, nx) is this slot's own column forever. Content never changes,
                // which is the whole reason this can hold 30 TicketCards at 60fps.

                if (!dragging && mx !== null && my !== null) {
                    const d = (mx - p.x) ** 2 + (my - p.y) ** 2;
                    if (d < hoverD && inside(mx, my, p, v.s)) { hover = p; hoverD = d; }
                }
            }

            const lean = reduce ? 0 : 1;
            const tz = TILT.z + clamp(-LEAN_MAX, LEAN_MAX, dvx * LEAN * lean);
            const tx = TILT.x + clamp(-LEAN_MAX, LEAN_MAX, -dvy * LEAN * lean);

            for (let i = 0; i < slots.current.length; i++) {
                const p = slots.current[i];
                const el = cellRefs.current[i];
                if (!el) continue;
                p.h += ((p === hover ? 1 : 0) - p.h) * 0.15; // smoothed 0..1 hover
                const f = 1 - p.h; // hovering straightens the card out
                el.style.transform =
                    `translate3d(${p.x}px,${p.y}px,0) translate(-50%,-50%) perspective(${PERSPECTIVE}px) ` +
                    `rotateX(${tx * f}deg) rotateY(${TILT.y * f}deg) rotateZ(${tz * f}deg) ` +
                    `scale(${v.s * (1 + 0.08 * p.h)})`;
                el.style.zIndex = p === hover ? "10" : "1";
            }
        };

        gsap.ticker.add(render);
        gsap.ticker.lagSmoothing(0);

        /* ── input ── */
        let snapTimer: ReturnType<typeof setTimeout>;
        const snap = () => {
            const v = view.current, c = camera;
            gsap.to(c, {
                tx: Math.round(c.tx / v.cellW) * v.cellW,
                ty: Math.round(c.ty / v.cellH) * v.cellH,
                duration: reduce ? 0 : 0.9, ease: "power3.out", overwrite: true,
            });
        };
        const nudge = () => { gsap.killTweensOf(camera); clearTimeout(snapTimer); snapTimer = setTimeout(snap, 160); };

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            camera.tx += e.deltaX * WHEEL;
            camera.ty += e.deltaY * WHEEL;
            nudge();
        };

        /* Slop before a press counts as a drag rather than a tap. A finger is never
           still: a tap wanders several px across a dozen pointermove events, where a
           mouse click emits one or none. Measured as distance from where the press
           started, NOT the summed path — summing counts jitter twice and was why a tap
           never registered on a phone. */
        const SLOP = { mouse: 6, pen: 8, touch: 16 };

        let lastX = 0, lastY = 0, lastT = 0, vx = 0, vy = 0;
        let startX = 0, startY = 0, moved = 0;
        let kind: keyof typeof SLOP = "mouse";

        const onDown = (e: PointerEvent) => {
            dragging = true; moved = 0; vx = vy = 0;
            kind = e.pointerType in SLOP ? (e.pointerType as keyof typeof SLOP) : "mouse";
            startX = lastX = e.clientX;
            startY = lastY = e.clientY;
            lastT = performance.now();
            stage.setPointerCapture(e.pointerId);
            gsap.killTweensOf(camera);
            clearTimeout(snapTimer);
        };
        const onMove = (e: PointerEvent) => {
            mx = e.clientX; my = e.clientY;
            if (!dragging) return;
            const now = performance.now(), dt = Math.max(now - lastT, 1);
            const dx = e.clientX - lastX, dy = e.clientY - lastY;
            vx = dx / dt; vy = dy / dt;
            lastX = e.clientX; lastY = e.clientY; lastT = now;
            moved = Math.hypot(e.clientX - startX, e.clientY - startY);
            camera.tx -= dx; // cards follow the pointer
            camera.ty -= dy;
        };
        const onUp = (e: PointerEvent) => {
            if (!dragging) return;
            dragging = false;
            if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);

            // A finger leaves no pointer behind, and document pointerleave never fires
            // for touch — without this the tapped card stays lifted and straightened
            // while every other card stays dimmed, forever.
            const wasTouch = kind === "touch";

            // Under the slop it was a tap, not a drag: centre that card instead of throwing.
            if (moved < SLOP[kind]) {
                const v = view.current;
                const hit = pick(e.clientX, e.clientY);
                if (wasTouch) { mx = my = null; }
                if (hit) {
                    clearTimeout(snapTimer);
                    gsap.to(camera, {
                        tx: hit.c * v.cellW, ty: hit.r * v.cellH,
                        duration: reduce ? 0 : 1.1, ease: "power3.inOut", overwrite: true,
                    });
                }
                return;
            }

            if (wasTouch) { mx = my = null; }
            camera.tx -= vx * THROW;
            camera.ty -= vy * THROW;
            nudge();
        };
        const onLeave = () => { mx = my = null; };

        const onKey = (e: KeyboardEvent) => {
            const mv = ({ ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] } as const)[
                e.key as "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown"
            ];
            if (!mv) return;
            e.preventDefault();
            const v = view.current, c = camera;
            clearTimeout(snapTimer);
            gsap.to(c, {
                tx: Math.round(c.tx / v.cellW) * v.cellW + mv[0] * v.cellW,
                ty: Math.round(c.ty / v.cellH) * v.cellH + mv[1] * v.cellH,
                duration: reduce ? 0 : 0.9, ease: "power3.out", overwrite: true,
            });
        };

        stage.addEventListener("wheel", onWheel, { passive: false });
        stage.addEventListener("pointerdown", onDown);
        window.addEventListener("pointermove", onMove);
        stage.addEventListener("pointerup", onUp);
        stage.addEventListener("pointercancel", onUp);
        document.addEventListener("pointerleave", onLeave);
        window.addEventListener("keydown", onKey);

        return () => {
            gsap.ticker.remove(render);
            clearTimeout(snapTimer);
            gsap.killTweensOf(camera);
            stage.removeEventListener("wheel", onWheel);
            stage.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointermove", onMove);
            stage.removeEventListener("pointerup", onUp);
            stage.removeEventListener("pointercancel", onUp);
            document.removeEventListener("pointerleave", onLeave);
            window.removeEventListener("keydown", onKey);
        };
    }, [grid]);

    return (
        <main className="fixed inset-0 overflow-hidden bg-diamond-black">
            {/* The grid is a decorative, repeating surface — every project appears more
                than once in it. The real list for assistive tech is below. */}
            <div
                ref={stageRef}
                aria-hidden
                className="absolute inset-0 cursor-grab touch-none select-none active:cursor-grabbing"
            >
                {grid?.deck.map((p, i) => (
                    <div
                        key={i}
                        ref={(el) => { cellRefs.current[i] = el; }}
                        style={{ width: cardW() }}
                        className="absolute left-0 top-0 origin-center will-change-transform"
                    >
                        <LatestProjectCard
                            project={PROJECTS[p]}
                            zoom={1}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            showPager={false}
                            showNav={false}
                        />
                    </div>
                ))}
            </div>

            {/* Vignette, matching the demo. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-5 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(0_0_0/0.45))]"
            />

            <p className="pointer-events-none absolute bottom-6 right-6 z-10 font-mono text-label uppercase text-diamond-100/80">
                Drag anywhere
            </p>

            <ul className="sr-only">
                {PROJECTS.map((p) => (
                    <li key={p.id}>
                        {p.href ? <a href={p.href}>{p.name}</a> : p.name}: {p.description}
                    </li>
                ))}
            </ul>
        </main>
    );
}
