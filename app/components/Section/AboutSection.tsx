"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

const Hl = ({ children }: { children: ReactNode }) => (
    <span className="text-diamond-500">{children}</span>
);

/** One step. Same type size for all of them; starts faint + grey until revealed. */
const Step = ({ n, className = "", children }: { n: number; className?: string; children: ReactNode }) => (
    <div
        data-reveal
        className={`flex flex-col gap-3 self-center opacity-15 grayscale motion-reduce:opacity-100 motion-reduce:grayscale-0 sm:gap-5 sm:pr-6 ${className}`}
    >
        <p className="border-l-2 border-diamond-600/40 pl-3 text-lg font-bold leading-[1.15] tracking-tight text-diamond-900 sm:pl-4 sm:text-xl xl:text-2xl">
            {children}
        </p>
    </div>
);

export default function AboutSection() {
    const runwayRef = useRef<HTMLDivElement | null>(null);

    // Lenis drives window scroll on its own rAF; without this ScrollTrigger measures a
    // frame late and the scrub visibly trails the text.
    useLenis(() => ScrollTrigger.update());

    useEffect(() => {
        const runway = runwayRef.current;
        if (!runway) return;

        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const steps = gsap.utils.toArray<HTMLElement>("[data-reveal]", runway);

            // One scrubbed timeline across the whole runway. Steps are revealed one
            // after another and never hidden again, so the text stacks up.
            const tl = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                    trigger: runway,
                    start: "top top",     // the sticky stage engages here...
                    end: "bottom bottom", // ...and lets go here
                    scrub: 0.6,
                },
            });

            steps.forEach((el, i) => {
                tl.fromTo(
                    el,
                    { opacity: 0.15, y: 32, filter: "grayscale(1)" },
                    { opacity: 1, y: 0, filter: "grayscale(0)", duration: 1 },
                    i // one timeline unit per step
                );
            });
            tl.to({}, { duration: 0.6 }); // hold: the last line sits fully revealed before release
        });

        return () => mm.revert();
    }, []);

    return (
        // Big empty space above and below the pinned part
        <div id="about-section" className="w-full py-[12vh] motion-reduce:py-20 sm:py-[25vh]">
            {/* Scroll runway: its height is how long the stage stays stuck. */}
            <div ref={runwayRef} className="relative h-[400vh] motion-reduce:h-auto">
                {/* Pinned stage via CSS sticky (no ScrollTrigger pin spacers to fight the layout) */}
                <div className="sticky top-0 mx-auto flex h-[var(--stage,100svh)] w-full max-w-7xl flex-col justify-center gap-6 px-4 motion-reduce:static motion-reduce:h-auto sm:gap-10 sm:px-6 lg:grid lg:grid-cols-3 lg:grid-rows-3 lg:gap-0 lg:px-10 lg:py-[12vh]">
                    <Step n={1} className="lg:col-start-1 lg:row-start-1">
                        <Hl>rainoutside</Hl> isn&apos;t a brand yet.
                    </Step>

                    <Step n={2} className="lg:col-start-2 lg:row-start-2">
                        It&apos;s a one-person project by <Hl>Rafi</Hl>, a front-end developer who&apos;s working his way
                        toward full-stack and, someday, game development.
                    </Step>

                    <Step n={3} className="lg:col-start-3 lg:row-start-3">
                        For now it&apos;s a place to <Hl>build</Hl> in the open, try <Hl>new ideas</Hl>, and learn by
                        shipping them.
                    </Step>
                </div>
            </div>
        </div>
    );
}