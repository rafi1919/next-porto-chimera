import type { CSSProperties, ReactNode } from "react";

// Must match the page background so the notch reads as "empty page".
// The var comes from your Tailwind v4 theme; the hex is only a fallback.
export const PAGE = "var(--color-diamond-50, #f0f8f7)";

interface NotchProps {
    /** Which top corner of the parent the notch cuts out. Parent must be `relative`. */
    corner?: "tl" | "tr";
    /** Radius of the notch's inner corner. The two edge shims use the same size. */
    radius?: string;
    className?: string;
    children?: ReactNode;
}

/**
 * Inverted-radius notch: a page-colored block in the corner of a card,
 * plus two shims that round the corners where the card wraps around it.
 * Size it with className (w-*, h-*, padding), or let the content size it.
 */
export function Notch({ corner = "tl", radius = "2rem", className = "", children }: NotchProps) {
    const left = corner === "tl";

    const shim: CSSProperties = {
        width: radius,
        height: radius,
        background: `radial-gradient(circle at ${left ? "100%" : "0%"} 100%, transparent ${radius}, ${PAGE} calc(${radius} + 1px))`,
    };

    return (
        <div
            className={`absolute top-0 z-20 ${left ? "left-0" : "right-0"} ${className}`}
            style={{
                background: PAGE,
                borderBottomRightRadius: left ? radius : undefined,
                borderBottomLeftRadius: left ? undefined : radius,
            }}
        >
            {children}
            {/* card edge beside the notch */}
            <span aria-hidden className={`absolute top-0 ${left ? "left-full" : "right-full"}`} style={shim} />
            {/* card edge below the notch */}
            <span aria-hidden className={`absolute top-full ${left ? "left-0" : "right-0"}`} style={shim} />
        </div>
    );
}