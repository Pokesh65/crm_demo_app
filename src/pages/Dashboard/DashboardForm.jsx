import React from "react";
import { Link } from "react-router-dom";
import {
    FiMoreHorizontal,
    FiActivity,
    FiChevronRight,
} from "react-icons/fi";

// ── DashboardForm (UI only) ────────────────────────────────────
// No data, no computation — everything rendered here comes in as
// props from DashboardPage, which pulls real numbers out of Redux
// and attaches a `link` to each item for drill-down navigation.
function DashboardForm({ stats, recentCustomers, activities, leadOverview, taskOverview }) {
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Welcome back! Here's what's happening with your CRM.
                        </p>
                    </div>
                </div>

                {/* Stats — each card is a drill-down link into its filtered list */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Link
                                key={stat.key}
                                to={stat.link}
                                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.iconBg}`}>
                                        <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                                    </div>
                                    <FiChevronRight className="text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-gray-400" />
                                </div>

                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                    <div className="mt-1 flex items-end justify-between">
                                        <h2 className="text-2xl font-bold text-gray-900">{stat.value}</h2>
                                    </div>
                                    <p className="mt-2 text-xs font-medium text-gray-400">{stat.change}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Main Content */}
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* Recent Customers */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                            <div>
                                <h2 className="font-semibold text-gray-900">Recent Customers</h2>
                                <p className="mt-1 text-xs text-gray-400">Recently added customers</p>
                            </div>
                            <Link to="/customers" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                View All
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/70">
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            Customer
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            Company
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentCustomers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-400">
                                                No customers yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentCustomers.map((customer) => (
                                            <tr key={customer.email} className="transition hover:bg-gray-50">
                                                <td className="px-5 py-4">
                                                    <Link to={customer.link} className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                                                            {customer.name.split(" ").map((n) => n[0]).join("")}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 hover:text-blue-600">{customer.name}</p>
                                                            <p className="text-xs text-gray-400">{customer.email}</p>
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-600">{customer.company}</td>
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${customer.status === "Active"
                                                            ? "bg-green-50 text-green-600"
                                                            : customer.status === "Pending"
                                                                ? "bg-orange-50 text-orange-600"
                                                                : "bg-gray-100 text-gray-500"
                                                            }`}
                                                    >
                                                        {customer.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <Link to={customer.link} className="text-gray-400 hover:text-gray-600">
                                                        <FiMoreHorizontal />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                            <div>
                                <h2 className="font-semibold text-gray-900">Recent Activity</h2>
                                <p className="mt-1 text-xs text-gray-400">Latest CRM activity</p>
                            </div>
                            <FiActivity className="h-5 w-5 text-gray-400" />
                        </div>

                        <div className="p-5">
                            {activities.length === 0 ? (
                                <p className="py-6 text-center text-sm text-gray-400">No activity yet.</p>
                            ) : (
                                <div className="space-y-1">
                                    {activities.map((activity, index) => {
                                        const Icon = activity.icon;
                                        return (
                                            <Link
                                                key={index}
                                                to={activity.link}
                                                className="-mx-2 flex gap-3 rounded-lg px-2 py-2.5 transition hover:bg-gray-50"
                                            >
                                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${activity.color}`}>
                                                    <Icon className="h-4 w-4 text-white" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                                                    <p className="mt-0.5 text-xs leading-5 text-gray-500">{activity.description}</p>
                                                    <p className="mt-1 text-xs text-gray-400">{activity.time}</p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Cards */}
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

                    {/* Leads Overview */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold text-gray-900">Leads Overview</h2>
                                <p className="mt-1 text-xs text-gray-400">Current lead pipeline</p>
                            </div>
                            <Link to="/leads" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                View Leads
                            </Link>
                        </div>

                        <div className="mt-6 space-y-4">
                            {leadOverview.map((item) => (
                                <Link key={item.label} to={item.link} className="block">
                                    <ProgressItem
                                        label={`${item.label} (${item.count})`}
                                        value={item.value}
                                        percentage={item.percentage}
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Tasks Overview */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold text-gray-900">Tasks Overview</h2>
                                <p className="mt-1 text-xs text-gray-400">Your current tasks</p>
                            </div>
                            <Link to="/tasks" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                View Tasks
                            </Link>
                        </div>

                        <div className="mt-5 space-y-3">
                            {taskOverview.length === 0 ? (
                                <p className="py-6 text-center text-sm text-gray-400">No pending tasks. 🎉</p>
                            ) : (
                                taskOverview.map((task) => (
                                    <Link key={task.title} to={task.link} className="block">
                                        <TaskItem title={task.title} priority={task.priority} status={task.status} />
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProgressItem({ label, value, percentage }) {
    return (
        <div className="cursor-pointer rounded-lg px-1 py-1 transition hover:bg-gray-50">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-xs font-medium text-gray-400">{percentage}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}

function TaskItem({ title, priority, status }) {
    const priorityStyles = {
        High: "bg-red-50 text-red-600",
        Medium: "bg-orange-50 text-orange-600",
        Low: "bg-blue-50 text-blue-600",
    };
    const statusStyles = {
        Todo: "bg-gray-100 text-gray-500",
        "In Progress": "bg-blue-50 text-blue-600",
        Completed: "bg-green-50 text-green-600",
    };

    return (
        <div className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition hover:border-blue-200 hover:bg-blue-50/30">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                <FiActivity className="h-4 w-4 text-gray-400" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800">{title}</p>
                <div className="mt-1 flex gap-2">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${priorityStyles[priority]}`}>
                        {priority}
                    </span>
                    <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${statusStyles[status]}`}>
                        {status}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default DashboardForm;