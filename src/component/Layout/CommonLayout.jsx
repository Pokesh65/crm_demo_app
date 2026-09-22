import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

function CommonLayout() {
    // Persist the preference so it survives a refresh.
    const [collapsed, setCollapsed] = useState(
        () => localStorage.getItem("sidebarCollapsed") === "true"
    );

    const toggleSidebar = () => {
        setCollapsed((prev) => {
            const next = !prev;
            localStorage.setItem("sidebarCollapsed", String(next));
            return next;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <SideBar collapsed={collapsed} onToggle={toggleSidebar} />

            {/* Content — margin shifts in sync with the sidebar width */}
            <main
                className={`
                    min-h-screen transition-all duration-300 ease-in-out
                    ${collapsed ? "lg:ml-20" : "lg:ml-64"}
                `}
            >
                <div className="p-0.5">
                    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CommonLayout;