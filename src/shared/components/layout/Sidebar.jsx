export const Sidebar = () => {
  const items = [
    { label: "Dashboard" },
    { label: "Usuarios" },
    { label: "Restaurantes" },
    { label: "Menús" },
    { label: "Mesas" },
    { label: "Reservas" },
    { label: "Órdenes" },
    { label: "Promociones" },
  ];

  return (
    <aside className="w-72 bg-white min-h-[calc(100vh-5rem)] p-6 border-r border-[#EADDCA]/50 shadow-[4px_0_24px_rgba(74,55,40,0.02)]">
      <nav>
        <p className="text-[10px] font-black text-[#D2B48C] uppercase tracking-[0.2em] mb-6 px-4">
          Menú Principal
        </p>
        
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.label} className="group">
              <div className="flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-[#6F4E37] hover:bg-[#FDF8F3] hover:text-[#4A3728] transition-all duration-300 cursor-pointer border border-transparent hover:border-[#EADDCA]/50 shadow-none hover:shadow-sm">
                {/* Contenedor del Icono */}
                <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-white border border-transparent group-hover:border-[#EADDCA]/30 transition-colors">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.8} 
                    stroke="currentColor" 
                    className="w-5 h-5 text-[#8B4513] group-hover:scale-110 transition-transform"
                  >
                    {item.icon}
                  </svg>
                </div>
                
                <span className="text-sm tracking-tight">{item.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sección inferior decorativa o de soporte */}
      <div className="mt-10 pt-6 border-t border-[#EADDCA]/30">
        <div className="bg-[#4A3728] rounded-2xl p-5 text-center shadow-lg shadow-brown-900/20">
          <p className="text-[10px] font-bold text-[#EADDCA] uppercase tracking-widest mb-1">Kafetery Pro</p>
          <p className="text-[9px] text-white/60 leading-relaxed">Soporte técnico activo las 24h</p>
        </div>
      </div>
    </aside>
  );
};