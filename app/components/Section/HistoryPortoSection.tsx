
const historyPortoData=[{
            year: "2020",
            title: "First Project",
            description: "This was my first project, and it taught me a lot about the basics of web development.",
            img:"/images/porto1.png"
        },
        {
            year: "2020",
            title: "First Project",
            description: "This was my first project, and it taught me a lot about the basics of web development.",
            img:"/images/porto1.png"
        },
        {
            year: "2020",
            title: "First Project",
            description: "This was my first project, and it taught me a lot about the basics of web development.",
            img:"/images/porto1.png"
        }]

export default function HistoryPortoSection() {
    return(
        <div id="history" className="grid w-full min-h-(--stage) grid-cols-3 gap-4 bg-diamond-black">
            <p>My journey in the world of design and development has been a continuous process of learning, experimenting, and growing. Each project has taught me something new, and each challenge has pushed me to improve.</p>
        </div>
    )
}