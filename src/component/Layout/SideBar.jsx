import { NavLink } from "react-router-dom";
import {
    FiGrid,
    FiUsers,
    FiUserPlus,
    FiCheckSquare,
    FiSettings,
    FiLogOut,
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";

const menuItems = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: FiGrid,
    },
    {
        name: "Customers",
        path: "/customers",
        icon: FiUsers,
    },
    {
        name: "Leads",
        path: "/leads",
        icon: FiUserPlus,
    },
    {
        name: "Tasks",
        path: "/tasks",
        icon: FiCheckSquare,
    },

];

// `collapsed` and `onToggle` are controlled by the parent layout
// so the <main> content area can shift its left margin in sync.
function SideBar({ collapsed, onToggle }) {
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userDetails");

        window.location.href = "/login";
    };

    const user = JSON.parse(
        localStorage.getItem("userDetails") || "{}"
    );
    const displayName = user?.name || "Admin User";
    const displayEmail = user?.email || "admin@crm.com";

    return (
        <aside
            className={`
                fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-200
                bg-white shadow-[1px_0_12px_rgba(0,0,0,0.04)]
                transition-all duration-300 ease-in-out
                ${collapsed ? "w-20" : "w-64"}
            `}
        >
            {/* Logo + toggle */}
            <div className="relative flex h-16 items-center justify-between border-b border-gray-100 px-4">
                {!collapsed && (
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-md shadow-blue-200">
                            <span className="text-sm font-bold text-white">C</span>
                        </div>
                        <h1 className="truncate text-lg font-bold tracking-tight text-gray-900">
                            CRM System
                        </h1>
                    </div>
                )}

                {collapsed && (
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-md shadow-blue-200">
                        <span className="text-sm font-bold text-white">C</span>
                    </div>
                )}

                {/* Toggle floats on the border for a cleaner look */}
                <button
                    onClick={onToggle}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    className="
                        absolute -right-3 top-1/2 flex h-6 w-6 -translate-y-1/2
                        items-center justify-center rounded-full border border-gray-200
                        bg-white text-gray-500 shadow-sm transition
                        hover:border-blue-300 hover:text-blue-600 hover:shadow-md
                    "
                >
                    {collapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
                </button>
            </div>

            {/* User */}
            <div className={`border-b border-gray-100 p-4 ${collapsed ? "px-2" : ""}`}>
                <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : "rounded-xl bg-gray-50 p-2.5"}`}>
                    <div
                        className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-semibold text-white shadow-sm"
                        title={collapsed ? displayName : undefined}
                    >
                        {displayName.charAt(0).toUpperCase()}
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
                    </div>

                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">
                                {displayName}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                                {displayEmail}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                {!collapsed && (
                    <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Menu
                    </p>
                )}
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    title={collapsed ? item.name : undefined}
                                    className={({ isActive }) =>
                                        `
                                        group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                                        transition-all duration-200
                                        ${collapsed ? "justify-center px-0" : ""}
                                        ${isActive
                                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-200"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                        }
                                    `
                                    }
                                >
                                    <Icon
                                        size={18}
                                        className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                                    />
                                    {!collapsed && item.name}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="border-t border-gray-100 p-3">
                <button
                    onClick={handleLogout}
                    title={collapsed ? "Logout" : undefined}
                    className={`
                        group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                        text-red-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600
                        ${collapsed ? "justify-center px-0" : ""}
                    `}
                >
                    <FiLogOut
                        size={18}
                        className="flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
                    />
                    {!collapsed && "Logout"}
                </button>
            </div>
        </aside>
    );
}

export default SideBar;