import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHome } from "react-icons/fi";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 text-gray-900 dark:bg-gray-950 dark:text-white">
            <div className="space-y-6 text-center">

                {/* 404 */}
                <h1 className="text-8xl font-bold tracking-tight text-blue-600">
                    404
                </h1>

                {/* Title */}
                <h2 className="text-2xl font-semibold">
                    Page not found
                </h2>

                {/* Description */}
                <p className="mx-auto max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    The page you're looking for doesn't exist or has
                    been moved. Let's get you back on track.
                </p>

                {/* Actions */}
                <div className="flex justify-center gap-3">

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        <FiArrowLeft className="h-4 w-4" />
                        Go Back
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        <FiHome className="h-4 w-4" />
                        Dashboard
                    </button>

                </div>

                {/* Error Code */}
                <p className="text-xs font-mono tracking-wide text-gray-400">
                    ERROR_CODE: PAGE_NOT_FOUND
                </p>

            </div>
        </div>
    );
}