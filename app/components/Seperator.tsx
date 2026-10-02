interface SeperatorProps {
    mode: "horizontal" | "vertical";
    backgroundColor?: string;
    weight?: "thin" | "thick";
    className?: string;
}

// ponytail: vertical uses self-stretch, not h-full — `h-full` resolves to 0
// inside a `flex items-center` parent, which is most of them.
const SIZE = {
    horizontal: { thin: "w-full h-px", thick: "w-full h-0.5" },
    vertical: { thin: "self-stretch w-px", thick: "self-stretch w-0.5" },
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
