"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion, type Transition } from "framer-motion";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import Snap from "lenis/snap";
import LatestProjectCard, { type Project } from "../TicketCard";
import ProjectOverlay from "../ProjectOverlay";

const PROJECTS: Project[] = [
    { id: 1,  name: "Cavos Landing Page",   description: "A modern landing page for the Cavos project.",                 stack: ["nextjs", "typescript", "tailwind", "laravel"], image: "/3.svg" },
    { id: 2,  name: "Inventory Dashboard",  description: "Stock, orders, and reporting in one operator-facing panel.",   stack: ["react", "go", "postgres"],                     image: "/3.svg" },
    { id: 3,  name: "Booking Engine",       description: "Real-time availability and payments for a travel operator.",   stack: ["vue", "node", "tailwind"],                     image: "/3.svg" },
    { id: 4,  name: "Fleet Tracker",        description: "Live vehicle positions and route history on one map.",         stack: ["nextjs", "typescript", "postgres"],            image: "/3.svg" },
    { id: 5,  name: "Invoice Portal",       description: "Recurring billing, reminders, and PDF export for SMEs.",       stack: ["laravel", "php", "tailwind"],                  image: "/3.svg" }
];

const pad = (n: number) => String(n).padStart(2, "0");

/** Scroll travel per project, in vh. Raise it if one flick skips several cards. */
const TRAVEL_VH = 60;

/** How fast the stack catches up to the scroll position, per second. Frame-rate
    independent: higher = snappier, lower = floatier. */
const DAMP = 14;

/** Snap: how fast it pulls onto a card, and how long it waits after input stops. */
const SNAP_LERP = 0.12;
const SNAP_DEBOUNCE = 120; // ms

/* Gaps are specified in on-screen pixels, not fractions of the card: receding cards
   shrink under perspective, so a fixed fraction would close the gap as you go out.
   render() converts these to plane-space offsets each frame. */
const GAP_X = 96;   // px of background between two neighbouring cards
const STEP_Y = 150; // px each card sits above the one before it
const DEPTH = 0.2;  // z pushed back per step, in card widths — pure depth cue
const TILT_X = 24;
const TILT_Y = -28;
const PERSPECTIVE = 1800; // px; the stage sets this inline so the maths can read it
const CULL = 2.6; // hide cards further than this many steps from centre

