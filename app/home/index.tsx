"use client";
import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ContentSection from "../components/Section/ContentSection";


export default function Home() {
    const [activeSection, setActiveSection] = useState("Banner");
    const showNavbar = activeSection === "Game";

    return (
        <div
            className={`grid min-h-dvh ${
                showNavbar ? "grid-rows-[auto_1fr_auto]" : "grid-rows-[1fr_auto]"
            }`}
        >
            {showNavbar && <Navbar />}
            <ContentSection onSectionChange={setActiveSection} />
            <Footer />
        </div>
    );
}
