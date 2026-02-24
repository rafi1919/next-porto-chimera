import { Dialog } from "./Dialog";

type ConfirmDeleteDialogProps = {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
};

export function ConfirmDeleteDialog({
    isOpen,
    onCancel,
    onConfirm,
    title = "Delete",
    message = "Are you sure you want to delete this item? This action cannot be undone.",
}: ConfirmDeleteDialogProps) {
    return (
        <Dialog isOpen={isOpen} onClose={onCancel}>
            <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
            <p className="text-zinc-400 text-sm mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-md border border-zinc-600 text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                >
                    Delete
                </button>
            </div>
        </Dialog>
    );
}
