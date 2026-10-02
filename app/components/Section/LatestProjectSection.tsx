"use client";
import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
import StackBadge, { type Stack } from "../StackBadge";
import NavTag from "../NavTag";
import { Button } from "../Button";

interface Project {
    id: number;
    name: string;
    description: string;
    stack: Stack[];
    image: string;
    href?: string; 
}

const PROJECTS: Project[] = [
    {
        id: 1,
        name: "Cavos Landing Page",
        description: "A modern landing page for the Cavos project.",
        stack: ["nextjs", "typescript", "tailwind", "laravel"],
        image: "/3.svg",
    },
    {
        id: 2,
        name: "Inventory Dashboard",
        description: "Stock, orders, and reporting in one operator-facing panel.",
        stack: ["react", "go", "postgres"],
        image: "/3.svg",
    },
    {
        id: 3,
        name: "Booking Engine",
        description: "Real-time availability and payments for a travel operator.",
        stack: ["vue", "node", "tailwind"],
        image: "/3.svg",
    },
];

const pad = (n: number) => String(n).padStart(2, "0");

export default function LatestProjectSection() {
    const [index, setIndex] = useState(0);
    const reduceMotion = useReducedMotion();

    const project = PROJECTS[index];
    const total = PROJECTS.length;
    const go = (dir: 1 | -1) => setIndex((i) => (i + dir + total) % total);

    // Motion collapses to a plain fade for reduced-motion users.
    const slide = reduceMotion ? 0 : 40;
    const zoom = reduceMotion ? 1 : 1.06;
    const transition: Transition = { duration: 0.35, ease: "easeOut" };

    return (
        <div id="latest-project" className="flex w-full flex-col justify-center gap-4">
            <NavTag number="02" text="Latest Project" />

            <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-5" aria-live="polite">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, x: slide }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -slide }}
                            transition={transition}
                            className="flex flex-col gap-6"
                        >
                            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-diamond-600">
                                <span aria-hidden className="h-px w-8 bg-diamond-600" />
                                Project {pad(project.id)} / {pad(total)}
                            </p>

                            <h2 className="bg-linear-to-br from-diamond-400 via-diamond-600 to-diamond-900 bg-clip-text pb-1 text-4xl font-bold leading-tight text-transparent sm:text-5xl lg:text-6xl">
                                {project.name}
                            </h2>

                            <p className="border-l-2 border-diamond-600/40 pl-4 text-lg leading-relaxed text-diamond-900/70">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {project.stack.map((stack) => (
                                    <StackBadge key={stack} stack={stack} />
                                ))}
                            </div>

                           <Button href={project.href} text="View More" className="mt-4 w-fit" />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* ── Ticket card ────────────────────────────── */}
                <div className="lg:col-span-7">
                    <LatestProjectCard
                        project={project}
                        index={index}
                        total={total}
                        zoom={zoom}
                        transition={transition}
                        onPrev={() => go(-1)}
                        onNext={() => go(1)}
                        onSelect={setIndex}
                    />
                </div>
            </div>
        </div>
    );
}

/* ───────────────────────── Ticket card ───────────────────────── */

// Semicircle notches cut out of the top and bottom edge at the perforation line.
const NOTCH = `radial-gradient(var(--notch) at calc(100% - var(--stub)) 0, #0000 97%, #000) top / 100% 51% no-repeat,
radial-gradient(var(--notch) at calc(100% - var(--stub)) 100%, #0000 97%, #000) bottom / 100% 51% no-repeat`;

const ticketStyle = {
    "--stub": "7rem",
    "--notch": "14px",
    WebkitMask: NOTCH,
    mask: NOTCH,
} as CSSProperties;

interface CardProps {
    project: Project;
    index: number;
    total: number;
    zoom: number;
    transition: Transition;
    onPrev: () => void;
    onNext: () => void;
    onSelect: (i: number) => void;
}

