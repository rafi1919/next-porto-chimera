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
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 sm:p-10">
            {/* ── Info panel: top-left is the empty quadrant of the 3D stack ── */}
            <div
                aria-live="polite"
                className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-[2rem] bg-diamond-900/90 p-6 text-diamond-50 backdrop-blur-md sm:p-8 [clip-path:polygon(0_0,calc(100%-36px)_0,100%_36px,100%_100%,0_100%)]"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: slide }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={transition}
                        className="flex flex-col gap-5"
                    >
                        {/* Readout: big number | divider | label (same pattern as the 9.2 footer stat) */}
                        <div className="flex items-center gap-4">
                            <p className="text-6xl font-extrabold leading-none tracking-tighter tabular-nums">
                                {pad(project.id)}
                                <span className="text-xl text-diamond-100/40">/{pad(total)}</span>
                            </p>
                            <span aria-hidden className="h-12 w-px bg-diamond-100/40" />
                            <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.3em] text-diamond-100/60">
                                Latest
                                <br />
                                Project
                            </p>
                        </div>

                        <h2 className="text-[clamp(1.75rem,3vw,2.75rem)] font-extrabold leading-[0.95] tracking-tighter">
                            {project.name}
                        </h2>

                        <p className="border-l-2 border-diamond-400/40 pl-4 text-sm leading-relaxed text-diamond-100/70">
                            {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {project.stack.map((stack) => (
                                <StackBadge key={stack} stack={stack} />
                            ))}
                        </div>

                        <div className="mt-1 flex items-center justify-between gap-4">
                            {/* Light button: the default one is diamond-900, same as the panel */}
                            <Button
                                href={project.href}
                                text="View More"
                                className="bg-diamond-50! text-diamond-900! hover:bg-diamond-400! focus-visible:bg-diamond-400!"
                            />
                            {/* Stripe motif from the footer */}
                            <span
                                aria-hidden
                                className="h-4 w-20 bg-diamond-400 [mask:repeating-linear-gradient(115deg,#000_0_8px,#0000_8px_16px)]"
                            />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Bottom row: scroll hint + clickable tick rail ── */}
            <div className="flex items-end justify-between gap-6">
                <p
                    aria-hidden
                    className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-diamond-900/60 transition-opacity duration-500 ${
                        index === 0 ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <Arrow className="size-4 rotate-90 motion-safe:animate-bounce" />
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
                                        ? "w-8 bg-diamond-700"
                                        : "w-3 bg-diamond-900/20 group-hover:bg-diamond-900/50"
                                }`}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}