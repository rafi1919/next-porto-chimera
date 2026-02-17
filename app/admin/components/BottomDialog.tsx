import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export function BottomDialog({ children, openDetail, handleCloseDetail }: { children: React.ReactNode; openDetail: boolean; handleCloseDetail: () => void }) {
    return (
        <motion.div
            initial={{ y: "100%" }}
            animate={openDetail ? { y: 0 } : { y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed h-[85vh] rounded-t-md bg-zinc-200 w-full bottom-0 p-4 text-white">
            <button className="bg-[#222222] p-5 rounded-md cursor-pointer" onClick={handleCloseDetail}>
                <Icon icon="mdi:close" className="text-[25px]" />
            </button>
            <div className="py-4">
                {children}
            </div>
        </motion.div>
    );
}