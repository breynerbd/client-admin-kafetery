import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute.jsx"; // <- Importamos la protección

// Layouts y Páginas Base
import AuthPage from "../../features/auth/pages/AuthPage.jsx";
import { DashboardContainer } from "../../shared/components/layout/DashboardContainer.jsx";
import { HomeDashboard } from "../../shared/components/layout/HomeDashboard.jsx";

// Features: Menus
import { Menus } from "../../features/menus/components/Menus.jsx";
import { MenuModal } from "../../features/menus/components/MenuModal.jsx";

// Features: Orders
import { Orders } from "../../features/orders/components/Orders.jsx";
import { OrderModal } from "../../features/orders/components/OrderModal.jsx";

// Features: Promotions
import { Promotions } from "../../features/promotions/components/Promotions.jsx";
import { PromotionModal } from "../../features/promotions/components/PromotionModal.jsx";

// Features: Reservations
import { Reservations } from "../../features/reservations/components/Reservations.jsx";
import { ReservationModal } from "../../features/reservations/components/ReservationModal.jsx";

// Features: Restaurants
import { Restaurants } from "../../features/restaurants/components/Restaurants.jsx";
import { RestaurantModal } from "../../features/restaurants/components/RestaurantModal.jsx";

// Features: Tables
import { Tables } from "../../features/tables/components/Tables.jsx";
import { TableModal } from "../../features/tables/components/TableModal.jsx";

// Features: Users
import { Users } from "../../features/users/components/Users.jsx";
import { UserModal } from "../../features/users/components/UserModal.jsx";

export const AppRoutes = () => {
    return (
        <Routes>
            {/* RUTA PÚBLICA: Login / Registro */}
            <Route path="/" element={<AuthPage />} />

            {/* RUTAS PRIVADAS EN CAPSULADAS POR EL PROTECTEDROUTE */}
            <Route element={<ProtectedRoute />}>
                
                <Route path="/dashboard/*" element={<DashboardContainer />}>

                    {/* 1. Vista principal (Resumen general) */}
                    <Route index element={<HomeDashboard />} />

                    {/* 2. Sección de Menús */}
                    <Route path="menus" element={<Menus />} />
                    <Route path="menus/create" element={<MenuModal />} />

                    {/* 3. Sección de Órdenes */}
                    <Route path="orders" element={<Orders />} />
                    <Route path="orders/create" element={<OrderModal />} />

                    {/* 4. Sección de Promociones */}
                    <Route path="promotions" element={<Promotions />} />
                    <Route path="promotions/create" element={<PromotionModal />} />

                    {/* 5. Sección de Reservaciones */}
                    <Route path="reservations" element={<Reservations />} />
                    <Route path="reservations/create" element={<ReservationModal />} />

                    {/* 6. Sección de Restaurantes */}
                    <Route path="restaurants" element={<Restaurants />} />
                    <Route path="restaurants/create" element={<RestaurantModal />} />

                    {/* 7. Sección de Mesas */}
                    <Route path="tables" element={<Tables />} />
                    <Route path="tables/create" element={<TableModal />} />

                    {/* 8. Sección de Usuarios / Staff */}
                    <Route path="users" element={<Users />} />
                    <Route path="users/create" element={<UserModal />} />

                </Route>
                
            </Route>

            {/* MANEJO DE ERRORES: 404 o Redirección */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};