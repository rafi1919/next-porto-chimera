"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
import StackBadge, { type Stack } from "../StackBadge";


interface Project {
    id: number;
    name: string;
    description: string;
    stack: Stack[];
    image: string;
}

// ponytail: all three share /3.svg — it's the only project image in public/.
// Give each its own file when you have them.
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

export default function LatestProjectSection() {
    const [index, setIndex] = useState(0);
    const reduceMotion = useReducedMotion();

    const project = PROJECTS[index];
    const nextProject = PROJECTS[(index + 1) % PROJECTS.length];
    const showNext = () => setIndex((i) => (i + 1) % PROJECTS.length);

    // Slide distance collapses to 0 for reduced-motion users; the fade stays.
    const slide = reduceMotion ? 0 : 40;
    const transition = { duration: 0.35, ease: "easeOut" } as const;

    return (
        <div id="latest-project" className="flex w-full flex-col justify-center gap-4">
            <div className="grid w-full grid-cols-12 gap-2">
                <div className="col-span-1"></div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, x: slide }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -slide }}
                        transition={transition}
                        className="col-span-3 grid grid-rows-[auto_1fr_auto] gap-6"
                    >
                        <h2 className="bg-linear-to-br from-diamond-400 via-diamond-600 to-diamond-900 bg-clip-text pb-1 text-4xl font-bold leading-tight text-transparent sm:text-5xl lg:text-6xl">
                            {project.name}
                        </h2>
                        <p className="text-lg leading-relaxed text-diamond-900/70">
                            {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {project.stack.map((stack) => (
                                <StackBadge key={stack} stack={stack} />
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="col-span-7 grid gap-2">
                  
                    <LatestProjectCard project={project} transition={transition} />
                    
                    <button
                        type="button"
                        onClick={showNext}
                        aria-label={`Show next project: ${nextProject.name}`}
                        className="group cursor-pointer"
                    >
                        <span className="sr-only">Next project</span>
                    </button>
                </div>
                <div className="col-span-1"></div>
            </div>
        </div>
    );
}


const LatestProjectCard = ({ project, transition }: { project: Project,  transition: Transition  }) => {
    return (
         <div className="grid h-100 grid-cols-8">
                <div
                    className="col-span-7 flex rounded-2xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${project.image})` }}
                >
                    <div className="bg-diamond-900 h-full w-20 ml-auto rounded-r-2xl"></div>
                </div>
                 <div className="col-span-1 bg-diamond-900 rounded-2xl p-2 items-start overflow-hidden relative">
                      <AnimatePresence mode="wait">
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, }}
                            animate={{ opacity: 1, }}
                            exit={{ opacity: 0,}}
                            transition={transition}
                        >
                            <p className="text-4xl font-bold rotate-[-90deg] text-diamond-100 p-2 w-fit">
                                {String(project.id).padStart(2, "0")}
                            </p>
                      </motion.div>
                    </AnimatePresence>
                    <span
                        aria-hidden
                        className="block h-[80%] w-full bg-diamond-100 -ml-14 [mask:url(/icon/hud-wave.svg)_center/contain_no-repeat]"
                    />

                </div>
            </div>
    )
}
