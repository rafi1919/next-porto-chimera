
interface NavTagProps {
    number: string;
    text: string;
    total?: number;
}


export default function NavTag({ number, text, total= 5 }: NavTagProps) {
    return (
       <nav
            aria-label="Current section"
            className="fixed top-0 right-0 z-50 flex flex-col items-end font-mono select-none"
            >
            <div
                className="relative size-16 bg-diamond-700 flex items-center justify-center
                        [clip-path:polygon(14px_0,100%_0,100%_100%,0_100%,0_14px)]"
            >
                {/* Deliberately text-3xl, not text-readout: this sits in a size-16 box
                    and a fluid readout overflows it. Because text-3xl is a plain size
                    token it carries no weight, so this is the one readout that still
                    needs an explicit one. */}
                <span className="text-diamond-50 text-3xl font-extrabold">
                {String(number).padStart(2, "0")}
                </span>
                <span className="absolute bottom-1 right-1.5 text-label text-diamond-50/80">
                /{String(total).padStart(2, "0")}
                </span>
            </div>

            <div
                className="flex items-center gap-2 pl-4 pr-3 py-2
                        bg-diamond-black/85 backdrop-blur-md
                        border-l-2 border-diamond-700
                        [clip-path:polygon(0_0,100%_0,100%_100%,12px_100%,0_calc(100%-12px))]"
            >
                <span className="size-1.5 bg-diamond-700 animate-pulse" aria-hidden />
                <p
                    aria-live="polite"
                    className="text-diamond-50 text-label uppercase"
                >
                {text}
                </p>
            </div>
        </nav>
    )


}