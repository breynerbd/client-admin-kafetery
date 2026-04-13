import { DashboardContainer } from "../../shared/components/layout/DashboardContainer.jsx";

export const DashboardPage = () => {
    return (
        <DashboardContainer>
            <div className="mb-8">
                {/* Título Principal */}
                <h1 className="text-5xl font-black text-[#4A3728] tracking-tighter uppercase">
                    Dashboard
                </h1>
                
                {/* Línea decorativa sutil estilo Kafetery */}
                <div className="h-1.5 w-24 bg-[#8B4513] mt-2 rounded-full shadow-sm"></div>
                
                <p className="text-[#6F4E37] mt-4 font-medium text-lg italic">
                    Bienvenido al centro de gestión administrativa.
                </p>
            </div>

        </DashboardContainer>
    );
};