import Image from "next/image";
import Profile from "./Profile";

export default function Navbar() {
    return (
        <nav className="bg-diamond-900 flex items-center justify-between text-white p-4 max-h-24">
            <Profile />

            <div className="flex justify-end items-center space-x-4 w-40 border-white border-2 rounded-full p-2">
                <p>1000</p>
                <Image src="/icon/hud-coin.svg" alt="" aria-hidden width={111} height={111} className="size-6 shrink-0" />
            </div>

        </nav>
    );
}