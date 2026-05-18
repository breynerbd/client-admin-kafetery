import { useState, useEffect } from "react";
import { useOrdersStore } from "../store/orderStore.js";
import { showError, showSuccess } from "../../../shared/utils/toast.js";
import { showConfirmToast } from "../../auth/components/ConfirmModal";
import { OrderModal } from "./OrderModal.jsx";
import { Plus, Trash2, Pencil, Receipt, Hash, Copy, Utensils } from "lucide-react";

export const Orders = () => {
    const { orders = [], getOrders, deactivateOrder } = useOrdersStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => { getOrders(); }, [getOrders]);

    const handleCreate = () => { setSelectedOrder(null); setIsModalOpen(true); };
    const handleManage = (order) => { setSelectedOrder(order); setIsModalOpen(true); };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        showSuccess("ID copiado");
    };

    const handleDelete = (orderId) => {
        showConfirmToast({
            title: "¿Eliminar orden?",
            message: "¿Estás seguro de que deseas eliminar esta orden?",
            onConfirm: async () => {
                try {
                    await deactivateOrder(orderId);
                    showSuccess("Orden eliminada exitosamente");
                    await getOrders();
                } catch (err) { showError("Error al eliminar"); }
            }
        });
    };

    return (
        <div className="p-3 md:p-8 max-w-7xl mx-auto overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-10">
               <div className="space-y-1 text-center md:text-left">
                    <h1 className="text-4xl font-black text-[#4A3728] uppercase tracking-tighter italic">Sala de Control</h1>
                    <p className="text-[#D2B48C] font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-2">
                        <span className="w-8 h-[2px] bg-[#8B4513]"></span> Gestión de Órdenes
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="group bg-[#4A3728] text-white px-8 py-4 rounded-2xl font-black hover:bg-[#8B4513] transition-all shadow-xl shadow-[#4A3728]/20 flex items-center justify-center gap-3 active:scale-95"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    <span className="uppercase tracking-widest text-xs">Nueva Orden</span>
                </button>
            </div>

            {/* VISTA MÓVIL (Cards) - FIX DE DESBORDAMIENTO */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
    {orders.map((order, index) => (
        <div key={order._id || index} className="bg-white p-5 rounded-[2rem] border border-[#EADDCA]/50 shadow-sm flex flex-col w-full overflow-hidden">
            
            {/* ID Section: Ajustado para no desbordar */}
            <div className="mb-4 p-3 bg-[#FDF8F3] rounded-xl border border-[#EADDCA]/30 flex justify-between items-start gap-2">
                <div className="flex flex-col min-w-0 flex-1"> {/* min-w-0 es clave aquí */}
                    <span className="text-[8px] font-black text-[#D2B48C] uppercase tracking-widest">Order ID</span>
                    <code className="text-[9px] font-mono font-bold text-[#8B4513] break-all leading-tight">
                        {String(order._id || order.id).toUpperCase()}
                    </code>
                </div>
                <Receipt size={14} className="text-[#D2B48C] shrink-0 mt-1" />
            </div>
            
            {/* Mesa Section: Con truncate y flex-wrap para manejar IDs largos */}
            <div className="flex flex-col mb-4 gap-1">
                <div className="flex items-center gap-1.5 text-[#8B4513]">
                    <Hash size={14} className="shrink-0"/>
                    <span className="text-[10px] font-black uppercase tracking-widest">Mesa</span>
                </div>
                <div className="flex justify-between items-baseline gap-2">
                    {/* El ID de la mesa ahora se romperá si es muy largo en lugar de empujar el cuadro */}
                    <span className="font-black text-[#4A3728] text-base break-all flex-1 leading-tight">
                        {order.table || 'N/A'}
                    </span>
                    <span className="text-[#8B4513] font-black text-lg italic shrink-0">
                        Q{order.totalPrice?.toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-6 bg-[#4A3728] w-fit px-3 py-1.5 rounded-xl shrink-0">
                <Utensils size={10} className="text-[#EADDCA]" />
                <span className="text-white font-mono font-bold text-[9px] uppercase tracking-widest">
                    {order.items?.length || 0} Prod.
                </span>
            </div>

            {/* Botones responsivos */}
            <div className="flex gap-2 mt-auto pt-4 border-t border-[#EADDCA]/30">
                <button 
                    onClick={() => handleManage(order)} 
                    className="flex-1 py-3 rounded-xl bg-[#4A3728] text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                    <Pencil size={14}/> Editar
                </button>
                <button 
                    onClick={() => handleDelete(order._id || order.id)} 
                    className="w-14 p-3 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center active:scale-95 transition-transform"
                >
                    <Trash2 size={18}/>
                </button>
            </div>
        </div>
    ))}
</div>

            {/* VISTA DESKTOP (Tabla) */}
            <div className="hidden lg:block bg-white rounded-[3rem] shadow-2xl shadow-brown-900/5 border border-[#EADDCA]/50 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#FDF8F3]">
                        <tr>
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-[#D2B48C] tracking-widest">ID de la Orden</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-[#D2B48C] tracking-widest">Mesa (ID)</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-[#D2B48C] tracking-widest">Items</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-[#D2B48C] tracking-widest">Total</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase text-[#D2B48C] tracking-widest text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EADDCA]/20">
                        {orders.length > 0 ? (
                            orders.map((order, index) => (
                                <tr key={order._id || index} className="hover:bg-[#FDF8F3]/40 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <code className="text-[11px] font-mono font-bold text-[#8B4513] bg-[#FDF8F3] px-3 py-1 rounded-lg border border-[#EADDCA]/50">
                                                {order._id || order.id}
                                            </code>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-[#4A3728] uppercase text-sm">{order.table || 'N/A'}</p>
                                        <p className="text-[10px] text-[#6F4E37] font-mono">
                                            USER: {typeof order.user === 'string' ? order.user.slice(-6) : order.user?._id?.slice(-6) || 'N/A'}
                                        </p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="bg-[#4A3728] text-white px-3 py-1.5 rounded-lg font-mono font-bold text-[10px] uppercase tracking-widest">
                                            {order.items?.length || 0} PRODUCTO(S)
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="font-black text-[#4A3728] text-sm">Q{order.totalPrice?.toFixed(2)}</span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleManage(order)} className="p-2.5 bg-[#FDF8F3] text-[#4A3728] rounded-xl hover:bg-[#4A3728] hover:text-white transition-all">
                                                <Pencil size={18}/>
                                            </button>
                                            <button onClick={() => handleDelete(order._id || order.id)} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center text-[#D2B48C] italic font-medium">No hay órdenes registradas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <OrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} order={selectedOrder} />
        </div>
    );
};