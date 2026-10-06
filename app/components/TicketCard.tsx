"use client";
import { type CSSProperties } from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { type Stack } from "./StackBadge";
import { Arrow } from "./Arrow";

// Semicircle notches cut out of the top and bottom edge at the perforation line.
// Must be declared before `ticketStyle`, which reads it at module load.
const NOTCH = `radial-gradient(var(--notch) at calc(100% - var(--stub)) 0, #0000 97%, #000) top / 100% 51% no-repeat,
radial-gradient(var(--notch) at calc(100% - var(--stub)) 100%, #0000 97%, #000) bottom / 100% 51% no-repeat`;

// --stub is set by class so it can move at breakpoints; the mask reads it off the
// same element. 7rem of stub on a 300px-wide phone card is a third of the ticket.
const ticketStyle = {
    "--notch": "14px",
    WebkitMask: NOTCH,
    mask: NOTCH,
} as CSSProperties;


export interface Project {
    id: number;
    name: string;
    description: string;
    stack: Stack[];
    image: string;
    href?: string; 
}

interface CardProps {
    project: Project;
    zoom: number;
    transition: Transition;
    /** Pager dots below the ticket. Off in the carousel — it drives position by scroll. */
    showPager?: boolean;
    /** Prev/next buttons on the stub. Off in the carousel — three cards would mean three pairs. */
    showNav?: boolean;
    index?: number;
    total?: number;
    onPrev?: () => void;
    onNext?: () => void;
    onSelect?: (i: number) => void;
}

/* ───────────────────────── Ticket card ───────────────────────── */

const pad = (n: number) => String(n).padStart(2, "0");

export default function LatestProjectCard  ({ project, index = 0, total = 1, zoom, transition, onPrev, onNext, onSelect, showPager = true, showNav = true }: CardProps){
    return (
        <div>
            <div
                style={ticketStyle}
                className="relative flex h-64 overflow-hidden bg-diamond-900 [--stub:4.5rem] sm:h-88 sm:[--stub:7rem] md:h-100 [clip-path:polygon(24px_0,100%_0,100%_calc(100%-24px),calc(100%-24px)_100%,0_100%,0_24px)]"
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
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 font-mono text-label uppercase text-diamond-100 sm:p-8">
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
                <aside className="flex w-(--stub) shrink-0 flex-col items-center justify-between gap-2 px-2 py-4 text-diamond-100 sm:gap-3 sm:px-3 sm:py-6">
                    <span className="font-mono text-label uppercase text-diamond-100/80">No.</span>

                    <AnimatePresence mode="wait" initial={false}>
                        <motion.p
                            key={project.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={transition}
                            className="rotate-180 font-mono text-readout [writing-mode:vertical-rl]"
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

                    {showNav && onPrev && onNext && (
                        <div className="flex gap-1.5">
                            <StubButton label="Previous project" onClick={onPrev}>
                                <Arrow className="size-4 rotate-180" />
                            </StubButton>
                            <StubButton label="Next project" onClick={onNext}>
                                <Arrow className="size-4" />
                            </StubButton>
                        </div>
                    )}
                </aside>
            </div>

            {/* Pager */}
            {showPager && onSelect && (
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
            )}
        </div>
    );
};


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

