import { Link, useLocation } from "react-router-dom";
import { X, LayoutDashboard, Users, Store, BookOpen, Calendar, ShoppingBag, TicketPercent, UtensilsCrossed } from "lucide-react";
import imgLogo from "../../../assets/img/Kafetery_logo.png";

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  // Definición de ítems: El id vacío "" apunta a la raíz /dashboard (HomeDashboard)
  const items = [
    { id: "", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "users", label: "Usuarios", icon: <Users size={20} /> },
    { id: "restaurants", label: "Restaurantes", icon: <Store size={20} /> },
    { id: "menus", label: "Menús", icon: <BookOpen size={20} /> },
    { id: "tables", label: "Mesas", icon: <UtensilsCrossed size={20} /> },
    { id: "reservations", label: "Reservas", icon: <Calendar size={20} /> },
    { id: "orders", label: "Órdenes", icon: <ShoppingBag size={20} /> },
    { id: "promotions", label: "Promociones", icon: <TicketPercent size={20} /> },
  ];

  return (
    <>
      {/* Overlay para móviles con desenfoque */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#4A3728]/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-[70] w-72 bg-white flex flex-col h-full
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
          lg:static lg:z-0 lg:shadow-none lg:border-r lg:border-[#EADDCA]/50
        `}
      >
        {/* LOGO Y BOTÓN CERRAR */}
        <div className="p-6 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-xl border border-[#EADDCA]/30">
              <img
                src={imgLogo}
                alt="Kafetery Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-black text-[#4A3728] text-sm tracking-widest uppercase italic">
              Kafetery
            </span>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl bg-[#FDF8F3] border border-[#EADDCA] text-[#8B4513] active:scale-95 transition-transform"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="flex-1 overflow-y-auto px-6 py-2 no-scrollbar">
          <p className="text-[10px] font-black text-[#D2B48C] uppercase tracking-[0.2em] mb-4">
            Gestión de Sistema
          </p>

          <ul className="space-y-1.5 pb-6">
            {items.map((item) => {
              // Construcción de la ruta: /dashboard o /dashboard/users, etc.
              const targetPath = item.id === "" ? "/dashboard" : `/dashboard/${item.id}`;
              const isActive = location.pathname === targetPath;

              return (
                <li key={item.id || 'home'}>
                  <Link
                    to={targetPath}
                    onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                    className={`
                      flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all border
                      ${isActive
                        ? "bg-[#FDF8F3] text-[#4A3728] border-[#EADDCA]/60 shadow-sm translate-x-1"
                        : "text-[#8B4513]/70 border-transparent hover:bg-[#FDF8F3]/40 hover:translate-x-1"
                      }
                    `}
                  >
                    {/* Icono con contenedor dinámico */}
                    <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-[#4A3728] text-white shadow-md" : "bg-[#FDF8F3] text-[#8B4513]"
                      }`}>
                      {item.icon}
                    </div>
                    <span className="text-sm tracking-tight">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* FOOTER DEL SIDEBAR */}
        <div className="p-6 mt-auto shrink-0 border-t border-[#FDF8F3]">
          <div className="bg-[#4A3728] rounded-[1.5rem] p-4 text-center shadow-lg shadow-brown-900/20">
            <p className="text-[10px] font-black text-[#EADDCA] uppercase tracking-widest">Kafetery Pro</p>
            <p className="text-[9px] text-white/50 italic">Soporte Activo v2.1</p>
          </div>
        </div>
      </aside>
    </>
  );
};