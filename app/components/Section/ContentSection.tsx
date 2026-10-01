"use client"
import { useState } from "react";
import BannerSection from "./BannerSection";
import LatestProjectSection from "./LatestProjectSection";
import ServiceSection from "./ServiceSeection";
import GameSection from "./GameSection";

export default function ContentSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    const SECTIONS = [
        { label: "Banner", content: <BannerSection /> },
        { label: "Latest Project", content: <LatestProjectSection /> },
        { label: "Services", content: <ServiceSection /> },
        { label: "Placeholder", content: <div /> },
        { label: "Game", content: <GameSection /> },
    ];

    return (
        <div className="relative h-full">
            <div className="fixed right-14 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-4">
                {SECTIONS.map((section, index) => (
                    <button
                        key={section.label}
                        aria-label={`Show ${section.label}`}
                        aria-current={activeIndex === index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-2 cursor-pointer rounded-full transition-[height,background-color] duration-300 ease-out ${
                            activeIndex === index ? "h-10 bg-blue-500" : "h-5 bg-gray-500 hover:bg-gray-400"
                        }`}
                    />
                ))}
            </div>

            {SECTIONS.map((section, index) => (
               
                <section
                    key={section.label}
                    className={
                        activeIndex === index
                            ? "flex h-full w-full justify-center p-6"
                            : "hidden"
                    }
                >
                    {section.content}
                </section>
            ))}
        </div>
     )
}
