"use client";

import Image from "next/image";
import Seperator from "../Seperator";
import portoData from "@/public/data/porto_data.json";
import { Notch } from "../Notch";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText"; // free + included since gsap 3.13
import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

export interface Porto {
    /** Free-form, not parsed — a year today, but "Mar 2024" would work too. */
    date: string;
    img: string;
    /** "#" marks the current site, which is rendered without a link. */
    url: string;
    desc: string;
}

const HISTORY = portoData as Porto[];
const N = HISTORY.length;

// Off-center images: gray, dark, a bit smaller. Centered image: true color, full size.
const DIM = { filter: "grayscale(1) brightness(0.35)", scale: 0.9 };
const LIT = { filter: "grayscale(0) brightness(1)", scale: 1 };

// Text reveal
const TEXT_DURATION = 0.8;
const TEXT_EASE = "power3.inOut";
const LINE_STAGGER = 0; // 0 = every line moves at the same time. Try 0.06 for a ripple.

export default function HistoryPortoSection() {
    const runwayRef = useRef<HTMLDivElement>(null);
    useLenis(() => ScrollTrigger.update());

    useEffect(() => {
        const runway = runwayRef.current;
        if (!runway) return;

        const mm = gsap.matchMedia();

        mm.add(
            {
                full: "(prefers-reduced-motion: no-preference)",
                reduced: "(prefers-reduced-motion: reduce)",
                // Matches the md: breakpoint. Crossing it re-runs this callback, which
                // reverts the old splits and rebuilds for the layout that's now on screen.
                isDesktop: "(min-width: 768px)",
            },
            (ctx) => {
                const reduced = !!ctx.conditions?.reduced;
                const isDesktop = !!ctx.conditions?.isDesktop;

                const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", runway);
                const shots = gsap.utils.toArray<HTMLElement>("[data-shot]", runway);
                const titles = gsap.utils.toArray<HTMLElement>("[data-title]", runway);
                const descs = gsap.utils.toArray<HTMLElement>("[data-desc]", runway);
                const counter = runway.querySelector<HTMLElement>("[data-count]");

                let active = 0;

                // Split every text into lines, each line in its own mask.
                // autoSplit re-splits on resize / font load; onSplit puts the fresh lines
                // back at their resting spot (visible if active, hidden below if not).
                const split = (els: HTMLElement[]) =>
                    els.map((el, i) =>
                        SplitText.create(el, {
                            type: "lines",
                            mask: "lines",
                            autoSplit: true,
                            onSplit: (self) => {
                                gsap.set(self.lines, { yPercent: i === active ? 0 : 100 });
                            },
                        })
                    );
                // Phones get no desc group: that layer is display:none there, and SplitText
                // measures line boxes — splitting a hidden element yields zero-height lines
                // that stay broken once it becomes visible again.
                const groups = isDesktop ? [split(titles), split(descs)] : [split(titles)];

                // Old lines leave upward, new lines rise from below (reversed when scrolling back up).
                const show = (next: number) => {
                    if (next === active) return;
                    const dir = next > active ? 1 : -1;
                    const prev = active;
                    active = next;
                    if (counter) counter.textContent = String(next + 1);

                    groups.forEach((g) => {
                        const opts = {
                            duration: reduced ? 0 : TEXT_DURATION,
                            ease: TEXT_EASE,
                            stagger: LINE_STAGGER,
                            overwrite: "auto" as const,
                        };
                        gsap.to(g[prev].lines, { yPercent: -100 * dir, ...opts });
                        gsap.fromTo(g[next].lines, { yPercent: 100 * dir }, { yPercent: 0, ...opts });
                    });
                };

                slides.forEach((slide, i) => {
                    // 1. Image brightness/scale follows the scroll. progress 0.5 = slide centered.
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: slide,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                        },
                    })
                        .to({}, { duration: 0.3 })
                        .fromTo(shots[i], DIM, { ...LIT, duration: 0.2, ease: "none" })
                        .to(shots[i], { ...DIM, duration: 0.2, ease: "none" })
                        .to({}, { duration: 0.3 });

                    // 2. Text swaps when this slide's center crosses the screen's center.
                    ScrollTrigger.create({
                        trigger: slide,
                        start: "top center",
                        end: "bottom center",
                        onToggle: (self) => {
                            if (self.isActive) show(i);
                        },
                    });
                });
            }
        );

        return () => mm.revert();
    }, []);

    return (
        <div id="history" className="w-full bg-diamond-black">
            <div className="relative">
                <Notch
                    corner="tl"
                    className=" [--notch-radius:1.25rem] pb-3 pl-4 pr-6 pt-3 sm:[--notch-radius:2rem] sm:pb-4 sm:pl-6 sm:pr-8 sm:pt-4"
                >
                    <h2 className="uppercase text-diamond-black">My Process</h2>
                </Notch>
            </div>

            {/* --img = image size, --pitch = distance between image centers */}
            <div
                ref={runwayRef}
                className="relative mt-12 text-diamond-50 [--img:45vw] md:[--img:43svh] [--pitch:calc(var(--img)_+_12svh)]"
            >
                {/* STICKY LAYER: title left, desc right, counter. The slides column below
                    pulls itself up over this with -mt, rather than this pushing down with
                    -mb: a sticky box is constrained by its MARGIN box staying inside the
                    parent, so a -100svh margin here shrank that box to ~0 and the layer
                    stayed pinned ~100svh past the last image. Keep the negative margin on
                    the sibling. */}
                <div className="pointer-events-none sticky top-0 z-10 h-svh">
                    <div className="flex h-full flex-col justify-between px-4 py-10 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-10 md:px-6 md:py-0 lg:px-10">
                        {/* TITLE */}
                        {/* One clamp instead of a 4xl/5xl/7xl ramp — the year is display
                            type sized to its column, and h-[1.9em] tracks it automatically.
                            font-bold, not semibold: 600 isn't in the weight set. */}
                        <div className="relative h-[1.9em] pr-14 text-[clamp(3rem,8.5vw,8rem)] font-bold uppercase md:pr-0">
                            {HISTORY.map(({ date, img }) => (
                                <h3
                                    key={img}
                                    data-title
                                    className="absolute inset-x-0 top-1/2 -translate-y-1/2 leading-none"
                                >
                                    {date}
                                </h3>
                            ))}
                        </div>

                        <div className="hidden w-(--img) md:block" aria-hidden />

                        <div className="relative hidden md:block md:h-56">
                            {HISTORY.map(({ desc, img }) => (
                                <p
                                    key={img}
                                    data-desc
                                    className="absolute right-0 top-1/2 w-full -translate-y-1/2 text-sm text-diamond-100/80 md:max-w-lg md:text-base"
                                >
                                    {desc}
                                </p>
                            ))}
                        </div>
                    </div>

                    <p className="absolute right-4 top-10 hidden text-2xl font-bold md:bottom-10 md:right-10 md:top-auto md:block lg:right-10 lg:text-4xl">
                        <span data-count>1</span>/{N}
                    </p>
                </div>

                {/* CENTER COLUMN: normal, real scroll. Padding lets first/last image reach the center. */}
                <div className="-mt-[100svh] flex flex-col items-center py-[calc(50svh_-_var(--pitch)/2)]">
                    {HISTORY.map(({ date, img, url, desc }) => {
                        const live = url !== "#";
                        const shot = (
                            <Image
                                src={img}
                                alt={`The ${date} portfolio`}
                                fill
                                sizes="(min-width: 768px) 25vw, 80vw"
                                className="border border-diamond-50/15 object-cover"
                            />
                        );

                        return (
                            <div
                                key={img}
                                data-slide
                                className="flex w-full flex-col items-center justify-center gap-5 py-8 md:h-(--pitch) md:gap-0 md:py-0"
                            >
                                <div
                                    data-shot
                                    className="relative aspect-16/9 h-(--img) will-change-transform"
                                >
                                    {live ? (
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute inset-0 block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-diamond-400"
                                        >
                                            {shot}
                                        </a>
                                    ) : (
                                        shot
                                    )}
                                </div>
                                <p className="w-[80vw] text-sm text-diamond-100/80 md:hidden">
                                    {desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="px-4 pb-16 md:px-6 lg:px-10">
                <Seperator mode="horizontal" backgroundColor="bg-diamond-50/20" />
            </div>
        </div>
    );
}