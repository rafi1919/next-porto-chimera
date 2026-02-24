import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DialogProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
};

export function Dialog({ isOpen, onClose, children }: DialogProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <motion.div
                        className="absolute inset-0 bg-black/60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="relative z-10 bg-[#1a1a1a] rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4"
                        initial={{ opacity: 0, scale: 0.9, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 16 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
