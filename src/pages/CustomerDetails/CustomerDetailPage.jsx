import { useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    FiArrowLeft,
    FiMail,
    FiPhone,
    FiMapPin,
    FiBriefcase,
    FiUser,
    FiPlus,
    FiMessageSquare,
    FiActivity,
    FiCheckSquare,
} from "react-icons/fi";
import CustomerDetailForm from "./CustomerDetailForm";
import { selectCustomerById } from "../../store/selectors/customerSelectors";
import { selectTasksByCustomerId } from "../../store/selectors/taskSelectors";
import { addCustomerNote, addCustomerActivity } from "../../store/slices/CustomerSlice";
import { addTask, changeTaskStatus } from "../../store/slices/taskSlice";

const EMPTY_FORMS = {
    note: { text: "" },
    activity: { type: "Call", description: "" },
    task: { title: "", priority: "Medium", dueDate: "", assignedEmployee: "" },
};

const statusStyles = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-gray-100 text-gray-600",
    Pending: "bg-yellow-100 text-yellow-700",
};

const taskStatusStyles = {
    Todo: "bg-gray-100 text-gray-600",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
};

function CustomerDetailPage() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id")
    const dispatch = useDispatch();

    const customer = useSelector(selectCustomerById(id));
    const tasks = useSelector(selectTasksByCustomerId(id));

    // ── Modal state: which type is open, its form data + errors.
    // Same pattern as Lead/Task — page owns it, form is pure UI. ──
    const [activeModal, setActiveModal] = useState(null); // "note" | "activity" | "task" | null
    const [formData, setFormData] = useState(EMPTY_FORMS.note);
    const [errors, setErrors] = useState({});

    const openModal = (type) => {
        setActiveModal(type);
        setFormData(
            type === "task"
                ? { ...EMPTY_FORMS.task, assignedEmployee: customer?.assignedEmployee || "" }
                : EMPTY_FORMS[type]
        );
        setErrors({});
    };

    const closeModal = () => {
        setActiveModal(null);
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const next = {};
        if (activeModal === "note" && !formData.text.trim()) {
            next.text = "Note can't be empty";
        }
        if (activeModal === "activity" && !formData.description.trim()) {
            next.description = "Description is required";
        }
        if (activeModal === "task") {
            if (!formData.title.trim()) next.title = "Title is required";
            if (!formData.dueDate) next.dueDate = "Due date is required";
            if (!formData.assignedEmployee.trim()) next.assignedEmployee = "Assign this task to someone";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        if (activeModal === "note") {
            dispatch(
                addCustomerNote({
                    customerId: customer.id,
                    note: {
                        id: crypto.randomUUID(),
                        text: formData.text.trim(),
                        author: customer.assignedEmployee || "Unassigned",
                        createdDate: new Date().toISOString(),
                    },
                })
            );
        }

        if (activeModal === "activity") {
            dispatch(
                addCustomerActivity({
                    customerId: customer.id,
                    activity: {
                        id: crypto.randomUUID(),
                        type: formData.type,
                        description: formData.description.trim(),
                        createdDate: new Date().toISOString(),
                    },
                })
            );
        }

        if (activeModal === "task") {
            dispatch(
                addTask({
                    id: crypto.randomUUID(),
                    title: formData.title.trim(),
                    description: "",
                    assignedEmployee: formData.assignedEmployee.trim(),
                    priority: formData.priority,
                    dueDate: formData.dueDate,
                    status: "Todo",
                    customerId: customer.id, // links this task back to the customer
                    createdDate: new Date().toISOString(),
                })
            );

            // Also log it as an activity, so the timeline reflects it.
            dispatch(
                addCustomerActivity({
                    customerId: customer.id,
                    activity: {
                        id: crypto.randomUUID(),
                        type: "Task",
                        description: `Task created: "${formData.title.trim()}"`,
                        createdDate: new Date().toISOString(),
                    },
                })
            );
        }

        closeModal();
    };

    const handleTaskStatusChange = (taskId, status) => {
        dispatch(changeTaskStatus({ id: taskId, status }));
    };

    // ── Not found state ─────────────────────────────────────────
    if (!customer) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-500">Customer not found.</p>
                <Link to="/customers" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline">
                    Back to Customers
                </Link>
            </div>
        );
    }

    const notes = customer.notes || [];
    const activities = customer.activities || [];

    return (
        <div className="p-4 sm:p-6">
            {/* Back link */}
            <Link
                to="/customers"
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
                <FiArrowLeft size={16} />
                Back to Customers
            </Link>

            {/* Header card: customer info + assigned employee */}
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[customer.status] || "bg-gray-100 text-gray-600"}`}>
                                {customer.status}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            Customer since {new Date(customer.createdDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoRow icon={FiMail} label="Email" value={customer.email} />
                    <InfoRow icon={FiPhone} label="Phone" value={customer.phone} />
                    <InfoRow icon={FiBriefcase} label="Company" value={customer.company} />
                    <InfoRow icon={FiMapPin} label="Location" value={customer.location} />
                    <InfoRow icon={FiUser} label="Assigned Employee" value={customer.assignedEmployee} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* Notes */}
                <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                            <FiMessageSquare size={18} />
                            Notes
                        </h2>
                        <button
                            onClick={() => openModal("note")}
                            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                        >
                            <FiPlus size={14} />
                            Add Note
                        </button>
                    </div>

                    {notes.length === 0 ? (
                        <EmptyState message="No notes yet." />
                    ) : (
                        <ul className="space-y-3">
                            {notes.map((note) => (
                                <li key={note.id} className="rounded-lg bg-gray-50 p-3">
                                    <p className="text-sm text-gray-800">{note.text}</p>
                                    <p className="mt-1.5 text-xs text-gray-400">
                                        {note.author} · {new Date(note.createdDate).toLocaleString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Tasks */}
                <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                            <FiCheckSquare size={18} />
                            Tasks
                        </h2>
                        <button
                            onClick={() => openModal("task")}
                            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                        >
                            <FiPlus size={14} />
                            Add Task
                        </button>
                    </div>

                    {tasks.length === 0 ? (
                        <EmptyState message="No tasks linked to this customer." />
                    ) : (
                        <ul className="space-y-3">
                            {tasks.map((task) => (
                                <li key={task.id} className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 p-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-800">{task.title}</p>
                                        <p className="text-xs text-gray-400">
                                            Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"} · {task.priority}
                                        </p>
                                    </div>
                                    <select
                                        value={task.status}
                                        onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                                        className={`flex-shrink-0 cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none ${taskStatusStyles[task.status] || "bg-gray-100 text-gray-600"}`}
                                    >
                                        <option value="Todo">Todo</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Activity History — full width */}
                <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                            <FiActivity size={18} />
                            Activity History
                        </h2>
                        <button
                            onClick={() => openModal("activity")}
                            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                        >
                            <FiPlus size={14} />
                            Log Activity
                        </button>
                    </div>

                    {activities.length === 0 ? (
                        <EmptyState message="No activity recorded yet." />
                    ) : (
                        <ol className="space-y-4 border-l-2 border-gray-100 pl-4">
                            {activities.map((activity) => (
                                <li key={activity.id} className="relative">
                                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
                                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                        {activity.type}
                                    </p>
                                    <p className="mt-0.5 text-sm text-gray-800">{activity.description}</p>
                                    <p className="mt-0.5 text-xs text-gray-400">
                                        {new Date(activity.createdDate).toLocaleString()}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    )}
                </section>
            </div>

            {/* Add Note / Log Activity / Add Task modal */}
            {activeModal && (
                <CustomerDetailForm
                    type={activeModal}
                    formData={formData}
                    errors={errors}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-2.5">
            <Icon size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
            <div className="min-w-0">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="truncate text-sm font-medium text-gray-800">{value || "—"}</p>
            </div>
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <p className="rounded-lg border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
            {message}
        </p>
    );
}

export default CustomerDetailPage;