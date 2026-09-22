import { Navigate } from "react-router-dom";
import { lazy } from "react";

import CommonLayout from "../component/layout/CommonLayout";
import { selectAllAuth } from "../store/selectors/AuthSelector";
import { useSelector } from "react-redux";
const DashboardPage = lazy(() => import("../pages/Dashboard/DashboardPage"));
const LoginPage = lazy(() => import("../pages/Login/LoginPage"));
const RegisterPage = lazy(() => import("../pages/Register/RegisterPage"));
const CustomerPage = lazy(() => import("../pages/Customer/CustomerPage"));
const LeadPage = lazy(() => import("../pages/Leads/LeadPage"));
const TaskPage = lazy(() => import("../pages/Tasks/TaskPage"))
const CustomerDetailPage = lazy(() => import("../pages/CustomerDetails/CustomerDetailPage"))

// ─────────────────────────────────────────────
// Protected Route
// ─────────────────────────────────────────────
export const ProtectedRoute = ({ children }) => {

    const { isAuthenticated } = useSelector(selectAllAuth);
    console.log("isAuthenticated", isAuthenticated)

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;

};

// ─────────────────────────────────────────────
// Public Routes
// ─────────────────────────────────────────────
export const publicRoutes = [
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
];

// ─────────────────────────────────────────────
// Protected Routes
// ─────────────────────────────────────────────
export const protectedRoutes = [
    {
        path: "/dashboard",
        element: <DashboardPage />,
    },
    {
        path: "/customers",
        element: <CustomerPage />,
    },
    {
        path: "/leads",
        element: <LeadPage />,
    },
    {
        path: "/tasks",
        element: <TaskPage />,
    },
    {
        path: "/customerDetails",
        element: <CustomerDetailPage />,
    },
];

// ─────────────────────────────────────────────
// All Routes
// ─────────────────────────────────────────────
export const routes = [
    // Login is NOT protected
    ...publicRoutes,

    // Everything below is protected
    {
        element: (
            <ProtectedRoute>
                <CommonLayout />
            </ProtectedRoute>
        ),
        children: protectedRoutes,
    },
];