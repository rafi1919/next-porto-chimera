"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Arrow } from "./Arrow";
import type { Project } from "./TicketCard";

const pad = (n: number) => String(n).padStart(2, "0");

interface ProjectDetailCardProps {
    project: Project | null;
    total: number;
}

export default function ProjectDetailCard({ project, total }: ProjectDetailCardProps) {
    const reduce = useReducedMotion();
    const slide = reduce ? 0 : 12;

    return (
        <div className="pointer-events-none absolute bottom-6 left-6 z-10 w-[min(21rem,calc(100vw-3rem))]">
            <AnimatePresence mode="wait">
                {project && (
                    <motion.aside
                        key={project.id}
                        aria-live="polite"
                        initial={{ opacity: 0, y: slide }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.3, ease: "easeOut" }}
                        className="pointer-events-auto relative border border-diamond-100/25 bg-diamond-black/75 text-diamond-50 backdrop-blur-md"
                    >
                        {/* HUD corner brackets, same device as MoreProjectsCard. Offset by a
                            pixel so they sit on the hairline instead of inside it. */}
                        <span aria-hidden className="absolute -left-px -top-px size-3 border-l-2 border-t-2 border-diamond-100/70" />
                        <span aria-hidden className="absolute -bottom-px -right-px size-3 border-b-2 border-r-2 border-diamond-100/70" />

                        <div className="flex items-center justify-between gap-3 border-b border-diamond-100/20 px-4 py-3 font-mono text-label uppercase text-diamond-100/80">
                            <span>Detail</span>
                            <span>
                                {pad(project.id)}
                                <span className="text-diamond-100/80">/{pad(total)}</span>
                            </span>
                        </div>

                        <div className="flex flex-col gap-2 border-b border-diamond-100/20 px-4 py-4">
                            <h3>{project.name}</h3>
                            <p className="line-clamp-3 border-l border-diamond-100/25 pl-3 text-sm text-diamond-100/80">
                                {project.description}
                            </p>
                        </div>

                        <ul className="flex flex-wrap items-center gap-y-1 border-b border-diamond-100/20 px-4 py-3 font-mono text-label uppercase text-diamond-100/80">
                            {project.stack.slice(0, 4).map((stack) => (
                                <li
                                    key={stack}
                                    className="before:mx-3 before:text-diamond-100/80 before:content-['/'] first:before:hidden"
                                >
                                    {stack}
                                </li>
                            ))}
                        </ul>

                        {project.href && (
                            <a
                                href={project.href}
                                className="group flex items-center justify-between gap-3 px-4 py-3 font-mono text-label uppercase text-diamond-100/80 transition-colors hover:bg-diamond-100/10 hover:text-diamond-50"
                            >
                                View project
                                <Arrow className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
                            </a>
                        ) }
                    </motion.aside>
                )}
            </AnimatePresence>
        </div>
    );
}
