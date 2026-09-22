import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
    FiUsers,
    FiUserPlus,
    FiCheckCircle,
    FiClock,
} from "react-icons/fi";
import DashboardForm from "./DashboardForm";
import { LEAD_STATUSES } from "../../utils/GlobalData";
import { selectAllCustomers } from "../../store/selectors/CustomerSelectors";
import { selectAllTasks } from "../../store/selectors/TaskSelectors";
import { selectAllLeads } from "../../store/selectors/LeadSelectors";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function formatTimeAgo(dateString) {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
}

const countCreatedInLastWeek = (list) =>
    list.filter((item) => Date.now() - new Date(item.createdDate).getTime() <= ONE_WEEK_MS).length;

function DashboardPage() {
    const customers = useSelector(selectAllCustomers);
    const leads = useSelector(selectAllLeads);
    const tasks = useSelector(selectAllTasks);

    // ── Top stat cards — each one now carries a `link` so the whole
    // card becomes a drill-down entry point into the filtered list. ──
    const stats = useMemo(() => {
        const convertedLeads = leads.filter((l) => l.status === "Converted");
        const pendingTasks = tasks.filter((t) => t.status !== "Completed");

        return [
            {
                key: "customers",
                title: "Total Customers",
                value: customers.length,
                change: `+${countCreatedInLastWeek(customers)} this week`,
                icon: FiUsers,
                iconBg: "bg-blue-500/10",
                iconColor: "text-blue-500",
                link: "/customers",
            },
            {
                key: "leads",
                title: "Total Leads",
                value: leads.length,
                change: `+${countCreatedInLastWeek(leads)} this week`,
                icon: FiUserPlus,
                iconBg: "bg-purple-500/10",
                iconColor: "text-purple-500",
                link: "/leads",
            },
            {
                key: "converted",
                title: "Converted Leads",
                value: convertedLeads.length,
                change: `${leads.length ? Math.round((convertedLeads.length / leads.length) * 100) : 0}% of total`,
                icon: FiCheckCircle,
                iconBg: "bg-green-500/10",
                iconColor: "text-green-500",
                link: "/leads?status=Converted",
            },
            {
                key: "pending",
                title: "Pending Tasks",
                value: pendingTasks.length,
                change: `${tasks.length ? Math.round((pendingTasks.length / tasks.length) * 100) : 0}% of total`,
                icon: FiClock,
                iconBg: "bg-orange-500/10",
                iconColor: "text-orange-500",
                // "Pending" isn't a real task status (Todo/In Progress/Completed
                // are) — TaskPage's filter recognizes this special value to
                // mean "anything not Completed". See TaskPage.jsx.
                link: "/tasks?status=Pending",
            },
        ];
    }, [customers, leads, tasks]);

    // ── Recent customers: newest 5, each linking to its detail page ──
    const recentCustomers = useMemo(() => {
        return [...customers]
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
            .slice(0, 5)
            .map((c) => ({
                id: c.id,
                name: c.name,
                email: c.email,
                company: c.company,
                status: c.status,
                link: `/customerDetails?id=${c.id}`,
            }));
    }, [customers]);

    // ── Recent activity: each event links to where that record lives ──
    const activities = useMemo(() => {
        const customerEvents = customers.map((c) => ({
            title: "New customer added",
            description: `${c.name} was added as a customer`,
            date: c.createdDate,
            icon: FiUsers,
            color: "bg-blue-500",
            link: `/customerDetails?id=${c.id}`,
        }));

        const leadEvents = leads.map((l) => ({
            title: l.status === "Converted" ? "Lead converted" : "New lead created",
            description:
                l.status === "Converted"
                    ? `${l.name} was converted to a customer`
                    : `${l.name} was added as a new lead`,
            date: l.createdDate,
            icon: l.status === "Converted" ? FiCheckCircle : FiUserPlus,
            color: l.status === "Converted" ? "bg-green-500" : "bg-orange-500",
            link: `/leads?status=${encodeURIComponent(l.status)}`,
        }));

        const taskEvents = tasks
            .filter((t) => t.status === "Completed")
            .map((t) => ({
                title: "Task completed",
                description: t.title,
                date: t.createdDate, // no separate "completedDate" tracked yet
                icon: FiCheckCircle,
                color: "bg-purple-500",
                link: "/tasks?status=Completed",
            }));

        return [...customerEvents, ...leadEvents, ...taskEvents]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map((event) => ({ ...event, time: formatTimeAgo(event.date) }));
    }, [customers, leads, tasks]);

    // ── Leads overview: each bar links to that status's filtered list ──
    const leadOverview = useMemo(() => {
        const total = leads.length || 1;
        return LEAD_STATUSES.filter((status) => status !== "Lost").map((status) => {
            const count = leads.filter((l) => l.status === status).length;
            return {
                label: status,
                value: Math.round((count / total) * 100),
                percentage: `${Math.round((count / total) * 100)}%`,
                count,
                link: `/leads?status=${encodeURIComponent(status)}`,
            };
        });
    }, [leads]);

    // ── Tasks overview: each item links to that task's status filter ──
    const taskOverview = useMemo(() => {
        return [...tasks]
            .filter((t) => t.status !== "Completed")
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 4)
            .map((t) => ({
                title: t.title,
                priority: t.priority,
                status: t.status,
                link: `/tasks?status=${encodeURIComponent(t.status)}`,
            }));
    }, [tasks]);

    return (
        <DashboardForm
            stats={stats}
            recentCustomers={recentCustomers}
            activities={activities}
            leadOverview={leadOverview}
            taskOverview={taskOverview}
        />
    );
}

export default DashboardPage;