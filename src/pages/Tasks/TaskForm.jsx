import { FiX } from "react-icons/fi";
import { TASK_STATUSES, TASK_PRIORITIES } from "../../utils/GlobalData";

// ── TaskForm (UI only) ────────────────────────────────────────
// No state, no validation logic — every value, error, and handler
// comes from TaskPage as props.
function TaskForm({
  isEditing,
  formData,
  errors,
  onChange,
  onSubmit,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Task" : "Add Task"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="max-h-[75vh] overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-4">

            <Field label="Title" name="title" value={formData.title} onChange={onChange} error={errors.title} />

            {/* Description — textarea, so not using the shared Field */}
            <div>
              <label htmlFor="description" className="mb-1.5 block text-xs font-semibold text-gray-500">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={onChange}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Assigned Employee" name="assignedEmployee" value={formData.assignedEmployee} onChange={onChange} error={errors.assignedEmployee} />
              <Field label="Due Date" name="dueDate" type="date" value={formData.dueDate} onChange={onChange} error={errors.dueDate} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Priority select */}
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

              {/* Status select */}
              <div>
                <label htmlFor="status" className="mb-1.5 block text-xs font-semibold text-gray-500">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={onChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                >
                  {TASK_STATUSES.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
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
              {isEditing ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Small local helper for the repeated label/input/error pattern.
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

export default TaskForm;