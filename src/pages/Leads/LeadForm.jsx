import { FiX } from "react-icons/fi";
import { LEAD_STATUSES } from "../../utils/GlobalData";

// ── LeadForm (UI only) ───────────────────────────────────────
// This component owns no state and does no validation — every
// value, error, and handler comes from LeadPage. It only renders
// the modal and wires inputs to the props it's given.
function LeadForm({
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
            {isEditing ? "Edit Lead" : "Add Lead"}
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <Field label="Name" name="name" value={formData.name} onChange={onChange} error={errors.name} />
            <Field label="Email" name="email" type="email" value={formData.email} onChange={onChange} error={errors.email} />
            <Field label="Phone" name="phone" value={formData.phone} onChange={onChange} error={errors.phone} />
            <Field label="Company" name="company" value={formData.company} onChange={onChange} error={errors.company} />
            <Field label="Assigned Employee" name="assignedEmployee" value={formData.assignedEmployee} onChange={onChange} error={errors.assignedEmployee} />

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
                {LEAD_STATUSES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
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
              {isEditing ? "Save Changes" : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Small local helper for the repeated label/input/error pattern.
// Purely presentational — no logic, just rendering.
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

export default LeadForm;