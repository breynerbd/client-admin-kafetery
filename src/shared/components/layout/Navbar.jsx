import imgLogo from "../../../assets/img/Kafetery_logo.png";

export const Navbar = () => {
    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-[60] border-b border-[#EADDCA]/60 shadow-sm">
            {/* Usamos 'px-6' en lugar de un max-width restrictivo si quieres que esté 
               lo más pegado posible a los bordes, o 'max-w-[1440px]' para control.
            */}
            <div className="w-full mx-auto px-6 h-20 flex items-center justify-between">

                {/* SECCIÓN IZQUIERDA: Logo + Branding (Pegados al borde izquierdo) */}
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="bg-[#FDF8F3] p-2 rounded-xl border border-[#EADDCA] transition-transform group-hover:scale-105 shadow-sm">
                        <img
                            src={imgLogo}
                            alt="Kafetery Logo"
                            className="h-10 w-auto object-contain"
                        />
                    </div>
                    
                    <div className="flex flex-col">
                        <h1 className="font-black text-[#4A3728] text-xl tracking-tighter leading-none">
                            KAFETERY
                        </h1>
                        <span className="text-[10px] font-bold text-[#8B4513] uppercase tracking-[0.2em] mt-1">
                            Management System
                        </span>
                    </div>
                </div>

                {/* SECCIÓN DERECHA: Notificaciones + Perfil */}
                <div className="flex items-center gap-4 md:gap-6">
                    
                    {/* Botón de Notificaciones con Campanita SVG */}
                    <button className="relative group p-2.5 text-[#8B4513] hover:bg-[#FDF8F3] rounded-xl transition-all duration-300 border border-transparent hover:border-[#EADDCA]">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={1.8} 
                            stroke="currentColor" 
                            className="w-6 h-6 group-hover:rotate-12 transition-transform"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                        </svg>

                        {/* Indicador de notificación (Punto rojo con pulso) */}
                        <span className="absolute top-2 right-2 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 border-2 border-white"></span>
                        </span>
                    </button>

                    {/* Divisor vertical sutil */}
                    <div className="h-8 w-[1px] bg-[#EADDCA]"></div>

                    {/* Perfil de Usuario */}
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black text-[#4A3728]">Admin Principal</p>
                            <p className="text-[10px] font-bold text-[#D2B48C] uppercase tracking-wider">Gerencia</p>
                        </div>
                        
                        <div className="relative group cursor-pointer">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#EADDCA] to-[#D2B48C] p-[2px] shadow-md transition-transform group-hover:rotate-3">
                                <div className="w-full h-full rounded-[14px] bg-[#FDF8F3] flex items-center justify-center text-[#4A3728] font-black text-lg border border-white/50">
                                    A
                                </div>
                            </div>
                            {/* Punto de estado online */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};