const LatestProjectCard = ({ project, index, total, zoom, transition, onPrev, onNext, onSelect }: CardProps) => {
    return (
        <div>
            <div
                style={ticketStyle}
                className="relative flex h-88 overflow-hidden bg-diamond-900 sm:h-100 [clip-path:polygon(24px_0,100%_0,100%_calc(100%-24px),calc(100%-24px)_100%,0_100%,0_24px)]"
            >
                {/* Image side */}
                <div className="relative min-w-0 flex-1 overflow-hidden">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: zoom }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={transition}
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${project.image})` }}
                        />
                    </AnimatePresence>

                    {/* Readability gradient + scanlines */}
                    <div aria-hidden className="absolute inset-0 bg-linear-to-t from-diamond-900/90 via-transparent to-diamond-900/30" />
                    <div aria-hidden className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0_3px,rgb(0_0_0/0.12)_3px_4px)]" />

                    {/* HUD corner brackets */}
                    <span aria-hidden className="absolute left-7 top-7 size-4 border-l-2 border-t-2 border-diamond-100/70" />
                    <span aria-hidden className="absolute right-4 top-4 size-4 border-r-2 border-t-2 border-diamond-100/70" />
                    <span aria-hidden className="absolute bottom-4 left-4 size-4 border-b-2 border-l-2 border-diamond-100/70" />
                    <span aria-hidden className="absolute bottom-4 right-4 size-4 border-b-2 border-r-2 border-diamond-100/70" />

                    {/* Meta strip */}
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-8 font-mono text-[11px] uppercase tracking-[0.25em] text-diamond-100">
                        <span>PRJ-{pad(project.id)}</span>
                        <span className="flex items-center gap-2">
                            <span aria-hidden className="size-1.5 bg-diamond-400 motion-safe:animate-pulse" />
                            Preview
                        </span>
                    </div>
                </div>

                {/* Perforation line */}
                <div aria-hidden className="my-6 w-0 self-stretch border-l-2 border-dashed border-diamond-100/30" />

                {/* Stub */}
                <aside className="flex w-(--stub) shrink-0 flex-col items-center justify-between gap-3 px-3 py-6 text-diamond-100">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-diamond-100/60">No.</span>

                    <AnimatePresence mode="wait" initial={false}>
                        <motion.p
                            key={project.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={transition}
                            className="rotate-180 font-mono text-6xl font-extrabold tabular-nums [writing-mode:vertical-rl]"
                        >
                            {pad(project.id)}
                        </motion.p>
                    </AnimatePresence>

                    <span
                        aria-hidden
                        className="block h-10 w-full bg-diamond-100/80 [mask:url(/icon/hud-wave.svg)_center/contain_no-repeat]"
                    />

                    {/* Decorative barcode */}
                    <span
                        aria-hidden
                        className="block h-7 w-full bg-diamond-100/60 [mask:repeating-linear-gradient(90deg,#000_0_2px,#0000_2px_4px,#000_4px_5px,#0000_5px_8px)]"
                    />

                    <div className="flex gap-1.5">
                        <StubButton label="Previous project" onClick={onPrev}>
                            <Arrow className="size-4 rotate-180" />
                        </StubButton>
                        <StubButton label="Next project" onClick={onNext}>
                            <Arrow className="size-4" />
                        </StubButton>
                    </div>
                </aside>
            </div>

            {/* Pager */}
            <div className="mt-3 flex items-center gap-2">
                {Array.from({ length: total }, (_, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => onSelect(i)}
                        aria-label={`Show project ${pad(i + 1)}`}
                        aria-current={i === index}
                        className="group py-2"
                    >
                        <span
                            className={`block h-1 transition-all duration-300 ${
                                i === index
                                    ? "w-12 bg-diamond-700"
                                    : "w-6 bg-diamond-900/20 group-hover:bg-diamond-900/40"
                            }`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

/* ───────────────────────── Small pieces ───────────────────────── */

const StubButton = ({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) => (
    <button
        type="button"
        onClick={onClick}
        className="flex size-9 cursor-pointer items-center justify-center border border-diamond-100/30 text-diamond-100 transition-colors hover:bg-diamond-700 hover:border-diamond-700 focus-visible:bg-diamond-700"
    >
        <span className="sr-only">{label}</span>
        {children}
    </button>
);

const Arrow = ({ className }: { className?: string }) => (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="square" className={className}>
        <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
);