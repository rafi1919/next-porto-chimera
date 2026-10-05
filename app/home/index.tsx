"use client";
import type { CSSProperties } from "react";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";
import Footer from "../components/Footer";
import ContentSection from "../components/Section/ContentSection";

const FOOTER = "6rem"; // Footer is h-24

export default function Home() {
    const reduceMotion = useReducedMotion();

    return (

        <ReactLenis
            root
            options={{
                smoothWheel: !reduceMotion,
                lerp: 0.1,
                wheelMultiplier: 1,
                touchMultiplier: 1.2,
            }}
        >
            <div
                style={{ "--stage": `calc(100dvh - ${FOOTER})` } as CSSProperties}
                className="pb-24"
            >
                <ContentSection />
            </div>
            <Footer />
        </ReactLenis>
    );
}
