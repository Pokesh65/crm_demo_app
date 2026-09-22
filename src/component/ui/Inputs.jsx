// ── InputField ───────────────────────────────────────────────
// Reusable text input with a leading icon, label, inline error
// message, and optional trailing suffix (e.g. the show/hide
// password toggle). Uses only Tailwind's default palette.

function InputField({
    label,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    icon: Icon,
    error,
    suffix,
}) {
    return (
        <div>
            {/* Label */}
            <label
                htmlFor={name}
                className="block text-xs font-semibold text-slate-400 mb-1.5"
            >
                {label}
            </label>

            {/* Input shell */}
            <div
                className={`
                    flex items-center gap-2.5
                    rounded-xl border bg-slate-900
                    px-3.5 py-2.5 sm:py-3
                    transition-colors duration-200
                    focus-within:border-indigo-500
                    ${error ? "border-red-500" : "border-slate-800"}
                `}
            >
                {Icon && (
                    <Icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                )}

                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    autoComplete={type === "password" ? "current-password" : "email"}
                    className="
                        flex-1 min-w-0 bg-transparent outline-none
                        text-sm text-white placeholder:text-slate-600
                    "
                />

                {suffix && (
                    <div className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors">
                        {suffix}
                    </div>
                )}
            </div>

            {/* Error message */}
            {error && (
                <p className="mt-1.5 text-xs text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}

export { InputField };