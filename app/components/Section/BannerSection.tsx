"use client";
import Image from "next/image";
import { Lottie } from "lottie-react";
import { useReducedMotion } from "framer-motion";


export default function BannerSection() {
    const reduceMotion = useReducedMotion();

    return(
            <div
                    id="banner"
                    className="grid h-full w-full grid-cols-2 grid-rows-[auto_1fr_auto] p-4"
                >
                    {/* ───────── TOP ───────── */}

            <div className="relative z-10 col-start-1 row-start-1 flex items-start pr-6 pt-4">
                <h1 className="max-w-xl text-4xl font-bold leading-[0.9] tracking-[-0.04em] sm:text-5xl lg:text-7xl">
                    Same sky
                    <br />
                    different story
                </h1>
            </div>

            <div
                className="
                    col-start-2 row-start-1
                    rounded-tr-[2.5rem]
                    rounded-tl-[2.5rem]
                    bg-diamond-400
                "
            />

            {/* Inverted corner — blue square with a quarter-circle cut out of its
                top-left, so the step down to the center band reads as a concave curve. */}
            <div
                aria-hidden
                className="col-start-1 row-start-1 size-10 self-end justify-self-end bg-[radial-gradient(circle_2.5rem_at_top_left,transparent_2.5rem,var(--color-diamond-400)_2.5rem)]"
            />

            {/* ───────── CENTER ───────── */}

            <div
                className="
                    relative overflow-hidden
                    col-span-2 row-start-2
                    min-h-[40vh]
                    bg-diamond-400
                    rounded-tl-2xl
                    rounded-br-2xl
                "
            >
                {/* Cage: absolute so the animation takes the band's box and
                    contributes zero height back to the grid row. */}
                <div className="absolute inset-0">
                    <Lottie
                        src="/lottie/halftone_clouds.json"
                        loop
                        autoplay={!reduceMotion}
                        rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
                        aria-hidden
                        className="h-full w-full"
                    />
                </div>
            </div>

            {/* ───────── BOTTOM ───────── */}

            <div
                className="
                    col-start-1 row-start-3
                    rounded-bl-[2.5rem]
                    rounded-br-[2.5rem]
                    bg-diamond-400
                "
            />

            {/* Mirror of the top inverted corner, cut out of the bottom-right. */}
            <div
                aria-hidden
                className="col-start-2 row-start-3 size-10 self-start justify-self-start bg-[radial-gradient(circle_2.5rem_at_bottom_right,transparent_2.5rem,var(--color-diamond-400)_2.5rem)]"
            />

            <div className="relative z-10 col-start-2 row-start-3 pl-6 pb-4">
                <h2 className="text-4xl font-bold leading-[0.9] tracking-[-0.04em] sm:text-5xl lg:text-8xl text-[#0B0F22]">
                    RAINOUTSIDE    
                    {/* Inside the h2 so `em` inherits the heading's font-size —
                        the globe rescales with every text breakpoint on its own. */}
                        
                    <Image
                        src="/icon/hud-flat-globe.svg"
                        alt=""
                        aria-hidden
                        width={291}
                        height={140}
                        className="inline-block h-[0.75em] w-auto align-baseline "
                    />
                </h2>
            </div>
        </div>
     )
}