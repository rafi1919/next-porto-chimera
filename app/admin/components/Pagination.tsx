import { PaginationMeta } from "../hooks/AdminType";
import { Icon } from "@iconify/react";
interface PaginationProps {
    meta?: PaginationMeta;
    page: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ meta, page, onPageChange }: PaginationProps) {
    if (!meta || meta.filtered_total <= 12) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
            >
                <Icon icon="mdi:chevron-left" className="text-[25px]" />
            </button>
            <span className="px-4 py-2">
                Page {meta.current_page} of {meta.last_page}
            </span>
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === meta.last_page}
                className="px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
            >
                <Icon icon="mdi:chevron-right" className="text-[25px] " />
            </button>
        </div>
    );
}