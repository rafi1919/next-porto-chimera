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
                <h1 className="max-w-xl text-diamond-black">
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

            <div className="@container relative z-10 col-start-1 row-start-3 md:col-start-2 md:pl-6 md:pb-4">
                {/* Sized in cqi, not vw: this cell is full-width in the stacked layout and
                    HALF-width from md (it moves to col-start-2), so no viewport-based
                    expression can grow monotonically across that break — the old
                    `clamp(2rem,10vw,5rem) md:text-5xl` actually shrank the wordmark at
                    768px. 10.5cqi is ~96% of the container at every width.
                    A <p>, not a heading: this is the logotype, not a section label — the
                    h1 above already owns this section. */}
                <p className="flex text-[clamp(2rem,10.5cqi,6rem)] font-bold text-diamond-black">
                    RAINOUTSIDE
                    {/* `em` inherits the wordmark's font-size, which is now container-driven,
                        so the globe tracks the text with no breakpoints to fall out of sync. */}

                    <Image
                        src="/icon/hud-flat-globe.svg"
                        alt=""
                        aria-hidden
                        width={291}
                        height={140}
                        className="inline-block h-[0.75em] w-auto align-baseline ml-auto"
                    />
                </p>
            </div>
        </div>
     )
}