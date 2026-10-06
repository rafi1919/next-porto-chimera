import Seperator from "./Seperator";
import DateCounter from "./DateCounter";




export default function Footer() {

    return (
        <footer className="fixed inset-x-0 bottom-0 z-40 min-h-0 min-w-0 h-24 p-4 flex items-center justify-between bg-background text-diamond-900 border-t-10 border-diamond-900">
            <DateCounter   />
            <Seperator mode="vertical" weight="thick" backgroundColor="bg-diamond-900" className="mx-4" />
            <p className="hidden max-w-[60ch] text-sm text-diamond-900 md:block">Portofolio inspired from game Zenless Zone Zero with a touch or pinterest style future/urban design. Need some work later, design still have many inconsistent. i cant do design very well so it takes time, like a lot haha.</p>
            <span
                aria-hidden
                className="ml-4 block h-12 w-96 shrink-0 bg-diamond-900 [mask:repeating-linear-gradient(115deg,#000_0_42px,#0000_42px_52px)]"
            />

        </footer>
    );
}