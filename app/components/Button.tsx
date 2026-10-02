import type { MouseEvent } from "react";
import { Arrow } from "./Arrow";

interface ButtonProps {
    text: string;
    /** When set, renders an <a> instead of a <button>. */
    href?: string;
    onClick?: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    className?: string;
}

const base =
    "group inline-flex w-fit items-center cursor-pointer gap-3 bg-diamond-900 py-3 pl-6 pr-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-diamond-50 transition-colors [clip-path:polygon(0_0,calc(100%-14px)_0,100%_14px,100%_100%,0_100%)]";

export function Button({
    text,
    href,
    onClick,
    isLoading = false,
    disabled = false,
    type = "button",
    className = "",
}: ButtonProps) {
    const inactive = disabled || isLoading;

    const classes = [
        base,
        inactive
            ? isLoading
                ? "cursor-wait opacity-80"
                : "cursor-not-allowed opacity-50"
            : "hover:bg-diamond-700 focus-visible:bg-diamond-700",
        className,
    ].join(" ");

    const content = (
        <>
            {text}
            {isLoading ? (
                <Spinner className="size-4" />
            ) : (
                <Arrow className="size-4 transition-transform group-hover:translate-x-1 group-aria-disabled:translate-x-0 group-disabled:translate-x-0" />
            )}
        </>
    );

    if (href) {
        const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
            if (inactive) return e.preventDefault();
            onClick?.();
        };
        return (
            <a
                href={inactive ? undefined : href}
                onClick={handleClick}
                aria-disabled={inactive || undefined}
                aria-busy={isLoading || undefined}
                tabIndex={inactive ? -1 : undefined}
                className={classes}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={inactive}
            aria-busy={isLoading || undefined}
            className={classes}
        >
            {content}
        </button>
    );
}

function Spinner({ className }: { className?: string }) {
    return (
        <svg aria-hidden viewBox="0 0 24 24" fill="none" className={`motion-safe:animate-spin ${className ?? ""}`}>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
        </svg>
    );
}