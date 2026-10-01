"use client";
import { useState } from "react";
import { MindCard } from "../MindCard";
import { SciFiToggle } from "../SciFiToggle";


interface Service {
    title: string;
    description: string;
    number: number;
}

const SERVICES: Service[] = [
    {
        title: "Landing Page",
        description: "Dynamic, playful, memorable.",
        number: 1
    },
    {
        title: "Web Application",
        description: "Dashboards, auth, and data that scales.",
        number: 2
    },
    {
        title: "API & Backend",
        description: "Fast endpoints, clean contracts, boring reliability.",
        number: 3
    },
    {
        title: "UI/UX Design",
        description: "Wireframe to pixel, built to ship.",
        number: 4
    },
    {
        title: "Performance Audit",
        description: "Find the slow, kill the slow.",
        number: 5
    },
    {
        title: "Maintenance",
        description: "Updates, monitoring, and fixes before you notice.",
        number: 6
    }
]


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
// Edges must meet exactly — these panels are translucent, so any overlap
// double-tints and double-blurs into a visible darker band.
const TILES: Record<number, string> = {
    1: "left-0     top-0     w-[32%] h-[46%]",
    2: "left-[32%] top-0     w-[40%] h-[28%]",
    3: "left-[72%] top-0     w-[28%] h-[46%]",
    4: "left-[32%] top-[28%] w-[40%] h-[18%]",
    5: "left-0     top-[46%] w-[52%] h-[54%]",
    6: "left-[52%] top-[46%] w-[48%] h-[54%]",
};

export default function ServiceSection() {

    const [active, setActive] = useState<Record<number, boolean>>({});

    const toggle = (number: number) => (on: boolean) =>
        setActive((prev) => ({ ...prev, [number]: on }));

    return (
         <div className="grid-cols-8 grid gap-6 w-full">
            <div className="col-span-1 grid w-fit content-start gap-24 rounded-2xl bg-[#242424] p-4">
                <div className="flex flex-col gap-8">
                    {SERVICES.slice(0, 3).map((service) => (
                        <SciFiToggle key={service.number} number={service.number} onChange={toggle(service.number)} />
                    ))}
                </div>
                <div className="flex flex-col gap-8">
                    {SERVICES.slice(3, 6).map((service) => (
                        <SciFiToggle key={service.number} number={service.number} onChange={toggle(service.number)} />
                    ))}
                </div>
            </div>
            <div className="col-span-6">
                <div className="relative w-full h-full bg-[url(/3.svg)] bg-cover bg-center rounded-2xl">
                    {/* Reveal tiles — above the bg, below the cards */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                        {SERVICES.map((service) => (
                            <div
                                key={service.number}
                                className={`absolute bg-zinc-500/40 backdrop-blur-md transition-opacity duration-500 ease-out motion-reduce:transition-none ${TILES[service.number]} ${
                                    active[service.number] ? "opacity-0" : "opacity-100"
                                }`}
                            />
                        ))}
                    </div>

                    <div className="relative h-full w-full">
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
                </div>
            </div>
            <div className="col-span-1">

            </div>
        </div>
        
    )
}
