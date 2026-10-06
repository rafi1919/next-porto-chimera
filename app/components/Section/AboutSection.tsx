"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

const Hl = ({ children }: { children: ReactNode }) => (
    <span className="text-diamond-600">{children}</span>
);

/** One step. Same type size for all of them; starts faint + grey until revealed. */
const Step = ({ n, className = "", children }: { n: number; className?: string; children: ReactNode }) => (
    <div
        data-reveal
        className={`flex flex-col gap-3 self-center opacity-15 grayscale motion-reduce:opacity-100 motion-reduce:grayscale-0 sm:gap-5 sm:pr-6 ${className}`}
    >
        <p className="border-l-2 border-diamond-600/40 pl-3 text-lead text-diamond-900 sm:pl-4 lg:border-l-0 lg:pl-6">
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

        mm.add(
            {
                isDesktop: "(min-width: 1024px)",
                // isMobile is not read below — it's here because gsap.matchMedia's object
                // form only invokes the callback when at least ONE query matches
                // (gsap-core: `anyMatch && matches.push(c)`). Without a complementary
                // query, a phone with normal motion matched nothing, the callback never
                // ran, and the steps stayed at their base opacity-15 grayscale forever.
                isMobile: "(max-width: 1023px)",
                reduce: "(prefers-reduced-motion: reduce)",
            },
            (ctx) => {
                const { isDesktop, reduce } = ctx.conditions as { isDesktop: boolean; reduce: boolean };
                if (reduce) return; // lines + text are already fully shown by the motion-reduce: classes

                const steps = gsap.utils.toArray<HTMLElement>("[data-reveal]", runway);
                const lines = gsap.utils.toArray<HTMLElement>("[data-line]", runway);

                // One scrubbed timeline across the whole runway.
                const tl = gsap.timeline({
                    defaults: { ease: "none" },
                    scrollTrigger: {
                        trigger: runway,
                        start: "top top",     // the sticky stage engages here...
                        end: "bottom bottom", // ...and lets go here
                        scrub: 0.6,
                    },
                });

                // 1) Grid lines draw top -> bottom (only exists at lg, so only wait for it there)
                let textStart = 0;
                if (isDesktop && lines.length) {
                    tl.fromTo(lines, { height: "0%" }, { height: "100%", duration: 1, stagger: 0.15 }, 0);
                    textStart = 1.4; // lines finish at 1.15; small breath before the first line of text
                }

                // 2) Text one by one, and it stays (so it stacks up)
                steps.forEach((el, i) => {
                    tl.fromTo(
                        el,
                        { opacity: 0.15, y: 32, filter: "grayscale(1)" },
                        { opacity: 1, y: 0, filter: "grayscale(0)", duration: 1 },
                        textStart + i
                    );
                });

                tl.to({}, { duration: 0.6 }); // hold: the last line sits fully revealed before release
            }
        );

        return () => mm.revert();
    }, []);

    return (
        <div id="about-section" className="w-full py-[12vh] motion-reduce:py-20 sm:py-[25vh]">
            <div ref={runwayRef} className="relative h-[400vh] motion-reduce:h-auto">

                <div className="sticky top-0 mx-auto flex h-[var(--stage,100svh)] w-full max-w-7xl flex-col justify-center gap-6 px-4 motion-reduce:static motion-reduce:h-auto sm:gap-10 sm:px-6 lg:grid lg:grid-cols-3 lg:grid-rows-3 lg:gap-0 lg:px-10 lg:py-[12vh]">
                    <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden lg:block lg:px-10">
                        <div className="relative h-full">
                            <span data-line className="absolute left-1/3 top-0 h-0 w-px bg-diamond-600/40 motion-reduce:h-full" />
                            <span data-line className="absolute left-2/3 top-0 h-0 w-px bg-diamond-600/40 motion-reduce:h-full" />
                        </div>
                    </div>

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