'use client';
import { Icon } from "@iconify/react";

const BannerSection = () => {
    const handleScroll = () => {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    };

    return (
        <div className="bg-black h-screen relative flex flex-col items-center justify-center">
            <h1 className="absolute top-4 left-4 text-xl text-white font-bold">Rainoutside</h1>
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-white text-4xl font-bold tracking-tight">Lets Play yeah ?</h2>
                <Icon
                    icon="mdi:arrow-bottom"
                    className="text-white text-2xl animate-bounce cursor-pointer"
                    onClick={handleScroll}
                />
            </div>
        </div>
    );
};

export default BannerSection;
