import Seperator from "./Seperator";
import DateCounter from "./DateCounter";




export default function Footer() {

    return (
        <footer className="w-full min-h-0 min-w-0 h-24 p-4 flex items-center justify-between bg-background text-diamond-900 border-t-10 border-diamond-900">
            <DateCounter   />
            <Seperator mode="vertical" weight="thick" backgroundColor="bg-diamond-900" className="mx-4" />
            <p className="text-xs text-diamond-900">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis iste quo vitae architecto ullam magnam cum, distinctio voluptate quas veritatis rerum exercitationem quaerat ex asperiores sed earum laboriosam in doloremque.</p>
            <span
                aria-hidden
                className="block h-12 aspect-[500/49] shrink-0 bg-diamond-900 [mask:url(/icon/hud-line.svg)_center/contain_no-repeat]"
            />

        </footer>
    );
}