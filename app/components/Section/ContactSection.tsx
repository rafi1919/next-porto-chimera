"use client";
import { Lottie } from "lottie-react";
import { useReducedMotion } from "framer-motion";
import { Notch } from "../Notch";

interface ContactProps {
    type: "instagram" | "linkedin" | "email";
    value: string;
    logo: string;
    url?: string;
}

const ContactData: ContactProps[]=[
    {
        type:"instagram",
        value:"@ralfiantz",
        logo:"/icon/instagram-halftone.svg",
        url: "https://www.instagram.com/ralfiantz/"
    },
    {
        type:"linkedin",
        value:"Rafi Alifianto",
        logo:"/icon/linkedin-halftone.svg",
        url: "https://www.linkedin.com/in/rafi-alifianto-818877245/"
    },
    {
        type:"email",
        value:"rafionwork44@gmail.com",
        logo:"/icon/gmail-halftone.svg",
        url: "mailto:rafionwork44@gmail.com"
    }
]

// ponytail: static strings — Tailwind can't see a class built as `col-start-${i}`
// Only from md: below that every card is its own row in a single column.
const CARD_COLUMN = ["md:col-start-1", "md:col-start-2", "md:col-start-3"];

export default function ContactSection() {
    const reduceMotion = useReducedMotion();

    return(
        <div id="contact-section" className="grid w-full min-h-(--stage) grid-cols-1 gap-4 p-4 md:grid-cols-3 md:grid-rows-5">
            <div className="relative min-h-56 overflow-hidden rounded-2xl bg-diamond-800 md:col-start-1 md:col-span-3 md:row-start-1 md:row-span-3 md:min-h-0">
                {/* Right half, cover — overflow bleeds off the edges and the
                    panel's overflow-hidden crops it. The desktop offset is wider than a
                    phone panel, so the globe would sit entirely off-screen. */}
                <div aria-hidden className="pointer-events-none absolute inset-y-0 -right-16 w-2/3 md:-right-[200px] md:w-1/2">
                    <Lottie
                        src="/lottie/hud_globe.json"
                        loop
                        autoplay={!reduceMotion}
                        rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
                        aria-hidden
                        className="h-full w-full"
                    />
                </div>

                 <div className="relative">
                        {/* rounded-tl matches the panel's own rounded-2xl: the panel clips
                            with overflow-hidden, so a square notch corner shows a navy nub
                            through it. The inner radius shrinks with the panel on mobile. */}
                        <Notch
                            corner="tl"
                            className="rounded-tl-2xl [--notch-radius:1.25rem] pb-3 pl-4 pr-6 pt-3 sm:[--notch-radius:2rem] sm:pb-4 sm:pl-6 sm:pr-8 sm:pt-4"
                        >
                            <h2 className="text-3xl font-extrabold uppercase leading-[0.9] tracking-tighter text-diamond-black sm:text-4xl">
                                Contact
                            </h2>
                        </Notch>
                 </div>
            </div>
            {ContactData.map((contact, index) => (
                <div
                    key={contact.type}
                    className={`relative overflow-hidden rounded-2xl bg-diamond-800 md:col-span-1 md:row-start-4 md:row-span-2 ${CARD_COLUMN[index]}`}
                >
                    <ContactCard data={contact} />
                </div>
            ))}
        </div>
    )
}

import { Arrow } from "../Arrow";


const ContactCard = ({ data }: { data: ContactProps }) => {
    const isExternal = data.url?.startsWith("http");

    const mask = {
        WebkitMaskImage: `url(${data.logo})`,
        maskImage: `url(${data.logo})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
    } as const;

    return (
        <a
            href={data.url}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="group relative block h-full min-h-48 w-full overflow-hidden  bg-diamond-800 perspective-[800px] transition-colors duration-300 hover:bg-diamond-700 focus-visible:bg-diamond-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-diamond-400"
        >
            <div aria-hidden className="absolute -right-[15%] top-1/2 aspect-square h-[125%] -translate-y-1/2">
                <div className="size-full -rotate-y-25 transition-transform duration-500 ease-out motion-reduce:transition-none motion-safe:group-hover:-rotate-y-6 motion-safe:group-hover:scale-105">
                    <div
                        style={mask}
                        className="size-full bg-diamond-600 transition-colors duration-300 group-hover:bg-diamond-400"
                    />
                </div>
            </div>

            <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-diamond-800 via-diamond-800/70 to-transparent transition-opacity duration-300 group-hover:opacity-0"
            />

            <span aria-hidden className="absolute left-5 top-5 size-3 border-l-2 border-t-2 border-diamond-100/0 transition-colors duration-300 group-hover:border-diamond-100/70" />
            <span aria-hidden className="absolute bottom-5 right-5 size-3 border-b-2 border-r-2 border-diamond-100/0 transition-colors duration-300 group-hover:border-diamond-100/70" />

            {/* Top row: label + link arrow */}
            <div className="relative z-10 flex items-start justify-between p-4 sm:p-6">
                <p className="min-w-0 break-all font-mono text-[10px] uppercase tracking-[0.2em] text-diamond-100/60 sm:text-xs sm:tracking-[0.3em]">
                    {data.url ?? (isExternal ? "Link" : "Contact")}
                </p>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-diamond-100/30 text-diamond-50 transition-colors duration-300 group-hover:border-diamond-50 group-hover:bg-diamond-50 group-hover:text-diamond-900 sm:size-11">
                    <Arrow className="size-4 -rotate-45 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
                </span>
            </div>

            {/* Value: pinned bottom-left */}
            <p className="absolute inset-x-0 bottom-0 z-10 max-w-[80%] break-words p-4 text-xl font-bold leading-tight tracking-tight text-diamond-50 sm:p-6 sm:text-2xl md:text-3xl">
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-bottom bg-no-repeat pb-1 transition-[background-size] duration-300 group-hover:bg-[length:100%_2px]">
                    {data.value}
                </span>
            </p>
        </a>
    );
};

