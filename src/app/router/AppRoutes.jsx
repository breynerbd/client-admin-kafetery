import { Routes, Route } from "react-router-dom"
import { AuthPage } from "../../features/auth/pages/AuthPage.jsx"
import { DashboardPage } from "../layouts/DashboardPage.jsx";

export const AppRoutes = () => {
    return (
        <Routes>
            {/* PÚBLICAS */}
            <Route path="/" element={<AuthPage />} />
            {/* PROTEGIDO POR ROLE */}
            <Route path="/dashboard/*" element={<DashboardPage />} />
        </Routes>
    );
}