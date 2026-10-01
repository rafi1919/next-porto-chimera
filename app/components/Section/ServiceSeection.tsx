import { SciFiToggle } from "../SciFiToggle";


interface Service {
    title: string;
    description: string;
    number: number;
}

const SERVICES: Service[] = [
    {
        title: "Landing Page",
        description: "Dynamic, playful, memorable.",
        number: 1
    },
    {
        title: "Web Application",
        description: "Dashboards, auth, and data that scales.",
        number: 2
    },
    {
        title: "API & Backend",
        description: "Fast endpoints, clean contracts, boring reliability.",
        number: 3
    },
    {
        title: "UI/UX Design",
        description: "Wireframe to pixel, built to ship.",
        number: 4
    },
    {
        title: "Performance Audit",
        description: "Find the slow, kill the slow.",
        number: 5
    },
    {
        title: "Maintenance",
        description: "Updates, monitoring, and fixes before you notice.",
        number: 6
    }
]

export default function ServiceSection() {
    return (
         <div className="grid-cols-8 grid gap-6 w-full">
            <div className="col-span-2">
                <div className="w-fit grid gap-24 bg-[#1a1a1a] p-4 rounded-2xl">
                    <div className="flex flex-col gap-8 ">
                        {SERVICES.slice(0, 3).map((service) => (
                            <div key={service.number} className="items-center gap-6">
                                <div className="col-span-2 flex justify-center">
                                    <SciFiToggle number={service.number} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-8">
                        {SERVICES.slice(3, 6).map((service) => (
                            <div key={service.number} className="items-center gap-6">
                                <div className="col-span-2 flex justify-center">
                                    <SciFiToggle number={service.number} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="col-span-6">

            </div>

        </div>
        
    )
}
