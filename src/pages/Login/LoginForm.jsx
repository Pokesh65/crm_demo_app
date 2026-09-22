import {
    HiOutlineAcademicCap,
    HiOutlineArrowRight,
    HiOutlineEnvelope,
    HiOutlineEye,
    HiOutlineEyeSlash,
    HiOutlineLockClosed,
    HiOutlineSparkles,
} from "react-icons/hi2";
import { Link } from "react-router-dom";
import { StatPill } from "../../component/ui/CommonSmallUi";
import { InputField } from "../../component/ui/Inputs";
import { isButtonEnable } from "../../utils/globalValidater";

const APP_NAME = "CRM Hub";
const APP_VERSION = "1.0.0";

// ── Sign In Page (UI only — all logic lives in SignInPage.jsx) ──
// Uses only Tailwind's default color palette / utilities — no
// custom tailwind.config tokens, no CSS animations, no env vars.
function LoginForm({
    formData,
    showPass,
    setShowPass,
    loading,
    errors,
    handleOnChange,
    handleSubmit,
}) {
    return (
        /*
         * Root shell — full viewport height, dark background.
         * On mobile:  single column (form only, brand is hidden)
         * On desktop: two columns (brand left 52% | form right)
         */
        <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950">

            {/* ══════════════════════════════════════════════════════════
                LEFT PANEL — brand / hero
                Hidden on mobile, visible from lg breakpoint upward.
            ══════════════════════════════════════════════════════════ */}
            <div className="hidden lg:flex relative w-[52%] flex-shrink-0 flex-col items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-950 px-12 xl:px-16 py-12">

                <div className="flex flex-col items-center text-center space-y-10 max-w-md w-full">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-sky-500 shadow-lg flex-shrink-0">
                            <HiOutlineAcademicCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            {APP_NAME}
                        </span>
                    </div>

                    {/* Hero headline */}
                    <div className="space-y-4">
                        <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight">
                            Manage Every Lead.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">
                                Close More Deals.
                            </span>
                        </h1>
                        <p className="text-base text-slate-400 leading-relaxed max-w-xs mx-auto">
                            Track customers, leads, and tasks in one place — built for teams that move fast.
                        </p>
                    </div>

                    {/* Stats pills */}
                    <div className="flex flex-wrap justify-center gap-2.5">
                        <StatPill value="500+" label="customers" />
                        <StatPill value="120+" label="leads tracked" />
                        <StatPill value="99%" label="uptime" />
                    </div>

                    {/* Decorative quote */}
                    <div className="border-l-2 border-indigo-500/40 pl-4 text-left max-w-xs">
                        <p className="text-sm text-slate-400 italic leading-relaxed">
                            "A great CRM turns scattered leads into lasting relationships."
                        </p>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                RIGHT PANEL — sign-in form
                Full width on mobile, 48% on desktop.
                Uses flex-col so the footer naturally sits at the bottom.
            ══════════════════════════════════════════════════════════ */}
            <div className="
                flex flex-col flex-1
                items-center justify-between
                min-h-screen lg:min-h-0
                px-5 sm:px-8 md:px-12 lg:px-10 xl:px-16
                py-8 sm:py-10 md:py-12
            ">

                {/* ── Mobile-only top bar ─────────────────────────────
                    Visible only below lg. Shows logo + app name.
                    Hidden on desktop because the left panel handles it.
                ───────────────────────────────────────────────────── */}
                <div className="lg:hidden flex items-center justify-between w-full mb-6 sm:mb-8">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-sky-500 flex-shrink-0">
                            <HiOutlineAcademicCap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <span className="text-base sm:text-lg font-bold text-white">
                            {APP_NAME}
                        </span>
                    </div>
                </div>

                {/* ── Form card ───────────────────────────────────────
                    flex-1 pushes the footer to the bottom.
                    max-w-md keeps lines readable on wide screens.
                ───────────────────────────────────────────────────── */}
                <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">

                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        {/* "Welcome back" pill */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/15 border border-indigo-500/25 mb-3 sm:mb-4">
                            <HiOutlineSparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400" />
                            <span className="text-xs font-semibold text-indigo-400">
                                Welcome back
                            </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Sign in to your CRM
                        </h2>
                        <p className="text-sm text-slate-400 mt-1.5 sm:mt-2">
                            Pick up right where you left off.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">

                        <InputField
                            label="Email address"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleOnChange}
                            icon={HiOutlineEnvelope}
                            error={errors?.email}
                        />

                        <InputField
                            label="Password"
                            name="password"
                            type={showPass ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleOnChange}
                            icon={HiOutlineLockClosed}
                            error={errors?.password}
                            suffix={
                                <button
                                    type="button"
                                    className="cursor-pointer"
                                    onClick={() => setShowPass(!showPass)}
                                >
                                    {showPass
                                        ? <HiOutlineEyeSlash className="w-4 h-4" />
                                        : <HiOutlineEye className="w-4 h-4" />
                                    }
                                </button>
                            }
                        />

                        {/* Forgot password */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors py-1"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit button */}
                        <div className="pt-1">
                            <button
                                type="submit"
                                disabled={loading || !isButtonEnable(formData)}
                                className="
                                    w-full flex items-center justify-center gap-2.5
                                    py-3 sm:py-3.5 rounded-xl font-semibold text-sm
                                    bg-gradient-to-r from-indigo-600 to-sky-600
                                    text-white
                                    shadow-lg hover:shadow-xl
                                    transition-all duration-300
                                    hover:-translate-y-0.5 active:translate-y-0
                                    disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0
                                    min-h-[44px]
                                "
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Signing in…
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sign in
                                        <HiOutlineArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Mock credentials hint — remove once real auth exists */}
                    <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
                        <p className="text-xs text-slate-400">
                            Demo login: <span className="text-slate-200">admin@gmail.com</span> /{" "}
                            <span className="text-slate-200">admin123</span>
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5 sm:my-6">
                        <div className="flex-1 h-px bg-slate-800" />
                        <span className="text-xs text-slate-500">or</span>
                        <div className="flex-1 h-px bg-slate-800" />
                    </div>

                    {/* Sign up link */}
                    <p className="text-center text-sm text-slate-400">
                        New to {APP_NAME}?{" "}
                        <Link
                            to="/register"
                            className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>

                {/* ── Footer ──────────────────────────────────────────
                    Always sits at the bottom of the right panel.
                    On mobile this is the page footer.
                    On desktop it's the bottom of the right column.
                ───────────────────────────────────────────────────── */}
                <p className="text-xs text-slate-600 text-center mt-6 sm:mt-8 pb-1">
                    Version-{APP_VERSION}
                </p>
            </div>
        </div>
    );
}

export default LoginForm;