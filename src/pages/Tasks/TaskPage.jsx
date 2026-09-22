import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
    FiPlus,
    FiSearch,
    FiEdit2,
    FiTrash2,
    FiChevronLeft,
    FiChevronRight,
    FiChevronUp,
    FiChevronDown,
} from "react-icons/fi";
import TaskForm from "./TaskForm";
import { ConfirmDialog } from "../../component/ui/commonModals";
import {
    addTask,
    updateTask,
    deleteTask,
    deleteManyTasks,
    changeTaskStatus,
} from "../../store/slices/TaskSlice";
import { selectAllTasks } from "../../store/selectors/TaskSelectors";
import { TASK_STATUSES, TASK_PRIORITIES } from "../../utils/GlobalData";

const PAGE_SIZE = 8;

const EMPTY_TASK_FORM = {
    title: "",
    description: "",
    assignedEmployee: "",
    priority: "Medium",
    dueDate: "",
    status: "Todo",
};

const statusStyles = {
    Todo: "bg-gray-100 text-gray-600",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
};

const priorityStyles = {
    Low: "bg-gray-100 text-gray-500",
    Medium: "bg-yellow-100 text-yellow-700",
    High: "bg-red-100 text-red-700",
};

// "Pending" isn't a real task status — it's a drill-down shortcut
// meaning "anything not Completed", used by Dashboard's "Pending
// Tasks" stat card. Only valid as a filter, never as a task's own
// status (that still comes from TASK_STATUSES everywhere else).
const FILTER_STATUS_OPTIONS = ["All", "Pending", ...TASK_STATUSES];
const VALID_STATUS_FILTERS = FILTER_STATUS_OPTIONS;