export default function LatestProjectSection() {
    const [index, setIndex] = useState(0);
    const reduceMotion = useReducedMotion();

    const blockRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<HTMLDivElement | null>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const lenis = useLenis();

    const total = PROJECTS.length;
    const project = PROJECTS[index];
    const transition: Transition = { duration: 0.35, ease: "easeOut" };
    const zoom = reduceMotion ? 1 : 1.06;

    const scrollToIndex = (i: number) => {
        const block = blockRef.current;
        const stage = stageRef.current;
        if (!block || !stage) return;
        const travel = block.offsetHeight - stage.offsetHeight;
        const top =
            block.getBoundingClientRect().top +
            window.scrollY +
            (i / Math.max(1, total - 1)) * travel;
        // Lenis owns window scroll; a native scrollTo would fight it.
        if (lenis) lenis.scrollTo(top);
        else window.scrollTo({ top, behavior: "smooth" });
    };

    useEffect(() => {
        const block = blockRef.current;
        const stage = stageRef.current;
        if (!block || !stage) return;

        const stack = { at: 0 }; // damped toward the raw scroll position every frame
        let active = -1;
        let running = false;

        /** Scroll distance over which the stage stays pinned. */
        const travel = () => block.offsetHeight - stage.offsetHeight;
        const step = () => travel() / Math.max(1, total - 1);
        /** Document-space top of the block; offsetTop would be relative to the nearest
            positioned ancestor, which isn't the document here. */
        const docTop = () => block.getBoundingClientRect().top + window.scrollY;
        // The disc demo's scrollY/max, scoped to one block: how far the block's top has
        // risen past the viewport top, over the distance it stays pinned.
        const progress = () => {
            const t = travel();
            if (t <= 0) return 0;
            const p = -block.getBoundingClientRect().top / t;
            return Math.min(1, Math.max(0, p)) * (total - 1);
        };
        const slot = () => Math.min(total - 1, Math.max(0, Math.round(stack.at)));

        // Snap now hangs off the page's Lenis, so "mandatory" would drag the whole
        // document onto these stops. Proximity at just over half a step behaves as
        // mandatory inside the block and lets go at both ends, which is what releases
        // you into the next section instead of pinning you to card 20.
        const snap = lenis && !reduceMotion
            ? new Snap(lenis, {
                  type: "proximity",
                  distanceThreshold: `${TRAVEL_VH * 0.55}%` as `${number}%`,
                  lerp: SNAP_LERP,
                  debounce: SNAP_DEBOUNCE,
              })
            : null;
        let clearSnaps: (() => void)[] = [];
        const buildSnaps = () => {
            clearSnaps.forEach((remove) => remove());
            clearSnaps = [];
            // Off screen, the stops come out entirely — the rest of the page scrolls free.
            if (!snap || !running || travel() <= 0) return;
            const top = docTop();
            clearSnaps = PROJECTS.map((_, i) => snap.add(top + i * step()));
        };

        // ponytail: reduced motion has no Lenis snap, so snap on the browser's own
        // scrollend instead — and only while the block owns the viewport.
        const onScrollEnd = () => {
            if (!running || travel() <= 0) return;
            const top = docTop();
            const i = Math.round((window.scrollY - top) / step());
            if (i < 0 || i > total - 1) return; // past either end: leave the page alone
            window.scrollTo({ top: top + i * step() });
        };
        if (!snap) window.addEventListener("scrollend", onScrollEnd);

        // Block height changes, and anything above it changing height, both move the stops.
        const resizeObserver = new ResizeObserver(buildSnaps);
        resizeObserver.observe(block);
        resizeObserver.observe(document.body);

        const render = (dt: number) => {
            const first = cardRefs.current[0];
            if (!first) return;
            const w = first.offsetWidth;
            const h = first.offsetHeight;
            // Zero before first layout — skip rather than divide by it.
            if (!w || !h) return;

            // Exponential damping: same feel at 60Hz and 144Hz. Lenis already smooths
            // the scroll itself, so this is only a light follow on top.
            const t = reduceMotion ? 1 : 1 - Math.exp(-(dt / 1000) * DAMP);
            stack.at += (progress() - stack.at) * t;
            const current = stack.at;

            // rotateY turns the card away from the camera, so it covers less width on
            // screen than it measures. Its left and right edges stay vertical, so this
            // is the number the gap has to clear.
            const flat = w * Math.cos((TILT_Y * Math.PI) / 180);
            const k = w * DEPTH; // z added per step

            for (let i = 0; i < total; i++) {
                const el = cardRefs.current[i];
                if (!el) continue;
                const d = i - current;
                const a = Math.abs(d);
                const dir = Math.sign(d);
                // Where the card should land on screen. The log term is the running sum of
                // the shrinking projected widths — integrating it keeps every gap at GAP_X
                // instead of letting the far ones drift open.
                const screenX = k > 0
                    ? GAP_X * a + ((flat * PERSPECTIVE) / k) * Math.log(1 + (k * a) / PERSPECTIVE)
                    : (GAP_X + flat) * a;
                const z = -k * a;
                // Perspective divides by this on the way out, so multiply by it going in.
                const undo = (PERSPECTIVE + k * a) / PERSPECTIVE;
                const x = dir * screenX * undo;
                const y = -dir * STEP_Y * a * undo;
                // Centre here rather than with Tailwind translate utilities — an inline
                // `transform` and the `translate` property compose in a version-dependent order.
                el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateX(${TILT_X}deg) rotateY(${TILT_Y}deg)`;
                el.style.visibility = a > CULL ? "hidden" : "visible";
                el.style.zIndex = String(total - Math.round(a));
            }

            const next = slot();
            if (next !== active) {
                active = next;
                setIndex(next);
            }
        };

        // ReactLenis runs its own rAF, so this loop only drives the damping.
        const tick = (_time: number, deltaTime: number) => {
            if (!running) return;
            // Clamp so a background-tab return doesn't teleport the stack.
            render(Math.min(deltaTime, 50));
        };

        // Off screen the ticker would burn frames on a stack nobody can see, and the
        // snap stops would be the only thing on the page still grabbing the scroll.
        const observer = new IntersectionObserver(
            ([entry]) => {
                running = entry.isIntersecting;
                buildSnaps(); // adds the stops on entry, strips them on exit
                if (!running) return;
                // Entering from below means we arrive at the last card, not the first.
                stack.at = progress();
                active = -1; // force one setIndex so the overlay matches the stack
            },
            { threshold: 0 }
        );
        observer.observe(block);

        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(tick);
            observer.disconnect();
            resizeObserver.disconnect();
            window.removeEventListener("scrollend", onScrollEnd);
            clearSnaps.forEach((remove) => remove());
            snap?.destroy();
        };
    }, [lenis, reduceMotion, total]);

    return (
        // The block is one viewport plus the travel it takes to deal all the cards; the
        // stage pins to the top for the whole of it. --stage comes from the page wrapper.
        <div
            ref={blockRef}
            className="relative"
            style={{ height: `calc(var(--stage) + ${(total - 1) * TRAVEL_VH}vh)` }}
        >
            <div
                ref={stageRef}
                style={{ perspective: `${PERSPECTIVE}px` }}
                className="sticky top-0 h-(--stage) overflow-hidden perspective-origin-[50%_50%]"
            >
                {/* Ticket stack */}
                <div className="absolute inset-0 transform-3d">
                    {PROJECTS.map((item, i) => (
                        <div
                            key={item.id}
                            ref={(el) => { cardRefs.current[i] = el; }}
                            aria-hidden
                            className="pointer-events-none invisible absolute left-1/2 top-1/2 w-[min(78vw,52rem)] will-change-transform"
                        >
                            <LatestProjectCard
                                project={item}
                                zoom={zoom}
                                transition={transition}
                                showPager={false}
                                showNav={false}
                            />
                        </div>
                    ))}
                </div>

                <ProjectOverlay
                    project={project}
                    index={index}
                    total={total}
                    transition={transition}
                    reduceMotion={reduceMotion}
                    onJump={scrollToIndex}
                />

                {/* Keyboard/screen-reader route into the carousel — scrolling is the mouse route. */}
                <div className="sr-only">
                    {PROJECTS.map((item, i) => (
                        <button key={item.id} type="button" onClick={() => scrollToIndex(i)}>
                            Jump to project {pad(i + 1)}: {item.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}