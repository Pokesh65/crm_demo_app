import {
    FiRefreshCw,
    FiHome,
    FiAlertTriangle,
    FiTerminal,
} from "react-icons/fi";

export function ErrorFallback({ error, resetErrorBoundary }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary-900 px-4 overflow-hidden relative">

            {/* Ambient background glow */}
            <div className="pointer-events-none absolute inset-0">

                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07]"
                    style={{
                        background:
                            "radial-gradient(circle, var(--color-danger-500) 0%, transparent 70%)",
                    }}
                />

                <div
                    className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full opacity-[0.05]"
                    style={{
                        background:
                            "radial-gradient(circle, var(--color-accent-500) 0%, transparent 70%)",
                    }}
                />

                {/* Animated dot grid */}
                <svg
                    className="absolute inset-0 w-full h-full opacity-[0.03]"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <pattern
                            id="dots"
                            x="0"
                            y="0"
                            width="32"
                            height="32"
                            patternUnits="userSpaceOnUse"
                        >
                            <circle
                                cx="1"
                                cy="1"
                                r="1"
                                fill="white"
                            />
                        </pattern>
                    </defs>

                    <rect
                        width="100%"
                        height="100%"
                        fill="url(#dots)"
                    />
                </svg>
            </div>

            {/* Card */}
            <div
                className="relative w-full max-w-md opacity-0 animate-slide-up"
                style={{
                    animationDelay: "0.05s",
                    animationFillMode: "forwards",
                }}
            >
                {/* Glowing top border */}
                <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-danger-500/60 to-transparent" />

                <div className="rounded-2xl border border-white/8 bg-white/[0.04] backdrop-blur-xl p-8 shadow-lg">

                    {/* Error icon block */}
                    <div
                        className="flex justify-center mb-6 opacity-0 animate-scale-in"
                        style={{
                            animationDelay: "0.15s",
                            animationFillMode: "forwards",
                        }}
                    >
                        <div className="relative">

                            {/* Outer pulse ring */}
                            <div className="absolute inset-0 rounded-2xl bg-danger-500/10 animate-pulse-glow" />

                            {/* Icon box */}
                            <div className="relative w-16 h-16 rounded-xl bg-danger-500/10 border border-danger-500/25 flex items-center justify-center">
                                <FiAlertTriangle
                                    className="w-7 h-7 text-danger-500"
                                />
                            </div>

                            {/* Corner decorators */}
                            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-danger-500/40 rounded-tl" />

                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-danger-500/40 rounded-tr" />

                            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-danger-500/40 rounded-bl" />

                            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-danger-500/40 rounded-br" />
                        </div>
                    </div>

                    {/* Text */}
                    <div
                        className="text-center space-y-2 mb-6 opacity-0 animate-slide-up"
                        style={{
                            animationDelay: "0.2s",
                            animationFillMode: "forwards",
                        }}
                    >
                        {/* Status pill */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger-500/10 border border-danger-500/20 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-danger-500 animate-pulse" />

                            <span className="text-[10px] font-bold tracking-widest uppercase text-danger-500 font-sans">
                                Runtime Error
                            </span>
                        </div>

                        <h1 className="text-xl font-bold text-text-white font-heading tracking-tight">
                            Something went wrong
                        </h1>

                        <p className="text-sm text-white/40 font-sans leading-relaxed max-w-xs mx-auto">
                            The application crashed unexpectedly. You can try to
                            recover or return to the home page.
                        </p>
                    </div>

                    {/* Error detail - development only */}
                    {import.meta.env.DEV && error?.message && (
                        <div
                            className="mb-6 opacity-0 animate-slide-up"
                            style={{
                                animationDelay: "0.25s",
                                animationFillMode: "forwards",
                            }}
                        >
                            <div className="flex items-center gap-2 mb-2">

                                <FiTerminal
                                    className="w-3.5 h-3.5 text-white/25"
                                />

                                <span className="text-[10px] font-bold tracking-widest uppercase text-white/25 font-sans">
                                    Error message
                                </span>
                            </div>

                            <div className="relative rounded-xl bg-black/40 border border-danger-500/15 overflow-hidden">

                                {/* Top colour strip */}
                                <div className="h-0.5 bg-gradient-to-r from-danger-600 via-danger-500 to-danger-600 opacity-60" />

                                <pre className="p-4 text-xs text-danger-500 font-mono overflow-auto max-h-32 leading-relaxed whitespace-pre-wrap break-all">
                                    {error?.message}
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div
                        className="flex gap-3 opacity-0 animate-slide-up"
                        style={{
                            animationDelay: "0.3s",
                            animationFillMode: "forwards",
                        }}
                    >

                        {/* Try again */}
                        <button
                            onClick={resetErrorBoundary}
                            className="
                                relative flex-1 flex items-center justify-center gap-2
                                px-4 py-3 rounded-lg
                                bg-gradient-to-r from-primary-600 to-accent-600
                                text-text-white text-sm font-semibold font-sans
                                shadow-md hover:shadow-lg
                                transition-all duration-300
                                hover:-translate-y-0.5 active:translate-y-0
                                overflow-hidden group
                            "
                        >
                            {/* Shimmer */}
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

                            <FiRefreshCw
                                className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500"
                            />

                            Try again
                        </button>

                        {/* Home */}
                        <button
                            onClick={() => (window.location.href = "/")}
                            className="
                                flex-1 flex items-center justify-center gap-2
                                px-4 py-3 rounded-lg
                                border border-white/10 bg-white/4
                                hover:bg-white/8 hover:border-white/20
                                text-white/70 hover:text-text-white
                                text-sm font-semibold font-sans
                                transition-all duration-200
                                hover:-translate-y-0.5 active:translate-y-0
                                group
                            "
                        >
                            <FiHome
                                className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
                            />

                            Home
                        </button>
                    </div>

                    {/* Divider + help text */}
                    <div
                        className="mt-5 pt-5 border-t border-white/5 text-center opacity-0 animate-slide-up"
                        style={{
                            animationDelay: "0.35s",
                            animationFillMode: "forwards",
                        }}
                    >
                        <p className="text-xs text-white/20 font-sans">
                            If this keeps happening,{" "}
                            <span className="text-primary-400 hover:text-primary-300 cursor-pointer transition-colors">
                                contact support
                            </span>
                        </p>
                    </div>
                </div>

                {/* Glowing bottom border */}
                <div className="absolute -bottom-px left-16 right-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
        </div>
    );
}