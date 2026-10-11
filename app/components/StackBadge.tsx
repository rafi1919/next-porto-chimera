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
    angular:    { label: "Angular",    variant: "red" },
    // Nuxt #00DC82 shares Vue's emerald — it is Vue underneath.
    nuxt:       { label: "Nuxt",       variant: "emerald" },
    wordpress:  { label: "WordPress",  variant: "sky" },
} as const satisfies Record<string, { label: string; variant: BadgeVariant }>;

export type Stack = keyof typeof STACKS;

// The prop type says this can't miss, but project_data.json is cast rather than parsed,
// so an unlisted key does reach here at runtime — and destructuring undefined threw,
// taking the whole carousel down. Unknown keys render black with the raw string as the
// label, so a typo is visible on the page instead of being silently dropped.
const FALLBACK = { label: "", variant: "black" } as const;

export default function StackBadge({ stack, className }: { stack: Stack; className?: string }) {
    const { label, variant } = STACKS[stack] ?? { ...FALLBACK, label: String(stack) };
    return <Badge text={label} variant={variant} className={className} />;
}
