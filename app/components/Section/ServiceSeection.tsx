"use client";
import { useState, type CSSProperties, type ReactNode } from "react";
import { MindCard } from "../MindCard";
import { SciFiToggle } from "../SciFiToggle";
import NavTag from "../NavTag";
import Seperator from "../Seperator";

interface Service {
    title: string;
    description: string;
    number: number;
}

const SERVICES: Service[] = [
    { title: "Landing Page", description: "Dynamic, playful, memorable.", number: 1 },
    { title: "Web Application", description: "Dashboards, auth, and data that scales.", number: 2 },
    { title: "API & Backend", description: "Fast endpoints, clean contracts, boring reliability.", number: 3 },
    { title: "UI/UX Design", description: "Wireframe to pixel, built to ship.", number: 4 },
    { title: "Performance Audit", description: "Find the slow, kill the slow.", number: 5 },
    { title: "Maintenance", description: "Updates, monitoring, and fixes before you notice.", number: 6 },
];

const POSITIONS: Record<number, string> = {
    1: "left-[36%] top-[40%]",
    2: "left-[6%]  top-[24%]",
    3: "left-[68%] top-[10%]",
    4: "left-[44%] top-[66%]",
    5: "left-[16%] top-[56%]",
    6: "left-[70%] top-[46%]",
};

// Irregular tiles that together cover 100% of the background, edge to edge.
// Bands: 0-28% is 01|02|03, 28-46% is 01|04|03, 46-100% is 05|06.
// These wrappers must still meet exactly. The visible glass panel is inset
// inside each one, so the gutters are drawn without any panels overlapping.
const TILES: Record<number, string> = {
    1: "left-0     top-0     w-[32%] h-[46%]",
    2: "left-[32%] top-0     w-[40%] h-[28%]",
    3: "left-[72%] top-0     w-[28%] h-[46%]",
    4: "left-[32%] top-[28%] w-[40%] h-[18%]",
    5: "left-0     top-[46%] w-[52%] h-[54%]",
    6: "left-[52%] top-[46%] w-[48%] h-[54%]",
};

// Must match the page background so the cutout reads as "empty page".
// The var comes from your Tailwind v4 theme; the hex is only a fallback.
const PAGE = "var(--color-diamond-50, #f0f8f7)";
const RADIUS = "2rem"; // one radius for stage, panel and cutout

const pad = (n: number) => String(n).padStart(2, "0");

export default function ServiceSection() {
    const [active, setActive] = useState<Record<number, boolean>>({});
    const count = Object.values(active).filter(Boolean).length;

    const toggle = (number: number) => (on: boolean) =>
        setActive((prev) => ({ ...prev, [number]: on }));

    return (
        <div className="mx-auto grid w-full max-w-400 grid-cols-1 gap-4 p-10 lg:grid-cols-8">
            <NavTag number="03" text="Services" />

            {/* ── Control panel ─────────────────────────── */}
            <aside className="flex items-center justify-between gap-4 rounded-[2rem] bg-diamond-900 p-4 lg:col-span-1 lg:w-fit lg:flex-col lg:items-center lg:justify-start lg:gap-6 lg:py-6">
                <div className="flex gap-4 lg:flex-col lg:gap-6">
                    {SERVICES.slice(0, 3).map((service) => (
                        <div key={service.number} title={service.title}>
                            <SciFiToggle number={service.number} onChange={toggle(service.number)} />
                        </div>
                    ))}
                </div>

                <span aria-hidden className="h-10 w-px bg-diamond-100/20 lg:h-px lg:w-full" />

                <div className="flex gap-4 lg:flex-col lg:gap-6">
                    {SERVICES.slice(3, 6).map((service) => (
                        <div key={service.number} title={service.title}>
                            <SciFiToggle number={service.number} onChange={toggle(service.number)} />
                        </div>
                    ))}
                </div>

                {/* Banner stripe motif, pinned to the bottom of the panel */}
                <span
                    aria-hidden
                    className="mt-auto hidden h-5 w-full bg-diamond-700 lg:block [mask:repeating-linear-gradient(115deg,#000_0_10px,#0000_10px_20px)]"
                />
            </aside>

            {/* ── Stage ─────────────────────────────────── */}
            <div
                className="relative min-h-[34rem] overflow-hidden bg-[url(/3.svg)] bg-cover bg-center lg:col-span-7"
                style={{ borderRadius: RADIUS }}
            >
                {/* Frosted tiles: above the bg, below the cards */}
                <div className="pointer-events-none absolute inset-0 z-0">
                    {SERVICES.map((service) => (
                        <div key={service.number} className={`absolute ${TILES[service.number]}`}>
                            <div
                                className={`absolute inset-0 bg-white/25 backdrop-blur-md transition-opacity duration-500 ease-out motion-reduce:transition-none ${
                                    active[service.number] ? "opacity-0" : "opacity-100"
                                }`}
                            />
                        </div>
                    ))}
                </div>

                {/* Cards */}
                <div className="absolute inset-0 z-10">
                    {SERVICES.map((service) => (
                        <div key={service.number} className={`absolute ${POSITIONS[service.number]}`}>
                            <MindCard
                                number={service.number}
                                description={service.description}
                                isActive={!!active[service.number]}
                            />
                        </div>
                    ))}
                </div>

                {/* Banner-style cutout with live readout */}
                <Cutout>
                    <div className="flex items-center gap-4 pb-4 pr-6">
                        <p className="text-6xl font-extrabold leading-none tracking-tighter text-diamond-900 tabular-nums">
                            {pad(count)}
                            <span className="text-2xl text-diamond-900/40">/{pad(SERVICES.length)}</span>
                        </p>
                        <Seperator  mode="vertical"/>
                        <p aria-live="polite" className="max-w-48 text-xs leading-snug text-diamond-900/70">
                            Services revealed. Toggle a number to clear the sky.
                        </p>
                    </div>
                </Cutout>
            </div>
        </div>
    );
}

/* ───────────────────────── Cutout ─────────────────────────
   A page-colored notch in the stage's top-left corner. The two
   shims round the corners where the stage wraps around it. */

const shim: CSSProperties = {
    background: `radial-gradient(circle at 100% 100%, transparent ${RADIUS}, ${PAGE} calc(${RADIUS} + 1px))`,
};

const Cutout = ({ children }: { children: ReactNode }) => (
    <div
        className="absolute left-0 top-0 z-20"
        style={{ background: PAGE, borderBottomRightRadius: RADIUS }}
    >
        {children}
        {/* stage edge to the right of the notch */}
        <span aria-hidden className="absolute left-full top-0 size-8" style={shim} />
        {/* stage edge below the notch */}
        <span aria-hidden className="absolute left-0 top-full size-8" style={shim} />
    </div>
);