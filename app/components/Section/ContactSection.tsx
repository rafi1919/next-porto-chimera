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
const CARD_COLUMN = ["col-start-1", "col-start-2", "col-start-3"];

export default function ContactSection() {
    const reduceMotion = useReducedMotion();

    return(
        <div id="contact-section" className="grid grid-cols-3 grid-rows-5 w-full h-full gap-4 p-4">  
            <div className="relative bg-diamond-800 rounded-2xl col-start-1 col-span-3 row-start-1 row-span-3 overflow-hidden">
                {/* Right half, cover — overflow bleeds off the edges and the
                    panel's overflow-hidden crops it. */}
                <div aria-hidden className="pointer-events-none absolute inset-y-0 -right-[200px] w-1/2">
                    <Lottie
                        src="/lottie/hud_globe.json"
                        loop
                        autoplay={!reduceMotion}
                        rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
                        aria-hidden
                        className="h-full w-full"
                    />
                </div>

                 <div className="relative bg-diamond-800/0 rounded-[2rem] col-start-1 col-span-3 row-start-1 row-span-3">
                        <Notch corner="tl" className="pb-4 pr-8">
                            <h2 className="text-4xl font-extrabold uppercase leading-[0.9] tracking-tighter text-diamond-black">
                                Contact
                            </h2>
                        </Notch>
                 </div>
            </div>
            {ContactData.map((contact, index) => (
                <div
                    key={contact.type}
                    className={`relative overflow-hidden bg-diamond-800 rounded-2xl col-span-1 row-start-4 row-span-2 ${CARD_COLUMN[index]}`}
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
            <div className="relative z-10 flex items-start justify-between p-6">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-diamond-100/60">
                    {data.url ?? (isExternal ? "Link" : "Contact")}
                </p>
                <span className="flex size-11 items-center justify-center rounded-full border border-diamond-100/30 text-diamond-50 transition-colors duration-300 group-hover:border-diamond-50 group-hover:bg-diamond-50 group-hover:text-diamond-900">
                    <Arrow className="size-4 -rotate-45 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
                </span>
            </div>

            {/* Value: pinned bottom-left */}
            <p className="absolute inset-x-0 bottom-0 z-10 max-w-[80%] break-words p-6 text-2xl font-bold leading-tight tracking-tight text-diamond-50 sm:text-3xl">
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-bottom bg-no-repeat pb-1 transition-[background-size] duration-300 group-hover:bg-[length:100%_2px]">
                    {data.value}
                </span>
            </p>
        </a>
    );
};

