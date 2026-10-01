interface SeperatorProps {
    mode?: "horizontal" | "vertical";
    backgroundColor?: string;
    weight?: "thin" | "thick";
    className?: string;
}

// ponytail: static maps, not template strings — Tailwind only scans literal class names
const SIZE = {
    horizontal: { thin: "w-full h-px", thick: "w-full h-0.5" },
    vertical: { thin: "h-full w-px", thick: "h-full w-0.5" },
};

export default function Seperator({
    mode = "horizontal",
    backgroundColor = "bg-diamond-900",
    weight = "thin",
    className = "",
}: SeperatorProps) {
    return (
        <div
            role="separator"
            aria-orientation={mode}
            className={`shrink-0 ${SIZE[mode][weight]} ${backgroundColor} ${className}`}
        />
    );
}
