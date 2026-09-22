import { useEffect, useState } from "react";
import { FiAlertTriangle, FiCheckCircle, FiInfo, FiTrash2, FiX } from "react-icons/fi";

// Maps a semantic variant to icon, icon colors, and confirm-button colors.
// `variant` is optional — if omitted, it's inferred from rightLabel so
// existing calls like <ConfirmDialog rightLabel="Delete" .../> still work
// without changes.
const VARIANTS = {
    danger: {
        Icon: FiTrash2,
        iconWrap: "bg-red-50 text-red-600",
        confirmBtn: "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500",
    },
    warning: {
        Icon: FiAlertTriangle,
        iconWrap: "bg-yellow-50 text-yellow-600",
        confirmBtn: "bg-yellow-500 hover:bg-yellow-600 focus-visible:ring-yellow-400",
    },
    success: {
        Icon: FiCheckCircle,
        iconWrap: "bg-green-50 text-green-600",
        confirmBtn: "bg-green-600 hover:bg-green-700 focus-visible:ring-green-500",
    },
    info: {
        Icon: FiInfo,
        iconWrap: "bg-blue-50 text-blue-600",
        confirmBtn: "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500",
    },
};

const inferVariant = (rightLabel) => {
    const label = (rightLabel || "").toLowerCase();
    if (label.includes("delete") || label.includes("remove")) return "danger";
    if (label.includes("convert") || label.includes("confirm")) return "success";
    if (label.includes("warn")) return "warning";
    return "info";
};

export function ConfirmDialog({
    title,
    message,
    leftLabel = "Cancel",
    rightLabel = "Delete",
    variant,
    onCancel,
    onConfirm,
}) {
    const resolvedVariant = VARIANTS[variant] ? variant : inferVariant(rightLabel);
    const { Icon, iconWrap, confirmBtn } = VARIANTS[resolvedVariant];

    // Small mount-in animation — no tailwind.config keyframes needed,
    // just a transition triggered a tick after mount.
    const [entered, setEntered] = useState(false);
    useEffect(() => {
        const raf = requestAnimationFrame(() => setEntered(true));
        return () => cancelAnimationFrame(raf);
    }, []);

    // Escape key closes the dialog, same as clicking Cancel.
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onCancel?.();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onCancel]);

    return (
        <div
            className={`
                fixed inset-0 z-50 flex items-center justify-center p-4
                bg-black/50 backdrop-blur-[2px]
                transition-opacity duration-200
                ${entered ? "opacity-100" : "opacity-0"}
            `}
            onClick={onCancel}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`
                    relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5
                    transition-all duration-200 ease-out
                    ${entered ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0"}
                `}
            >
                {/* Close (X) */}
                <button
                    onClick={onCancel}
                    aria-label="Close"
                    className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                >
                    <FiX size={16} />
                </button>

                <div className=" flex w-full items-center justify-baseline gap-5">

                    {/* Icon */}
                    <div className={` flex h-11 w-11 items-center justify-center rounded-full ${iconWrap}`}>
                        <Icon size={20} />
                    </div>

                    {/* Copy */}
                    <h2 className="pr-6 text-base font-semibold text-gray-900">{title}</h2>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{message}</p>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                    >
                        {leftLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        autoFocus
                        className={`
                            rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm
                            transition hover:shadow-md
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                            ${confirmBtn}
                        `}
                    >
                        {rightLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}