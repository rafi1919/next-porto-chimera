import Badge, { type BadgeVariant } from "./Badge";

// Nearest stock Tailwind hue to each brand color — React #61DAFB ≈ cyan,
// Vue #42B883 ≈ emerald, TS #3178C6 ≈ blue.
const STACKS = {
    react:      { label: "React",      variant: "cyan" },
    nextjs:     { label: "Next.js",    variant: "zinc" },
    typescript: { label: "TypeScript", variant: "blue" },
    javascript: { label: "JavaScript", variant: "yellow" },
    vue:        { label: "Vue",        variant: "emerald" },
    go:         { label: "Go",         variant: "sky" },
    node:       { label: "Node.js",    variant: "green" },
    python:     { label: "Python",     variant: "amber" },
    laravel:    { label: "Laravel",    variant: "red" },
    php:        { label: "PHP",        variant: "violet" },
    tailwind:   { label: "Tailwind",   variant: "teal" },
    postgres:   { label: "PostgreSQL", variant: "indigo" },
} as const satisfies Record<string, { label: string; variant: BadgeVariant }>;

export type Stack = keyof typeof STACKS;

export default function StackBadge({ stack, className }: { stack: Stack; className?: string }) {
    const { label, variant } = STACKS[stack];
    return <Badge text={label} variant={variant} className={className} />;
}
