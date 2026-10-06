

export default function VerticalLined() {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 max-w-7xl mx-auto right-0 hidden lg:block lg:px-10">
            <div className="relative h-full">
                <span data-line className="absolute left-1/3 top-0 w-px bg-diamond-600/40 h-full" />
                <span data-line className="absolute left-2/3 top-0 w-px bg-diamond-600/40 h-full" />
            </div>
        </div>
    );
}