"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion, type Transition } from "framer-motion";
import gsap from "gsap";
import Lenis from "lenis";
import Snap from "lenis/snap";
import LatestProjectCard, { type Project } from "../TicketCard";
import ProjectOverlay from "../ProjectOverlay";
// ponytail: every entry points at /3.svg — it's the only project image in public/.
// Give each its own file when you have them; nothing else needs to change.
const PROJECTS: Project[] = [
    { id: 1,  name: "Cavos Landing Page",   description: "A modern landing page for the Cavos project.",                 stack: ["nextjs", "typescript", "tailwind", "laravel"], image: "/3.svg" },
    { id: 2,  name: "Inventory Dashboard",  description: "Stock, orders, and reporting in one operator-facing panel.",   stack: ["react", "go", "postgres"],                     image: "/3.svg" },
    { id: 3,  name: "Booking Engine",       description: "Real-time availability and payments for a travel operator.",   stack: ["vue", "node", "tailwind"],                     image: "/3.svg" },
    { id: 4,  name: "Fleet Tracker",        description: "Live vehicle positions and route history on one map.",         stack: ["nextjs", "typescript", "postgres"],            image: "/3.svg" },
    { id: 5,  name: "Invoice Portal",       description: "Recurring billing, reminders, and PDF export for SMEs.",       stack: ["laravel", "php", "tailwind"],                  image: "/3.svg" },
    { id: 6,  name: "Realtime Chat",        description: "Rooms, presence, and typing indicators over websockets.",      stack: ["react", "node", "typescript"],                 image: "/3.svg" },
    { id: 7,  name: "Analytics Console",    description: "Funnels and cohort charts over an event pipeline.",            stack: ["nextjs", "python", "postgres"],                image: "/3.svg" },
    { id: 8,  name: "Menu Builder",         description: "Drag-and-drop menus that publish straight to QR pages.",       stack: ["vue", "javascript", "tailwind"],               image: "/3.svg" },
    { id: 9,  name: "Ticketing System",     description: "Support queues with SLA timers and canned replies.",           stack: ["laravel", "php", "postgres"],                  image: "/3.svg" },
    { id: 10, name: "Warehouse Scanner",    description: "Barcode picking flow built for handheld devices.",             stack: ["react", "go", "typescript"],                   image: "/3.svg" },
    { id: 11, name: "Payment Gateway",      description: "Idempotent charge handling with a full audit trail.",          stack: ["go", "postgres", "typescript"],                image: "/3.svg" },
    { id: 12, name: "CMS Starter",          description: "Typed content models with instant preview on save.",           stack: ["nextjs", "typescript", "tailwind"],            image: "/3.svg" },
    { id: 13, name: "Event Platform",       description: "Scheduling, check-in, and attendee messaging in one place.",   stack: ["vue", "node", "postgres"],                     image: "/3.svg" },
    { id: 14, name: "Learning Portal",      description: "Course progress, quizzes, and certificates for cohorts.",      stack: ["laravel", "php", "javascript"],                image: "/3.svg" },
    { id: 15, name: "API Gateway",          description: "Rate limiting, auth, and request logging at the edge.",        stack: ["go", "node", "typescript"],                    image: "/3.svg" },
    { id: 16, name: "Design System",        description: "Tokens, primitives, and docs shared across four apps.",        stack: ["react", "typescript", "tailwind"],             image: "/3.svg" },
    { id: 17, name: "Survey Tool",          description: "Branching questionnaires with live response charts.",          stack: ["nextjs", "python", "postgres"],                image: "/3.svg" },
    { id: 18, name: "Delivery Tracker",     description: "Courier assignment and customer-facing ETA updates.",          stack: ["react", "node", "go"],                         image: "/3.svg" },
    { id: 19, name: "HR Onboarding",        description: "Document collection and task checklists for new hires.",       stack: ["laravel", "postgres", "tailwind"],             image: "/3.svg" },
    { id: 20, name: "Media Library",        description: "Uploads, transcoding, and signed delivery URLs.",              stack: ["nextjs", "typescript", "node"],                image: "/3.svg" },
];

const pad = (n: number) => String(n).padStart(2, "0");

/** Scroll travel per project, in vh. Raise it if one flick skips several cards. */
const TRAVEL_VH = 60;

/** How fast the stack catches up to the scroll position, per second. Frame-rate
    independent: higher = snappier, lower = floatier. */
const DAMP = 14;

