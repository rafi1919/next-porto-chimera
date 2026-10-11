import type { CSSProperties } from "react";
import Link from "next/link";
import { Arrow } from "./Arrow";


const NOTCH = `radial-gradient(var(--notch) at calc(100% - var(--stub)) 0, #0000 97%, #000) top / 100% 51% no-repeat,
radial-gradient(var(--notch) at calc(100% - var(--stub)) 100%, #0000 97%, #000) bottom / 100% 51% no-repeat`;

const ticketStyle = {
    "--stub": "7rem",
    "--notch": "14px",
    WebkitMask: NOTCH,
    mask: NOTCH,
} as CSSProperties;

const pad = (n: number) => String(n).padStart(2, "0");

interface MoreProjectsCardProps {
    href: string;
    count: number;
    focusable: boolean;
}

export default function MoreProjectsCard({ href, count, focusable }: MoreProjectsCardProps) {
    return (
        <Link href={href} tabIndex={focusable ? 0 : -1} className="group block h-full w-full outline-none">
            <div
                style={ticketStyle}
                className="relative flex h-full min-h-72 overflow-hidden bg-diamond-700 text-diamond-50 transition-colors duration-300 group-hover:bg-diamond-600 group-focus-visible:bg-diamond-600 [clip-path:polygon(24px_0,100%_0,100%_calc(100%-24px),calc(100%-24px)_100%,0_100%,0_24px)]"
            >
                {/* Halftone dots, fading out toward the stub: ties it to the clouds / logos */}
                <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(circle,rgb(255_255_255/0.16)_1.6px,transparent_2.2px)] bg-size-[14px_14px] [mask:linear-gradient(to_right,transparent,#000_80%)]"
                />

                {/* HUD corner brackets */}
                <span aria-hidden className="absolute left-7 top-7 size-4 border-l-2 border-t-2 border-diamond-100/60" />
                <span aria-hidden className="absolute bottom-4 left-4 size-4 border-b-2 border-l-2 border-diamond-100/60" />

                {/* Main */}
                <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-between p-8 sm:p-10">
                    <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-diamond-100/70">
                        <span aria-hidden className="h-px w-8 bg-diamond-100/70" />
                        Archive
                    </p>

                    <h3 className="text-[clamp(2rem,5vw,4.25rem)] font-extrabold leading-[0.9] tracking-tighter">
                        View more
                        <br />
                        projects
                    </h3>

                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-diamond-100/60">
                        {pad(count)} shown · see them all
                    </p>
                </div>

                {/* Perforation */}
                <div aria-hidden className="my-6 w-0 self-stretch border-l-2 border-dashed border-diamond-100/30" />

                {/* Stub */}
                <aside className="relative z-10 flex w-(--stub) shrink-0 flex-col items-center justify-between gap-3 px-3 py-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-diamond-100/60">Go</span>

                    <span className="rotate-180 font-mono text-4xl font-extrabold tracking-[0.15em] [writing-mode:vertical-rl]">
                        ALL
                    </span>

                    <span
                        aria-hidden
                        className="block h-4 w-full bg-diamond-100/70 [mask:repeating-linear-gradient(115deg,#000_0_8px,#0000_8px_16px)]"
                    />

                    <span className="flex size-11 items-center justify-center rounded-full border border-diamond-100/40 transition-colors duration-300 group-hover:border-diamond-50 group-hover:bg-diamond-50 group-hover:text-diamond-900">
                        <Arrow className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5" />
                    </span>
                </aside>
            </div>
        </Link>
    );
}
