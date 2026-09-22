
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
    FiUserCheck,
} from "react-icons/fi";
import LeadForm from "./LeadForm";
import { ConfirmDialog } from "../../component/ui/commonModals";
import {
    addLead,
    updateLead,
    deleteLead,
    deleteManyLeads,
    changeLeadStatus,
} from "../../store/slices/LeadSlice";
import { addCustomer } from "../../store/slices/CustomerSlice";
import { selectAllLeads } from "../../store/selectors/LeadSelectors";
import { LEAD_STATUSES } from "../../utils/GlobalData";

const PAGE_SIZE = 8;

const EMPTY_LEAD_FORM = {
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "New",
    assignedEmployee: "",
};

const statusStyles = {
    New: "bg-blue-100 text-blue-700",
    Contacted: "bg-purple-100 text-purple-700",
    "Follow-up": "bg-yellow-100 text-yellow-700",
    Qualified: "bg-teal-100 text-teal-700",
    Converted: "bg-green-100 text-green-700",
    Lost: "bg-gray-100 text-gray-500",
};

// Valid values a ?status= URL param can carry — anything else falls
// back to "All". Keeps a bad/stale link from crashing the filter.
const VALID_STATUS_FILTERS = ["All", ...LEAD_STATUSES];

function LeadPage() {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const leads = useSelector(selectAllLeads);

    // ── Drill-down entry point: read ?status= from the URL once on
    // load (e.g. arriving from a Dashboard link), fall back to "All". ──
    const initialStatus = searchParams.get("status");
    const [statusFilter, setStatusFilter] = useState(
        VALID_STATUS_FILTERS.includes(initialStatus) ? initialStatus : "All"
    );

    // Keep the URL in sync as the filter changes, so the page is
    // bookmarkable/shareable and the back button behaves correctly.
    useEffect(() => {
        setSearchParams(statusFilter === "All" ? {} : { status: statusFilter }, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("createdDate");
    const [sortDir, setSortDir] = useState("desc");
    const [page, setPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingLead, setEditingLead] = useState(null);
    const [leadFormData, setLeadFormData] = useState(EMPTY_LEAD_FORM);
    const [leadFormErrors, setLeadFormErrors] = useState({});

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [convertTarget, setConvertTarget] = useState(null);

    useEffect(() => {
        const t = setTimeout(() => {
            setSearch(searchInput.trim().toLowerCase());
            setPage(1);
        }, 300);
        return () => clearTimeout(t);
    }, [searchInput]);

    const filtered = useMemo(() => {
        let result = leads;

        if (statusFilter !== "All") {
            result = result.filter((l) => l.status === statusFilter);
        }

        if (search) {
            result = result.filter((l) =>
                [l.name, l.email, l.company]
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
    }, [leads, search, statusFilter, sortField, sortDir]);

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
        pageItems.length > 0 && pageItems.every((l) => selectedIds.includes(l.id));

    const toggleSelectAllOnPage = () => {
        if (allOnPageSelected) {
            setSelectedIds((prev) => prev.filter((id) => !pageItems.some((l) => l.id === id)));
        } else {
            setSelectedIds((prev) => [
                ...prev,
                ...pageItems.filter((l) => !prev.includes(l.id)).map((l) => l.id),
            ]);
        }
    };

    const toggleSelectOne = (id) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const handleLeadFormChange = (e) => {
        const { name, value } = e.target;
        setLeadFormData((prev) => ({ ...prev, [name]: value }));
        setLeadFormErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateLeadForm = () => {
        const next = {};
        if (!leadFormData.name.trim()) next.name = "Name is required";
        if (!leadFormData.email.trim()) {
            next.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadFormData.email.trim())) {
            next.email = "Enter a valid email";
        }
        if (!leadFormData.phone.trim()) next.phone = "Phone is required";
        setLeadFormErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleLeadFormSubmit = (e) => {
        e.preventDefault();
        if (!validateLeadForm()) return;

        const lead = {
            ...leadFormData,
            id: editingLead?.id ?? crypto.randomUUID(),
            createdDate: editingLead?.createdDate ?? new Date().toISOString(),
        };

        dispatch(editingLead ? updateLead(lead) : addLead(lead));
        closeForm();
    };

    const openAdd = () => {
        setEditingLead(null);
        setLeadFormData(EMPTY_LEAD_FORM);
        setLeadFormErrors({});
        setShowForm(true);
    };

    const openEdit = (lead) => {
        setEditingLead(lead);
        setLeadFormData({ ...EMPTY_LEAD_FORM, ...lead });
        setLeadFormErrors({});
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingLead(null);
        setLeadFormData(EMPTY_LEAD_FORM);
        setLeadFormErrors({});
    };

    const confirmDelete = () => {
        if (deleteTarget === "bulk") {
            dispatch(deleteManyLeads(selectedIds));
            setSelectedIds([]);
        } else if (deleteTarget) {
            dispatch(deleteLead(deleteTarget));
            setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget));
        }
        setDeleteTarget(null);
    };

    const handleStatusChange = (id, status) => {
        dispatch(changeLeadStatus({ id, status }));
    };

    const confirmConvert = () => {
        if (!convertTarget) return;

        dispatch(
            addCustomer({
                id: crypto.randomUUID(),
                name: convertTarget.name,
                email: convertTarget.email,
                phone: convertTarget.phone,
                company: convertTarget.company,
                location: "",
                status: "Active",
                assignedEmployee: convertTarget.assignedEmployee,
                createdDate: new Date().toISOString(),
            })
        );
        dispatch(changeLeadStatus({ id: convertTarget.id, status: "Converted" }));
        setConvertTarget(null);
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
                    <p className="text-sm text-gray-500">
                        {filtered.length} of {leads.length} lead{leads.length !== 1 && "s"}
                        {statusFilter !== "All" && (
                            <span className="ml-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                                {statusFilter}
                            </span>
                        )}
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                    <FiPlus size={16} />
                    Add Lead
                </button>
            </div>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative">
                        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search leads…"
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
                        {LEAD_STATUSES.map((status) => (
                            <option key={status} value={status}>{status}</option>
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
                                        No leads found.
                                    </td>
                                </tr>
                            ) : (
                                pageItems.map((lead) => {
                                    const isConverted = lead.status === "Converted";
                                    return (
                                        <tr key={lead.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(lead.id)}
                                                    onChange={() => toggleSelectOne(lead.id)}
                                                    className="h-4 w-4 rounded border-gray-300"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-900">{lead.name}</p>
                                                <p className="text-xs text-gray-500">{lead.email}</p>
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">{lead.company || "—"}</td>
                                            <td className="px-4 py-3 text-gray-700">{lead.phone || "—"}</td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={lead.status}
                                                    disabled={isConverted}
                                                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                                    className={`
                                                        rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none
                                                        ${statusStyles[lead.status] || "bg-gray-100 text-gray-600"}
                                                        ${isConverted ? "cursor-not-allowed opacity-80" : "cursor-pointer"}
                                                    `}
                                                >
                                                    {LEAD_STATUSES.map((status) => (
                                                        <option key={status} value={status}>{status}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">{lead.assignedEmployee || "—"}</td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {new Date(lead.createdDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <IconButton onClick={() => setConvertTarget(lead)} label="Convert to customer" disabled={isConverted}>
                                                        <FiUserCheck size={16} />
                                                    </IconButton>
                                                    <IconButton onClick={() => openEdit(lead)} label="Edit">
                                                        <FiEdit2 size={16} />
                                                    </IconButton>
                                                    <IconButton onClick={() => setDeleteTarget(lead.id)} label="Delete" danger>
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
                <LeadForm
                    isEditing={!!editingLead}
                    formData={leadFormData}
                    errors={leadFormErrors}
                    onChange={handleLeadFormChange}
                    onSubmit={handleLeadFormSubmit}
                    onClose={closeForm}
                />
            )}

            {deleteTarget && (
                <ConfirmDialog
                    title={deleteTarget === "bulk" ? "Delete selected leads?" : "Delete lead?"}
                    message={
                        deleteTarget === "bulk"
                            ? `This will permanently remove ${selectedIds.length} lead(s).`
                            : "This will permanently remove this lead."
                    }
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={confirmDelete}
                />
            )}

            {convertTarget && (
                <ConfirmDialog
                    title="Convert lead to customer?"
                    message={`${convertTarget.name} will be added to the Customer module and marked as Converted.`}
                    rightLabel="Convert"
                    onCancel={() => setConvertTarget(null)}
                    onConfirm={confirmConvert}
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

function IconButton({ onClick, label, danger, disabled, children }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            title={label}
            className={`
                flex h-8 w-8 items-center justify-center rounded-lg transition
                ${disabled ? "cursor-not-allowed text-gray-300" : danger ? "text-red-500 hover:bg-red-50" : "text-gray-500 hover:bg-gray-100"}
            `}
        >
            {children}
        </button>
    );
}

export default LeadPage;