/** Lenis input feel. 1 = native wheel distance, so one notch isn't a chore. */
const WHEEL = 1;
const TOUCH = 1.2;
const SCROLL_LERP = 0.1;

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

    const scrollRef = useRef<HTMLElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<HTMLDivElement | null>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const lenisRef = useRef<Lenis | null>(null);

    const total = PROJECTS.length;
    const project = PROJECTS[index];
    const transition: Transition = { duration: 0.35, ease: "easeOut" };
    const zoom = reduceMotion ? 1 : 1.06;

    const scrollToIndex = (i: number) => {
        const wrapper = scrollRef.current;
        const content = contentRef.current;
        if (!wrapper || !content) return;
        const top = (i / Math.max(1, total - 1)) * (content.scrollHeight - wrapper.clientHeight);
        // Lenis owns scrollTop in wrapper mode; a native scrollTo would fight it.
        if (lenisRef.current) lenisRef.current.scrollTo(top);
        else wrapper.scrollTo({ top, behavior: "smooth" });
    };

    useEffect(() => {
        const wrapper = scrollRef.current;
        const content = contentRef.current;
        const stage = stageRef.current;
        if (!wrapper || !content || !stage) return;

        // Lenis defaults to the window, which would reintroduce page scrolling.
        const lenis = reduceMotion
            ? null
            : new Lenis({
                  wrapper,
                  content,
                  lerp: SCROLL_LERP,
                  autoRaf: false,
                  wheelMultiplier: WHEEL,
                  touchMultiplier: TOUCH,
              });
        lenisRef.current = lenis;

        const stack = { at: 0 }; // damped toward the raw scroll position every frame
        let active = -1;
        let running = false;

        const maxScroll = () => content.scrollHeight - wrapper.clientHeight;
        const step = () => maxScroll() / Math.max(1, total - 1);
        // Continuous, like the disc demo: scroll maps straight onto a fractional card
        // position and the stack trails it. Snap is what makes it settle on a whole one.
        const progress = () => {
            const max = maxScroll();
            return max > 0 ? (wrapper.scrollTop / max) * (total - 1) : 0;
        };
        const slot = () => Math.min(total - 1, Math.max(0, Math.round(stack.at)));

        // One stop per project so scrolling always settles on a single centred card.
        const snap = lenis
            ? new Snap(lenis, { type: "mandatory", lerp: SNAP_LERP, debounce: SNAP_DEBOUNCE })
            : null;
        let clearSnaps: (() => void)[] = [];
        const buildSnaps = () => {
            clearSnaps.forEach((remove) => remove());
            clearSnaps = [];
            // Stops are absolute pixels, so they go stale whenever the scrollport resizes.
            if (snap && maxScroll() > 0)
                clearSnaps = PROJECTS.map((_, i) => snap.add(i * step()));
        };

        // ponytail: reduced motion has no Lenis to hang the snap addon off, so snap on
        // the browser's own scrollend instead.
        const onScrollEnd = () => {
            if (maxScroll() <= 0) return;
            wrapper.scrollTo({ top: Math.round(wrapper.scrollTop / step()) * step() });
        };
        if (!lenis) wrapper.addEventListener("scrollend", onScrollEnd);

        // Fires on mount, on the display:none → block swap, and on every resize.
        const resizeObserver = new ResizeObserver(() => {
            lenis?.resize();
            buildSnaps();
        });
        resizeObserver.observe(wrapper);

        const render = (dt: number) => {
            const first = cardRefs.current[0];
            if (!first) return;
            const w = first.offsetWidth;
            const h = first.offsetHeight;
            // Zero while the section is display:none — skip rather than divide by it.
            if (!w || !h) return;

            // The scroll content is 100% + travel tall, so a percentage height on the
            // stage would resolve against all of it and sticky would never engage.
            // ponytail: written from the live clientHeight each frame — self-heals on
            // resize and on the display:none → block swap, no extra observer.
            const vh = `${wrapper.clientHeight}px`;
            if (stage.style.height !== vh) stage.style.height = vh;

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

        const tick = (time: number, deltaTime: number) => {
            if (!running) return;
            lenis?.raf(time * 1000);
            // Clamp so a background-tab return doesn't teleport the stack.
            render(Math.min(deltaTime, 50));
        };

        // Hidden sections stay mounted at display:none, so sizes are 0 and the
        // ticker would otherwise burn frames for an invisible section.
        const observer = new IntersectionObserver(
            ([entry]) => {
                running = entry.isIntersecting;
                if (!running) return;
                lenis?.resize(); // sizes were 0 while hidden; Lenis caches them
                // display:none destroys the scrollport, so scrollTop comes back 0 while
                // Lenis still holds the old offset. Adopt the DOM's value, not Lenis's.
                lenis?.scrollTo(wrapper.scrollTop, { immediate: true, force: true });
                stack.at = progress();
                active = -1; // force one setIndex so the overlay matches the stack
            },
            { threshold: 0 }
        );
        observer.observe(wrapper);

        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(tick);
            observer.disconnect();
            resizeObserver.disconnect();
            wrapper.removeEventListener("scrollend", onScrollEnd);
            snap?.destroy();
            lenis?.destroy();
            lenisRef.current = null;
        };
    }, [reduceMotion, total]);

    return (
        <section
            ref={scrollRef}
            tabIndex={0}
            aria-label="Latest projects"
            className="h-full w-full overflow-y-auto overscroll-contain"
        >
            <div
                ref={contentRef}
                className="relative"
                style={{ height: `calc(100% + ${(total - 1) * TRAVEL_VH}vh)` }}
            >
                {/* Height is set from the scrollport in the ticker — see render(). */}
                <div
                    ref={stageRef}
                    style={{ perspective: `${PERSPECTIVE}px` }}
                    className="sticky top-0 overflow-hidden perspective-origin-[50%_50%]"
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
        </section>
    );
}