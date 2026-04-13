import { Navbar } from "./Navbar.jsx";
import { Sidebar } from "./Sidebar.jsx";

export const DashboardContainer = () => {
  return (
    <div className="min-h-screen bg-[#FDF8F3] flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-[#FDF8F3] to-[#F5E6D3]">
          <div className="max-w-[1400px] mx-auto bg-white rounded-[2.5rem] shadow-xl shadow-brown-900/5 border border-[#EADDCA]/50 p-8">
            
            {/* Cabecera del Dashboard */}
            <div className="mb-10 flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black text-[#4A3728] tracking-tighter uppercase">
                  Panel Administrativo
                </h2>
                <div className="h-1.5 w-20 bg-[#8B4513] mt-2 rounded-full"></div>
                <p className="text-[#6F4E37] mt-3 font-medium">
                  Gestión de sucursales, pedidos y calidad Kafetery
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardContainer;