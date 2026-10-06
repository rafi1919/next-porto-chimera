"use client"
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import BannerSection from "./BannerSection";
import LatestProjectSection from "./LatestProjectSection";
// import ServiceSection from "./ServiceSeection";
import ContactSection from "./ContactSection";
import AboutSection from "./AboutSection";
// import AboutMidSection from  "./AboutMidSection";
import HistoryPortoSection from "./HistoryPortoSection";

import MotoSection from "./MotoSection";
// import GameSection from "./GameSection";

const SECTIONS = [
    { id: "banner", label: "Banner", content: <BannerSection /> },
    { id: "about", label: "About", content: <AboutSection /> },
    { id: "projects", label: "Latest Project", content: <LatestProjectSection /> },
    // { id: "about-mid", label: "About Mid", content: <AboutMidSection /> },
    // { id: "services", label: "Services", content: <ServiceSection /> },
    { id: "moto", label: "Moto", content: <MotoSection /> },
    { id: "history", label: "History", content: <HistoryPortoSection /> },
    { id: "contact", label: "Contact", content: <ContactSection /> },
    // { id: "game", label: "Game", content: <GameSection /> },
];

export default function ContentSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);
    const lenis = useLenis();

    // Whichever section crosses the middle of the viewport owns the rail. One observer
    // for all of them beats measuring positions on every scroll frame.
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    const i = sectionRefs.current.indexOf(entry.target as HTMLElement);
                    if (i >= 0) setActiveIndex(i);
                }
            },
            { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
        );
        sectionRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const jumpTo = (i: number) => {
        const el = sectionRefs.current[i];
        if (!el) return;
        // Lenis owns window scroll; a native scrollIntoView would fight it.
        if (lenis) lenis.scrollTo(el);
        else el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="relative">
            <nav
                aria-label="Section shortcuts"
                className="fixed lg:right-7 md:right-4 right-1 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-4"
            >
                {SECTIONS.map((section, index) => (
                    <button
                        key={section.id}
                        aria-label={`Go to ${section.label}`}
                        aria-current={activeIndex === index}
                        onClick={() => jumpTo(index)}
                        className={`w-2 cursor-pointer rounded-full transition-[height,background-color] duration-300 ease-out ${
                            activeIndex === index ? "h-10 bg-blue-500" : "h-5 bg-gray-500 hover:bg-gray-400"
                        }`}
                    />
                ))}
            </nav>

            {SECTIONS.map((section, index) => (
                <section
                    key={section.id}
                    id={section.id}
                    ref={(el) => { sectionRefs.current[index] = el; }}
                    aria-label={section.label}
                >
                    {section.content}
                </section>
            ))}
        </div>
    );
}
