// ponytail: static maps, not template strings — Tailwind only scans literal class names
const VARIANTS = {
    diamond:
        "from-diamond-100 via-diamond-300 to-diamond-200",

    cyan:
        "from-cyan-100 via-cyan-300 to-sky-200",

    blue:
        "from-sky-100 via-blue-300 to-indigo-200",

    sky:
        "from-sky-100 via-cyan-200 to-blue-200",

    indigo:
        "from-blue-100 via-indigo-300 to-violet-200",

    violet:
        "from-violet-100 via-purple-200 to-indigo-300",

    emerald:
        "from-teal-100 via-emerald-300 to-green-200",

    green:
        "from-green-100 via-emerald-300 to-teal-200",

    teal:
        "from-cyan-100 via-teal-300 to-emerald-200",

    yellow:
        "from-yellow-100 via-amber-200 to-orange-200",

    amber:
        "from-amber-100 via-orange-200 to-yellow-200",

    red:
        "from-red-100 via-rose-200 to-orange-200",

    zinc:
        "from-zinc-100 via-slate-200 to-zinc-300",

    // The odd one out: every other variant is a pale gradient read with dark ink.
    // This one is the fallback for an unrecognised stack key, so it inverts.
    black:
        "from-diamond-950 via-diamond-black to-diamond-950",
}  as const;

export type BadgeVariant = keyof typeof VARIANTS;

// Which variants need light ink. A set beats adding a flag to all thirteen.
const INVERTED = new Set<BadgeVariant>(["black"]);

interface BadgeProps {
    text: string;
    variant?: BadgeVariant;
    className?: string;
}

export default function Badge({
    text,
    variant = "diamond",
    className = "",
}: BadgeProps) {
    // Ink is never inherited: every variant is a fixed gradient, so leaving the colour
    // to the parent is how these ended up near-white on cyan-100 inside ProjectOverlay.
    const ink = INVERTED.has(variant) ? "text-diamond-50" : "text-diamond-900";

    return (
        <span
            className={`inline-flex h-fit w-fit items-center whitespace-nowrap rounded-full border bg-linear-to-br px-2 py-px text-xs font-bold sm:px-2.5 sm:py-0.5 ${ink} ${VARIANTS[variant]} ${className}`}
        >
            {text}
        </span>
    );
}