// ── StatPill ─────────────────────────────────────────────────
// Small rounded stat badge, e.g. "500+ customers", used in the
// hero panel. Uses only Tailwind's default palette.

function StatPill({ value, label }) {
    return (
        <div className="
            flex items-center gap-1.5
            px-3.5 py-1.5 rounded-full
            bg-slate-900 border border-slate-800
        ">
            <span className="text-sm font-bold text-white">
                {value}
            </span>
            <span className="text-xs text-slate-500">
                {label}
            </span>
        </div>
    );
}

export { StatPill };