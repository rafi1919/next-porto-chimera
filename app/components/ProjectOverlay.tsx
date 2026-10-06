"use client";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import StackBadge from "./StackBadge";
import { Button } from "./Button";
import { Arrow } from "./Arrow";
import type { Project } from "./TicketCard";

const pad = (n: number) => String(n).padStart(2, "0");

interface ProjectOverlayProps {
    project: Project;
    index: number;
    total: number;
    transition: Transition;
    reduceMotion: boolean | null;
    onJump: (i: number) => void;
}

export default function ProjectOverlay({ project, index, total, transition, reduceMotion, onJump }: ProjectOverlayProps) {
    const slide = reduceMotion ? 0 : 24;

    return (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-6 lg:p-10">
            {/* ── Info panel: top-left is the empty quadrant of the 3D stack ──
                Capped well under the viewport on mobile so the card it floats over stays
                visible; the notched corner shrinks with it or it swallows the heading. */}
            <div
                aria-live="polite"
                className="pointer-events-auto relative w-full overflow-hidden rounded-2xl bg-diamond-900/95 p-3 text-diamond-50 backdrop-blur-md [clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,0_100%)] sm:max-w-sm sm:rounded-[2rem] sm:p-6 sm:[clip-path:polygon(0_0,calc(100%-36px)_0,100%_36px,100%_100%,0_100%)] md:max-w-md md:p-8"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: slide }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={transition}
                        className="flex flex-col gap-2.5 sm:gap-5"
                    >
                        {/* Row on mobile — number, rule, name — so the panel spends the
                            overlay's width instead of its height. The same flex turns into
                            a column at sm, which is the original stacked readout. */}
                        <div className="flex items-center gap-2.5 sm:flex-col sm:items-start sm:gap-5">
                            <div className="flex items-center gap-2.5 sm:gap-4">
                                <p className="text-readout">
                                    {pad(project.id)}
                                    <span className="text-[0.4em] text-diamond-100/70">/{pad(total)}</span>
                                </p>
                                <span aria-hidden className="h-7 w-px bg-diamond-100/40 sm:h-12" />
                                {/* The section heading already says this; on a phone it's
                                    width the project name needs more. */}
                                <p className="hidden font-mono text-label uppercase text-diamond-100/80 sm:block">
                                    Latest
                                    <br />
                                    Project
                                </p>
                            </div>
                            <h2 className="min-w-0 text-[clamp(1.125rem,4.5vw,2.75rem)]">
                                {project.name}
                            </h2>
                        </div>

                        {/* Clamped on mobile — the descriptions run three or four lines and
                            that alone was taller than the card behind the panel. */}
                        <p className="line-clamp-2 max-w-[60ch] border-l-2 border-diamond-400/40 pl-3 text-sm text-diamond-100/80 sm:line-clamp-none sm:pl-4">
                            {project.description}
                        </p>

                        {/* Badges and the button share a row on mobile — same trick as the
                            readout above, one flex that becomes a column at sm. */}
                        <div className="flex items-center gap-2 sm:flex-col sm:gap-5">
                            {/* Three max. A fourth wraps the row on a phone, and the data is
                                free to list more than the panel can show. */}
                            <div className="flex min-w-0 flex-wrap gap-1.5 sm:gap-2">
                                {project.stack.slice(0, 3).map((stack) => (
                                    <StackBadge key={stack} stack={stack} />
                                ))}
                            </div>

                            <div className="ml-auto flex shrink-0 items-center gap-3 sm:ml-0 sm:mt-1 sm:w-full sm:justify-between sm:gap-4">
                                <Button
                                    href={project.href}
                                    text="View More"
                                    className="gap-2! px-3! py-2! sm:gap-3! sm:pl-6! sm:pr-4! sm:py-3! bg-diamond-50! text-diamond-900! hover:bg-diamond-400! focus-visible:bg-diamond-400!"
                                />
                                <span
                                    aria-hidden
                                    className="hidden shrink-0 bg-diamond-400 [mask:repeating-linear-gradient(115deg,#000_0_8px,#0000_8px_16px)] sm:block sm:h-4 sm:w-20"
                                />
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Bottom row: scroll hint + clickable tick rail ── */}
            <div className="flex items-end justify-between gap-4 sm:gap-6">
                <p
                    aria-hidden
                    className={`flex items-center gap-2 font-mono text-label uppercase text-diamond-900/80 transition-opacity duration-500 sm:gap-3 ${
                        index === 0 ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <Arrow className="size-3 rotate-90 motion-safe:animate-bounce sm:size-4" />
                    Scroll
                </p>

                {/* Mouse affordance only. The sr-only buttons in the section are the keyboard route. */}
                <div aria-hidden className="pointer-events-auto flex items-center gap-1.5">
                    {Array.from({ length: total }, (_, i) => (
                        <button
                            key={i}
                            type="button"
                            tabIndex={-1}
                            onClick={() => onJump(i)}
                            className="group py-3"
                        >
                            <span
                                className={`block h-1 rounded-full transition-all duration-300 ${
                                    i === index
                                        ? "w-6 bg-diamond-700 sm:w-8"
                                        : "w-2 bg-diamond-900/20 group-hover:bg-diamond-900/50 sm:w-3"
                                }`}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
