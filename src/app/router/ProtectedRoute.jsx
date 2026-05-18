import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore";
 
export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
 
  // Verificamos si está autenticado y si es ADMIN (según tu lógica de store)
  if (!isAuthenticated || user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
 
  // Si todo está bien, renderiza las rutas hijas
  return <Outlet />;
};