function TaskPage() {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const tasks = useSelector(selectAllTasks);

    const initialStatus = searchParams.get("status");
    const [statusFilter, setStatusFilter] = useState(
        VALID_STATUS_FILTERS.includes(initialStatus) ? initialStatus : "All"
    );

    useEffect(() => {
        setSearchParams(statusFilter === "All" ? {} : { status: statusFilter }, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [sortField, setSortField] = useState("dueDate");
    const [sortDir, setSortDir] = useState("asc");
    const [page, setPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [taskFormData, setTaskFormData] = useState(EMPTY_TASK_FORM);
    const [taskFormErrors, setTaskFormErrors] = useState({});

    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        const t = setTimeout(() => {
            setSearch(searchInput.trim().toLowerCase());
            setPage(1);
        }, 300);
        return () => clearTimeout(t);
    }, [searchInput]);

    const filtered = useMemo(() => {
        let result = tasks;

        if (statusFilter === "Pending") {
            result = result.filter((t) => t.status !== "Completed");
        } else if (statusFilter !== "All") {
            result = result.filter((t) => t.status === statusFilter);
        }

        if (priorityFilter !== "All") {
            result = result.filter((t) => t.priority === priorityFilter);
        }

        if (search) {
            result = result.filter((t) =>
                [t.title, t.description, t.assignedEmployee]
                    .filter(Boolean)
                    .some((field) => field.toLowerCase().includes(search))
            );
        }

        result = [...result].sort((a, b) => {
            const aVal = (a[sortField] || "")?.toString()?.toLowerCase();
            const bVal = (b[sortField] || "")?.toString()?.toLowerCase();
            if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
            if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
            return 0;
        });

        return result;
    }, [tasks, search, statusFilter, priorityFilter, sortField, sortDir]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const toggleSort = (field) => {
        if (sortField === field) {
            setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortDir("asc");
        }
    };

    const allOnPageSelected =
        pageItems.length > 0 && pageItems.every((t) => selectedIds.includes(t.id));

    const toggleSelectAllOnPage = () => {
        if (allOnPageSelected) {
            setSelectedIds((prev) => prev.filter((id) => !pageItems.some((t) => t.id === id)));
        } else {
            setSelectedIds((prev) => [
                ...prev,
                ...pageItems.filter((t) => !prev.includes(t.id)).map((t) => t.id),
            ]);
        }
    };

    const toggleSelectOne = (id) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const handleTaskFormChange = (e) => {
        const { name, value } = e.target;
        setTaskFormData((prev) => ({ ...prev, [name]: value }));
        setTaskFormErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateTaskForm = () => {
        const next = {};
        if (!taskFormData.title.trim()) next.title = "Title is required";
        if (!taskFormData.assignedEmployee.trim()) next.assignedEmployee = "Assign this task to someone";
        if (!taskFormData.dueDate) next.dueDate = "Due date is required";
        setTaskFormErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleTaskFormSubmit = (e) => {
        e.preventDefault();
        if (!validateTaskForm()) return;

        const task = {
            ...taskFormData,
            id: editingTask?.id ?? crypto.randomUUID(),
            createdDate: editingTask?.createdDate ?? new Date().toISOString(),
        };

        dispatch(editingTask ? updateTask(task) : addTask(task));
        closeForm();
    };

    const openAdd = () => {
        setEditingTask(null);
        setTaskFormData(EMPTY_TASK_FORM);
        setTaskFormErrors({});
        setShowForm(true);
    };

    const openEdit = (task) => {
        setEditingTask(task);
        setTaskFormData({ ...EMPTY_TASK_FORM, ...task, dueDate: task.dueDate?.slice(0, 10) || "" });
        setTaskFormErrors({});
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingTask(null);
        setTaskFormData(EMPTY_TASK_FORM);
        setTaskFormErrors({});
    };

    const confirmDelete = () => {
        if (deleteTarget === "bulk") {
            dispatch(deleteManyTasks(selectedIds));
            setSelectedIds([]);
        } else if (deleteTarget) {
            dispatch(deleteTask(deleteTarget));
            setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget));
        }
        setDeleteTarget(null);
    };

    const handleStatusChange = (id, status) => {
        dispatch(changeTaskStatus({ id, status }));
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                    <p className="text-sm text-gray-500">
                        {filtered.length} of {tasks.length} task{tasks.length !== 1 && "s"}
                        {statusFilter !== "All" && (
                            <span className="ml-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                                {statusFilter === "Pending" ? "Pending (not completed)" : statusFilter}
                            </span>
                        )}
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                    <FiPlus size={16} />
                    Add Task
                </button>
            </div>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative">
                        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search tasks…"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-64"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
                    >
                        <option value="All">All statuses</option>
                        <option value="Pending">Pending (not completed)</option>
                        {TASK_STATUSES.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) => {
                            setPriorityFilter(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
                    >
                        <option value="All">All priorities</option>
                        {TASK_PRIORITIES.map((priority) => (
                            <option key={priority} value={priority}>{priority}</option>
                        ))}
                    </select>
                </div>

                {selectedIds.length > 0 && (
                    <button
                        onClick={() => setDeleteTarget("bulk")}
                        className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                    >
                        <FiTrash2 size={16} />
                        Delete {selectedIds.length} selected
                    </button>
                )}
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="w-10 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={allOnPageSelected}
                                        onChange={toggleSelectAllOnPage}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                </th>
                                <SortableHeader label="Title" field="title" sortField={sortField} sortDir={sortDir} onSort={toggleSort} />
                                <th className="px-4 py-3 text-left font-medium text-gray-500">Assigned</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">Priority</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                                <SortableHeader label="Due Date" field="dueDate" sortField={sortField} sortDir={sortDir} onSort={toggleSort} />
                                <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pageItems.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                                        No tasks found.
                                    </td>
                                </tr>
                            ) : (
                                pageItems.map((task) => {
                                    const isOverdue = task.dueDate && task.status !== "Completed" && new Date(task.dueDate) < new Date();
                                    return (
                                        <tr key={task.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(task.id)}
                                                    onChange={() => toggleSelectOne(task.id)}
                                                    className="h-4 w-4 rounded border-gray-300"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-900">{task.title}</p>
                                                {task.description && (
                                                    <p className="max-w-xs truncate text-xs text-gray-500">{task.description}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">{task.assignedEmployee || "—"}</td>
                                            <td className="px-4 py-3">
                                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[task.priority] || "bg-gray-100 text-gray-600"}`}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={task.status}
                                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                    className={`
                                                        cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none
                                                        ${statusStyles[task.status] || "bg-gray-100 text-gray-600"}
                                                    `}
                                                >
                                                    {TASK_STATUSES.map((status) => (
                                                        <option key={status} value={status}>{status}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className={`px-4 py-3 ${isOverdue ? "font-medium text-red-600" : "text-gray-500"}`}>
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <IconButton onClick={() => openEdit(task)} label="Edit">
                                                        <FiEdit2 size={16} />
                                                    </IconButton>
                                                    <IconButton onClick={() => setDeleteTarget(task.id)} label="Delete" danger>
                                                        <FiTrash2 size={16} />
                                                    </IconButton>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {filtered.length > PAGE_SIZE && (
                    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                        <p className="text-xs text-gray-500">
                            Page {currentPage} of {totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 disabled:opacity-40"
                            >
                                <FiChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 disabled:opacity-40"
                            >
                                <FiChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showForm && (
                <TaskForm
                    isEditing={!!editingTask}
                    formData={taskFormData}
                    errors={taskFormErrors}
                    onChange={handleTaskFormChange}
                    onSubmit={handleTaskFormSubmit}
                    onClose={closeForm}
                />
            )}

            {deleteTarget && (
                <ConfirmDialog
                    title={deleteTarget === "bulk" ? "Delete selected tasks?" : "Delete task?"}
                    message={
                        deleteTarget === "bulk"
                            ? `This will permanently remove ${selectedIds.length} task(s).`
                            : "This will permanently remove this task."
                    }
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
}

function SortableHeader({ label, field, sortField, sortDir, onSort }) {
    const active = sortField === field;
    return (
        <th
            onClick={() => onSort(field)}
            className="cursor-pointer select-none px-4 py-3 text-left font-medium text-gray-500 hover:text-gray-700"
        >
            <span className="flex items-center gap-1">
                {label}
                {active && (sortDir === "asc" ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />)}
            </span>
        </th>
    );
}

function IconButton({ onClick, label, danger, children }) {
    return (
        <button
            onClick={onClick}
            aria-label={label}
            title={label}
            className={`
                flex h-8 w-8 items-center justify-center rounded-lg transition
                ${danger ? "text-red-500 hover:bg-red-50" : "text-gray-500 hover:bg-gray-100"}
            `}
        >
            {children}
        </button>
    );
}

export default TaskPage;

