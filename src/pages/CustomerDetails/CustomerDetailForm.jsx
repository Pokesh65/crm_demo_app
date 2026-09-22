import { FiX } from "react-icons/fi";
import { TASK_PRIORITIES } from "../../utils/GlobalData";

const ACTIVITY_TYPES = ["Call", "Email", "Meeting", "Note", "Other"];

const TITLES = {
    note: "Add Note",
    activity: "Log Activity",
    task: "Add Task",
};

// ── CustomerDetailForm (UI only) ──────────────────────────────
// No state, no validation — every value, error, and handler comes
// from CustomerDetailPage as props. `type` picks which fields render.
function CustomerDetailForm({
    type, // "note" | "activity" | "task"
    formData,
    errors,
    onChange,
    onSubmit,
    onClose,
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">{TITLES[type]}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        aria-label="Close"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="px-6 py-5">
                    <div className="space-y-4">

                        {type === "note" && (
                            <TextAreaField
                                label="Note"
                                name="text"
                                value={formData.text}
                                onChange={onChange}
                                error={errors.text}
                                rows={4}
                                placeholder="Add a note about this customer…"
                            />
                        )}

                        {type === "activity" && (
                            <>
                                <div>
                                    <label htmlFor="type" className="mb-1.5 block text-xs font-semibold text-gray-500">
                                        Activity Type
                                    </label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={formData.type}
                                        onChange={onChange}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                                    >
                                        {ACTIVITY_TYPES.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <TextAreaField
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={onChange}
                                    error={errors.description}
                                    rows={3}
                                    placeholder="What happened?"
                                />
                            </>
                        )}

                        {type === "task" && (
                            <>
                                <Field label="Title" name="title" value={formData.title} onChange={onChange} error={errors.title} />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="priority" className="mb-1.5 block text-xs font-semibold text-gray-500">
                                            Priority
                                        </label>
                                        <select
                                            id="priority"
                                            name="priority"
                                            value={formData.priority}
                                            onChange={onChange}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                                        >
                                            {TASK_PRIORITIES.map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <Field label="Due Date" name="dueDate" type="date" value={formData.dueDate} onChange={onChange} error={errors.dueDate} />
                                </div>
                                <Field label="Assigned Employee" name="assignedEmployee" value={formData.assignedEmployee} onChange={onChange} error={errors.assignedEmployee} />
                            </>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Small local helpers — purely presentational.
function Field({ label, name, type = "text", value, onChange, error }) {
    return (
        <div>
            <label htmlFor={name} className="mb-1.5 block text-xs font-semibold text-gray-500">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className={`
                    w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none
                    ${error ? "border-red-500" : "border-gray-300 focus:border-blue-500"}
                `}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function TextAreaField({ label, name, value, onChange, error, rows = 3, placeholder }) {
    return (
        <div>
            <label htmlFor={name} className="mb-1.5 block text-xs font-semibold text-gray-500">
                {label}
            </label>
            <textarea
                id={name}
                name={name}
                rows={rows}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`
                    w-full resize-none rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none
                    ${error ? "border-red-500" : "border-gray-300 focus:border-blue-500"}
                `}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

export default CustomerDetailForm;