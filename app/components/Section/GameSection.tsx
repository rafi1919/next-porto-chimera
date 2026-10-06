import type { ReactNode } from "react";

const CARD = "relative rounded-[2rem] bg-diamond-700";

const Tag = ({ n }: { n: number }) => (
    <span className="absolute bottom-4 left-6 font-mono text-label uppercase text-diamond-100/80">
        Game {String(n).padStart(2, "0")}
    </span>
);

export default function GameSection() {
    return (
        <div id="game-section" className="mx-auto w-full p-10 lg:min-h-(--stage)">
            <div className="grid grid-cols-1 gap-3 lg:h-full lg:grid-cols-8 lg:grid-rows-8">

                {/* A: top-left */}
                <div className="lg:col-start-1 lg:col-span-3 lg:row-start-1 lg:row-span-2">
                    <h2 className="max-w-xl">
                        Game Section
                    </h2>

                </div> 

                {/* B: bottom-left */}
                <Card className=" lg:col-start-1 lg:col-span-3 lg:row-start-3 lg:row-span-6">
                    <Tag n={1} />
                </Card>

                {/* D: middle, full height */}
                <Card className=" lg:col-start-4 lg:col-span-3 lg:row-start-1 lg:row-span-3">
                    <Tag n={2} />
                </Card>
                  <Card className=" lg:col-start-4 lg:col-span-3 lg:row-start-4 lg:row-span-5">
                    <Tag n={3} />
                </Card>

                {/* E: right, full height, L-shaped. The small card F sits inside its notch. */}
                <Card className="lg:col-start-7 lg:col-span-2 lg:row-start-1 lg:row-span-8">
                    <Tag n={4} />
                </Card>
            </div>
        </div>
    );
}

const Card = ({ className = "", children }: { className?: string; children?: ReactNode }) => (
    <div className={`${CARD} ${className} cursor-pointer`}>{children}</div>
);