export function Arrow({ className }: { className?: string }) {
    return (
        <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="square"
            className={className}
        >
            <path d="M4 12h16M14 6l6 6-6 6" />
        </svg>
    );
}