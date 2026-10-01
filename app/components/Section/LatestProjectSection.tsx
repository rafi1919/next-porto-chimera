import StackBadge from "../StackBadge";

export default function LatestProjectSection() {

    return (
        <div id="latest-project" className="flex flex-col items-center justify-center gap-4">
                <h1>Latest Project</h1>

            <div className="flex gap-10">
                <div className="grid max-w-xl grid-rows-[auto_1fr_auto] gap-6">
                    <h2 className="bg-linear-to-br from-diamond-400 via-diamond-600 to-diamond-900 bg-clip-text pb-1 text-4xl font-bold leading-tight text-transparent sm:text-5xl lg:text-6xl">
                        Cavos Landing Page
                    </h2>
                    <p className="text-lg leading-relaxed text-diamond-900/70">
                        A modern landing page for the Cavos project.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <StackBadge stack="nextjs" />
                        <StackBadge stack="typescript" />
                        <StackBadge stack="tailwind" />
                        <StackBadge stack="laravel" />
                    </div>
                </div>
                <LatestProjectCard/>
            </div>
        </div>
    );
}


const LatestProjectCard=()=>{
    return(
         <div className="flex">
                <div className="flex w-250 h-100 rounded-2xl bg-[url(/3.svg)] bg-cover bg-center">
                    <div className="bg-diamond-900 h-full w-20 ml-auto rounded-r-2xl"></div>
                </div>
                 <div className="w-30 h-100 bg-diamond-900 rounded-2xl">

                </div>
            </div>
    )
}