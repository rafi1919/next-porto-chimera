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
}  as const;

export type BadgeVariant = keyof typeof VARIANTS;

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
    return (
        <span
            className={`inline-flex h-fit w-fit items-center whitespace-nowrap rounded-full border bg-linear-to-br px-2 py-px text-xs font-bold text-diamond-900 sm:px-2.5 sm:py-0.5 ${VARIANTS[variant]} ${className}`}
        >
            {text}
        </span>
    );
}