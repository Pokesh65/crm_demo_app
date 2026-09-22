import { useEffect, useMemo, useState } from "react";
import {
    FiPlus,
    FiSearch,
    FiEdit2,
    FiTrash2,
    FiEye,
    FiX,
    FiChevronLeft,
    FiChevronRight,
    FiChevronUp,
    FiChevronDown,
    FiMail, FiPhone, FiBriefcase, FiMapPin, FiUser, FiCalendar, FiArrowRight
} from "react-icons/fi";
import CustomerForm from "./CustomerForm";
import { ConfirmDialog } from "../../component/ui/commonModals";
import { getStoredData, saveStoredData } from "../../utils/utilityFunction";
import { CUSTOMER_KEY } from "../../utils/commonNames";
import { SEED_CUSTOMERS } from "../../utils/GlobalData";
import { Link } from "react-router-dom";



const PAGE_SIZE = 8;



const statusStyles = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-gray-100 text-gray-600",
    Pending: "bg-yellow-100 text-yellow-700",
};



const statusDot = {
    Active: "bg-green-500",
    Inactive: "bg-gray-400",
    Pending: "bg-yellow-500",
};


function CustomerPage() {
    // ── Data (local state + localStorage, no Redux) ──────────
    const [customers, setCustomers] = useState([...getStoredData(CUSTOMER_KEY), ...SEED_CUSTOMERS]);

    useEffect(() => {

        const unique = [...new Set(customers.map((item) => item.email))]
        // const uqData = customers.filter(item => unique.indexOf(item?.email))
        const uqData = [...new Map(customers.map((item) => [item.email, item])).values()];
        console.log("Unique", unique, uqData)
        saveStoredData(CUSTOMER_KEY, uqData)
        setCustomers(uqData)

    }, []);

    console.log("All Customer", customers)

    // ── UI state ───────────────────────────────────────────────
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortField, setSortField] = useState("createdData");
    const [sortDir, setSortDir] = useState("desc");
    const [page, setPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [viewingCustomer, setViewingCustomer] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null); // single id or "bulk"

    // Debounce search input → search
    useEffect(() => {
        const t = setTimeout(() => {
            setSearch(searchInput.trim().toLowerCase());
            setPage(1);
        }, 300);
        return () => clearTimeout(t);
    }, [searchInput]);

    // ── Derived list: filter → search → sort ──────────────────
    const filtered = useMemo(() => {

        let result = customers;

        console.log("search customer :", result)

        if (statusFilter !== "All") {
            result = result.filter((c) => c.status === statusFilter);
        }

        if (search) {
            result = result.filter((c) =>
                [c.name, c.email, c.company, c.location]
                    .filter(Boolean)
                    .some((field) => field.toLowerCase().includes(search))
            );
        }

        console.log("search :", search, "\nresult :", result)

        result = [...result].sort((a, b) => {
            const aVal = (a[sortField] || "")?.toString()?.toLowerCase();
            const bVal = (b[sortField] || "")?.toString()?.toLowerCase();
            if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
            if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
            return 0;
        });

        return result;

    }, [customers, search, statusFilter, sortField, sortDir]);

    // ── Pagination ──────────────────────────────────────────────
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageItems = filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const toggleSort = (field) => {
        if (sortField === field) {
            setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortDir("asc");
        }
    };

    // ── Selection ───────────────────────────────────────────────
    const allOnPageSelected =
        pageItems.length > 0 && pageItems.every((c) => selectedIds.includes(c.id));


    const toggleSelectAllOnPage = () => {

        if (allOnPageSelected) {
            setSelectedIds((prev) => {
                const temp = prev.filter((id) => !pageItems.some((c) => c.id === id));
                return temp;
            });
        } else {
            setSelectedIds((prev) => [
                ...prev,
                ...pageItems.filter((c) => !prev.includes(c.id)).map((c) => c.id),
            ]);
        }
    };

    const toggleSelectOne = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };


    // ── CRUD handlers ──────────────────────────────────────────
    const handleSave = (customer) => {
        // const customerDetails = getStoredData(CUSTOMER_KEY)
        setCustomers((prev) => {
            const isExist = prev.some((c) => c.id === customer.id)

            const result = isExist ? prev.map((c) => (c.id === customer.id ? customer : c))
                : [customer, ...prev];

            saveStoredData(CUSTOMER_KEY, result)

            return result
        });
        setShowForm(false);
        setEditingCustomer(null);
    };

    const confirmDelete = () => {

        if (deleteTarget === "bulk") {
            setCustomers((prev) => {
                const exists = prev.filter((c) => !selectedIds.includes(c.id))
                saveStoredData(CUSTOMER_KEY, exists)
                return exists
            }
            );
            setSelectedIds([]);
        } else if (deleteTarget) {

            setCustomers((prev) => {
                const exists = prev.filter((c) => c.id !== deleteTarget)
                console.log("deleteTarget :", deleteTarget, "\n Exists :", exists)
                saveStoredData(CUSTOMER_KEY, exists)
                return exists
            }

            );
            setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget));
        }
        setDeleteTarget(null);
    };

    const openAdd = () => {
        setEditingCustomer(null);
        setShowForm(true);
    };

    const openEdit = (customer) => {
        setEditingCustomer(customer);
        setShowForm(true);
    };

    // ── Render ──────────────────────────────────────────────────
    return (
        <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                    <p className="text-sm text-gray-500">
                        {filtered.length} of {customers.length} customer{customers.length !== 1 && "s"}
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                    <FiPlus size={16} />
                    Add Customer
                </button>
            </div>

            {/* Toolbar: search + filter + bulk delete */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {/* Search */}
                    <div className="relative">
                        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search customers…"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-64"
                        />
                    </div>

                    {/* Status filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
                    >
                        <option value="All">All statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
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

            {/* Table */}
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
                                <SortableHeader label="Name" field="name" sortField={sortField} sortDir={sortDir} onSort={toggleSort} />
                                <SortableHeader label="Company" field="company" sortField={sortField} sortDir={sortDir} onSort={toggleSort} />
                                <th className="px-4 py-3 text-left font-medium text-gray-500">Phone</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">Assigned</th>
                                <SortableHeader label="Created" field="createdDate" sortField={sortField} sortDir={sortDir} onSort={toggleSort} />
                                <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pageItems.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                                        No customers found.
                                    </td>
                                </tr>
                            ) : (
                                pageItems.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(customer.id)}
                                                onChange={() => toggleSelectOne(customer.id)}
                                                className="h-4 w-4 rounded border-gray-300"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link to={`/customerDetails?id=${customer.id}`}>
                                                <p className="font-medium text-blue-900">{customer.name}</p>
                                                <p className="text-xs text-blue-500">{customer.email}</p>
                                            </Link>

                                        </td>
                                        <td className="px-4 py-3 text-gray-700">{customer.company || "—"}</td>
                                        <td className="px-4 py-3 text-gray-700">{customer.phone || "—"}</td>
                                        <td className="px-4 py-3">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[customer.status] || "bg-gray-100 text-gray-600"}`}>
                                                {customer.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">{customer.assignedEmployee || "—"}</td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {new Date(customer.createdDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <IconButton onClick={() => setViewingCustomer(customer)} label="View">
                                                    <FiEye size={16} />
                                                </IconButton>
                                                <IconButton onClick={() => openEdit(customer)} label="Edit">
                                                    <FiEdit2 size={16} />
                                                </IconButton>
                                                <IconButton onClick={() => setDeleteTarget(customer.id)} label="Delete" danger>
                                                    <FiTrash2 size={16} />
                                                </IconButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
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

            {/* Add / Edit modal */}
            {showForm && (
                <CustomerForm
                    customer={editingCustomer}
                    onSave={handleSave}
                    onClose={() => {
                        setShowForm(false);
                        setEditingCustomer(null);
                    }}
                />
            )}

            {/* View details modal */}
            {viewingCustomer && (
                <CustomerDetails
                    customer={viewingCustomer}
                    onClose={() => setViewingCustomer(null)}
                />
            )}

            {/* Delete confirmation */}
            {deleteTarget && (
                <ConfirmDialog
                    title={deleteTarget === "bulk" ? "Delete selected customers?" : "Delete customer?"}
                    message={
                        deleteTarget === "bulk"
                            ? `This will permanently remove ${selectedIds.length} customer(s).`
                            : "This will permanently remove this customer."
                    }
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
}

// ── Small local helpers/components ──────────────────────────────

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

// function CustomerDetails({ customer, onClose }) {
//     const rows = [
//         ["Name", customer.name],
//         ["Email", customer.email],
//         ["Phone", customer.phone],
//         ["Company", customer.company],
//         ["Location", customer.location],
//         ["Status", customer.status],
//         ["Assigned Employee", customer.assignedEmployee],
//         ["Created", new Date(customer.createdDate).toLocaleString()],
//     ];

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//             <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
//                 <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//                     <h2 className="text-lg font-semibold text-gray-900">Customer Details</h2>
//                     <button
//                         onClick={onClose}
//                         className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
//                         aria-label="Close"
//                     >
//                         <FiX size={18} />
//                     </button>
//                 </div>
//                 <div className="space-y-3 px-6 py-5">
//                     {rows.map(([label, value]) => (
//                         <div key={label} className="flex justify-between gap-4 text-sm">
//                             <span className="text-gray-500">{label}</span>
//                             <span className="font-medium text-gray-900">{value || "—"}</span>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }






function CustomerDetails({ customer, onClose }) {
    // Small mount-in animation, same technique as the enhanced
    // ConfirmDialog — no tailwind.config keyframes needed.
    const [entered, setEntered] = useState(false);
    useEffect(() => {
        const raf = requestAnimationFrame(() => setEntered(true));
        return () => cancelAnimationFrame(raf);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const initials = (customer.name || "?")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const infoRows = [
        { icon: FiMail, label: "Email", value: customer.email },
        { icon: FiPhone, label: "Phone", value: customer.phone },
        { icon: FiBriefcase, label: "Company", value: customer.company },
        { icon: FiMapPin, label: "Location", value: customer.location },
        { icon: FiUser, label: "Assigned Employee", value: customer.assignedEmployee },
        {
            icon: FiCalendar,
            label: "Customer Since",
            value: customer.createdDate ? new Date(customer.createdDate).toLocaleDateString() : null,
        },
    ];

    return (
        <div
            className={`
                fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4
                bg-black/50 backdrop-blur-[2px]
                transition-opacity duration-200
                ${entered ? "opacity-100" : "opacity-0"}
            `}
            onClick={onClose}
        >
            {/*
                flex + flex-col + max-h-[90vh] turns this into a fixed-height
                shell: header and footer never move, only the middle section
                scrolls. That's what stops long content from pushing the
                footer off-screen or overlapping it.
            */}
            <div
                onClick={(e) => e.stopPropagation()}
                className={`
                    flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden
                    rounded-2xl bg-white shadow-2xl ring-1 ring-black/5
                    transition-all duration-200 ease-out
                    ${entered ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0"}
                `}
            >
                {/* Header — gradient banner (fixed, doesn't scroll) */}
                <div className="relative flex-shrink-0 bg-gradient-to-br from-blue-600 to-indigo-600 px-5 pb-10 pt-4 sm:px-6 sm:pb-14 sm:pt-5">
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute right-3 top-3 rounded-lg p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white sm:right-4 sm:top-4"
                    >
                        <FiX size={18} />
                    </button>
                    <p className="pr-8 text-xs font-medium uppercase tracking-wide text-blue-100">
                        Customer Details
                    </p>
                </div>

                {/* Scrollable body: avatar + info rows */}
                <div className="min-h-0 flex-1 mt-15">
                    {/* Avatar overlaps the banner, sized down on small screens
                        so it never crowds the name/status below it. */}
                    <div className="-mt-8 flex flex-col items-center px-5 sm:-mt-10 sm:px-6">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-[1px] border-s-mauve-950 bg-white text-xl font-bold text-blue-500 shadow-xl sm:h-20 sm:w-20 sm:text-2xl">
                            {initials}
                        </div>
                        <h2 className="mt-3 max-w-full truncate px-2 text-base font-semibold text-gray-900 sm:text-lg">
                            {customer.name}
                        </h2>
                        <span
                            className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[customer.status] || "bg-gray-100 text-gray-600"}`}
                        >
                            <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${statusDot[customer.status] || "bg-gray-400"}`} />
                            {customer.status}
                        </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 space-y-1 px-3 pb-3 sm:mt-5 sm:px-6 sm:pb-2">
                        {infoRows.map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-gray-50">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                                    <Icon size={15} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">{label}</p>
                                    <p className="truncate text-sm font-medium text-gray-800">{value || "—"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer (fixed, doesn't scroll) — stacks on very small screens */}
                <div className="flex flex-shrink-0 flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6">
                    <button
                        onClick={onClose}
                        className="w-full rounded-lg px-4 py-2 text-center text-sm font-medium text-gray-600 hover:bg-gray-100 sm:w-auto"
                    >
                        Close
                    </button>
                    <Link
                        to={`/customerDetails?id=${customer.id}`}
                        onClick={onClose}
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
                    >
                        View Full Profile
                        <FiArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}


export default CustomerPage