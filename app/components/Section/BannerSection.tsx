"use client";
import Image from "next/image";
import { Lottie } from "lottie-react";
import { useReducedMotion } from "framer-motion";


export default function BannerSection() {
    const reduceMotion = useReducedMotion();

    return(
            // Mobile is a plain stack — text, lottie, text. The two-column motif needs the
            // blue fillers and their concave corners to read, and at 375px those eat the
            // column the headings need, so they only switch on at md.
            <div
                id="banner"
                className="grid min-h-(--stage) w-full grid-cols-1 grid-rows-[auto_1fr_auto] gap-4 p-4 md:grid-cols-2 md:gap-0 md:p-6 lg:p-10"
                >
                    {/* ───────── TOP ───────── */}

            <div className="relative z-10 col-start-1 row-start-1 flex items-start md:pr-6 md:pt-4">
                <h1 className="max-w-xl text-3xl font-bold leading-[0.9] tracking-[-0.04em] sm:text-4xl md:text-5xl lg:text-7xl">
                    Same sky
                    <br />
                    Different story
                </h1>
            </div>

            <div className="col-start-2 row-start-1 hidden rounded-t-[2.5rem] bg-diamond-400 md:block" />

            {/* Inverted corner — blue square with a quarter-circle cut out of its
                top-left, so the step down to the center band reads as a concave curve. */}
            <div
                aria-hidden
                className="col-start-1 row-start-1 hidden size-10 self-end justify-self-end bg-[radial-gradient(circle_2.5rem_at_top_left,transparent_2.5rem,var(--color-diamond-400)_2.5rem)] md:block"
            />

            {/* ───────── CENTER ───────── */}

            <div
                className="
                    relative overflow-hidden
                    col-start-1 row-start-2
                    min-h-[40vh]
                    bg-diamond-400
                    rounded-2xl
                    md:col-span-2 md:rounded-none
                    md:rounded-tl-2xl
                    md:rounded-br-2xl
                "
            >
                {/* Cage: absolute so the animation takes the band's box and
                    contributes zero height back to the grid row. */}
                <div className="absolute inset-0">
                    <Lottie
                        src="/lottie/halftone_clouds_1.json"
                        loop
                        autoplay={!reduceMotion}
                        rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
                        aria-hidden
                        className="h-full w-full"
                    />
                </div>
            </div>

            {/* ───────── BOTTOM ───────── */}

            <div className="col-start-1 row-start-3 hidden rounded-b-[2.5rem] bg-diamond-400 md:block" />

            {/* Mirror of the top inverted corner, cut out of the bottom-right. */}
            <div
                aria-hidden
                className="col-start-2 row-start-3 hidden size-10 self-start justify-self-start bg-[radial-gradient(circle_2.5rem_at_bottom_right,transparent_2.5rem,var(--color-diamond-400)_2.5rem)] md:block"
            />

            <div className="relative z-10 col-start-1 row-start-3 md:col-start-2 md:pl-6 md:pb-4">
                {/* Fluid below md so the wordmark fills the stacked column; the two-column
                    motif takes over from md and goes back to stepped sizes. The globe is
                    1.56em wide and sits on the same line, so the word itself can only have
                    ~80% of the box — 10vw is what keeps them together. */}
                <h2 className="text-[clamp(2rem,10vw,5rem)] flex font-bold leading-[0.9] tracking-[-0.04em] text-[#0B0F22] md:text-5xl lg:text-8xl">
                    RAINOUTSIDE    
                    {/* Inside the h2 so `em` inherits the heading's font-size —
                        the globe rescales with every text breakpoint on its own. */}
                        
                    <Image
                        src="/icon/hud-flat-globe.svg"
                        alt=""
                        aria-hidden
                        width={291}
                        height={140}
                        className="inline-block h-[0.75em] w-auto align-baseline ml-auto"
                    />
                </h2>
            </div>
        </div>
     )
}