"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import Seperator from "../Seperator";
import Ripples from "../Ripples";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
    { text: "Process, it's like rain.", align: "text-start" },
    { text: "Slow, quick, or hard, ", align: "text-center" },
    { text: "it all adds up.", align: "text-end" },
];

const RISE = 1;
const STEP = 1;

const HOLD = 0.8;

/** Rules draw left -> right before any text moves, same order as AboutSection's
    grid lines. DRAW is how long one rule takes, RULE_STEP the gap between starts. */
const DRAW = 0.6;
const RULE_STEP = 0.18;
/** Last rule lands at RULE_STEP * (n - 1) + DRAW; this is a small breath after it.
    Keep it >= that or the first text line starts while rules are still drawing. */
const TEXT_START = 1.3;

export default function MotoSection() {
    const runwayRef = useRef<HTMLDivElement>(null);
    useLenis(() => ScrollTrigger.update());

    useEffect(() => {
        const runway = runwayRef.current;
        if (!runway) return;

        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const lines = gsap.utils.toArray<HTMLElement>("[data-line]", runway);
            // Class, not a data attribute, because Seperator only forwards className.
            const rules = gsap.utils.toArray<HTMLElement>(".js-rule", runway);

            // Both start states live inside the matchMedia, so reduced motion never
            // hides anything — no GSAP runs, markup is already its finished state.
            gsap.set(lines, { yPercent: -110 });
            // scaleX, not width: transform-only, so it never triggers layout. The left
            // origin is what makes it read as drawing outward instead of growing.
            gsap.set(rules, { scaleX: 0, transformOrigin: "left center" });

            const tl = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                    trigger: runway,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true,
                },
            });

            // 1) Rules draw left -> right, top one first.
            tl.to(rules, { scaleX: 1, duration: DRAW, stagger: RULE_STEP }, 0);

            // 2) Then the text. stagger does the work the old `i * 0.8` position loop
            //    was doing. Lines rise and stay risen, so they stack up.
            tl.to(lines, { yPercent: 0, duration: RISE, stagger: STEP }, TEXT_START);

            tl.to({}, { duration: HOLD });
        });

        return () => mm.revert(); // cleans up tweens + ScrollTrigger
    }, []);

    return (
        <div id="moto" className="w-full">
            {/* Runway: its height is how long the stage stays stuck, and so how
                much scrolling the three lines are spread over. */}
            {/* 380vh, up from 300: the rule-draw added ~1.3 timeline units on top of the
                text's 3.8, and a fixed runway would have made the whole thing 25% faster
                rather than longer. This is the knob for overall pace. */}
            <div ref={runwayRef} className="relative h-[380vh] motion-reduce:h-auto">

                <div className="sticky top-0 flex h-(--stage) flex-col justify-center gap-4 overflow-hidden touch-pan-y motion-reduce:static motion-reduce:h-auto motion-reduce:py-20 lg:py-10">
              
                    <Ripples />

                    <Seperator mode="horizontal" className="js-rule" />
                    {LINES.map(({ text, align }) => (
                        <div key={text} className="contents">
                            <p
                                className={`text-[clamp(1.5rem,6vw,5rem)] font-bold px-4 md:px-6 lg:px-10 ${align}`}
                            >
        
                                <span className="block overflow-hidden pb-2 -mb-2">
                                    <span data-line className="block will-change-transform">
                                        {text}
                                    </span>
                                </span>
                            </p>
                            <Seperator mode="horizontal" className="js-rule" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
