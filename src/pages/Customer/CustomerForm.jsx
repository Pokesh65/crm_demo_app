import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

const STATUS_OPTIONS = ["Active", "Inactive", "Pending"];

const EMPTY_CUSTOMER = {
    name: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    status: "Active",
    assignedEmployee: "",
};

// Controlled modal form for creating or editing a customer.
// `customer` is null for "add" mode, or an existing record for
// "edit" mode. All state is local — the parent owns persistence.
function CustomerForm({ customer, onSave, onClose }) {
    const [formData, setFormData] = useState(EMPTY_CUSTOMER);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData(customer ? { ...EMPTY_CUSTOMER, ...customer } : EMPTY_CUSTOMER);
        setErrors({});
    }, [customer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const next = {};
        if (!formData.name.trim()) next.name = "Name is required";
        if (!formData.email.trim()) {
            next.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            next.email = "Enter a valid email";
        }
        if (!formData.phone.trim()) next.phone = "Phone is required";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        onSave({
            ...formData,
            id: customer?.id ?? crypto.randomUUID(),
            createdDate: customer?.createdDate ?? new Date().toISOString(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {customer ? "Edit Customer" : "Add Customer"}
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
                <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto px-6 py-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <Field label="Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} />
                        <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
                        <Field label="Phone" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} />
                        <Field label="Company" name="company" value={formData.company} onChange={handleChange} error={errors.company} />
                        <Field label="Location" name="location" value={formData.location} onChange={handleChange} error={errors.location} />
                        <Field label="Assigned Employee" name="assignedEmployee" value={formData.assignedEmployee} onChange={handleChange} error={errors.assignedEmployee} />

                        {/* Status select */}
                        <div>
                            <label htmlFor="status" className="mb-1.5 block text-xs font-semibold text-gray-500">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                            >
                                {STATUS_OPTIONS.map((option) => (
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
                            {customer ? "Save Changes" : "Add Customer"}
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

export default CustomerForm;