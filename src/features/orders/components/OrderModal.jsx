import { useState, useEffect } from "react";
import { useSaveOrder } from "../hooks/useSaveOrder.js";
import { useMenuStore } from "../../menus/store/menuStore.js"; 
import { useRestaurantStore } from "../../restaurants/store/restaurantStore.js";
import { useUsersStore } from "../../users/store/userStore.js";
import { useTableStore } from "../../tables/store/tableStore.js"; 
import { showError, showSuccess } from "../../../shared/utils/toast.js";
import { X, User, Utensils, Hash, Plus, Trash2, Fingerprint, Activity, Store, ChevronDown, ShoppingBag } from "lucide-react";

export const OrderModal = ({ isOpen, onClose, order }) => {
    const { saveOrder } = useSaveOrder();
    const { menus, getMenus } = useMenuStore();
    const { restaurants, getRestaurants } = useRestaurantStore();
    const { users, getUsers } = useUsersStore();
    const { tables, getTables } = useTableStore();
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        user: "", restaurant: "", table: "", items: [{ menu: "", quantity: 1 }], status: "PENDING"
    });

    const statusOptions = [
        { value: 'PENDING', label: 'Pendiente' },
        { value: 'CONFIRMED', label: 'Confirmada' },
        { value: 'PREPARING', label: 'En Preparación' },
        { value: 'READY', label: 'Listo para Entrega' },
        { value: 'DELIVERED', label: 'Entregado' },
        { value: 'CANCELED', label: 'Cancelado' }
    ];

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            getMenus();
            getRestaurants();
            getUsers();
            getTables();

            if (order) {
                setFormData({
                    user: order.user?._id || order.user || "",
                    restaurant: order.restaurant?._id || order.restaurant || "",
                    table: order.table?._id || order.table || "", 
                    status: order.status || "PENDING",
                    items: order.items?.map(item => ({
                        menu: item.menu?._id || item.menu || "",
                        quantity: item.quantity || 1
                    })) || [{ menu: "", quantity: 1 }]
                });
            } else {
                setFormData({ user: "", restaurant: "", table: "", items: [{ menu: "", quantity: 1 }], status: "PENDING" });
            }
        }
    }, [order, isOpen, getMenus, getRestaurants, getUsers, getTables]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.user) newErrors.user = "Selecciona un cliente";
        if (!formData.restaurant) newErrors.restaurant = "Selecciona un restaurante";
        if (!formData.table) newErrors.table = "Selecciona una mesa";
        
        const itemErrors = formData.items.map(item => {
            if (!item.menu) return "Selecciona un platillo";
            if (item.quantity <= 0) return "Mínimo 1";
            return null;
        });

        if (itemErrors.some(e => e !== null)) newErrors.items = itemErrors;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddItem = () => {
        if (order) return; // Protección extra
        setFormData({ ...formData, items: [...formData.items, { menu: "", quantity: 1 }] });
    };

    const handleRemoveItem = (index) => {
        if (order) return; // Protección extra
        if (formData.items.length === 1) return showError("La orden debe tener al menos un item");
        const newItems = formData.items.filter((_, idx) => idx !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleItemChange = (index, field, value) => {
        if (order) return; // Protección extra
        const newItems = [...formData.items];
        newItems[index][field] = field === "quantity" ? Number(value) : value;
        setFormData({ ...formData, items: newItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await saveOrder(formData, order?._id || order?.id);
            showSuccess(order ? "Orden actualizada" : "Orden lanzada");
            onClose();
        } catch (error) {
            showError("Error al procesar la orden");
        } finally { setLoading(false); }
    };

    const ErrorLabel = ({ message }) => (
        message ? <span className="text-[9px] text-red-500 font-black uppercase mt-1 ml-1 tracking-tighter">{message}</span> : null
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#4A3728]/80 backdrop-blur-md flex justify-center items-end md:items-center z-[100] p-0 md:p-4">
            <div className="bg-white rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl w-full max-w-2xl max-h-[94vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom md:zoom-in duration-300 border border-[#EADDCA]/50">
                
                {/* Header */}
                <div className="p-6 md:p-8 text-white shrink-0" style={{ background: "linear-gradient(135deg, #4A3728 0%, #8B4513 100%)" }}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl">
                                <ShoppingBag size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none">
                                    {order ? "Gestionar Orden" : "Nueva Orden"}
                                </h2>
                                <p className="text-[10px] text-[#EADDCA] font-bold uppercase tracking-widest mt-1">KAFETERY MANAGEMENT</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                            <X size={28} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col overflow-hidden bg-[#FDF8F3]/30">
                    <div className="p-6 md:p-10 overflow-y-auto space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Cliente */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-widest">
                                    <User size={12}/> ID Cliente
                                </label>
                                <div className="relative">
                                    <select 
                                        disabled={!!order}
                                        value={formData.user}
                                        onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                                        className={`w-full px-4 py-3 bg-white border ${errors.user ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-xl text-xs font-bold text-[#4A3728] appearance-none outline-none disabled:opacity-60 disabled:cursor-not-allowed pr-10`}
                                    >
                                        <option value="">Seleccionar cliente...</option>
                                        {users.map(u => (
                                            <option key={u._id} value={u._id}>
                                                {u.name || u.username || u.email}
                                            </option>
                                        ))}
                                    </select>
                                    {!order && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D2B48C] pointer-events-none" size={16}/>}
                                </div>
                                <ErrorLabel message={errors.user} />
                            </div>

                            {/* Mesa */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-widest">
                                    <Hash size={12}/> Número de Mesa
                                </label>
                                <div className="relative">
                                    <select 
                                        disabled={!!order}
                                        value={formData.table}
                                        onChange={(e) => setFormData({ ...formData, table: e.target.value })}
                                        className={`w-full px-4 py-3 bg-white border ${errors.table ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-xl text-xs font-bold text-[#4A3728] appearance-none outline-none disabled:opacity-60 disabled:cursor-not-allowed pr-10`}
                                    >
                                        <option value="">Seleccionar mesa...</option>
                                        {tables.map(t => (
                                            <option key={t._id} value={t._id}>
                                                Mesa {t.tableNumber || `Sin número`} 
                                            </option>
                                        ))}
                                    </select>
                                    {!order && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D2B48C] pointer-events-none" size={16}/>}
                                </div>
                                <ErrorLabel message={errors.table} />
                            </div>

                            {/* Sucursal de Preparación */}
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-widest">
                                    <Store size={12}/> Sucursal de Preparación
                                </label>
                                <div className="relative">
                                    <select 
                                        disabled={!!order}
                                        value={formData.restaurant}
                                        onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}
                                        className={`w-full px-4 py-3 bg-white border ${errors.restaurant ? 'border-red-500' : 'border-[#EADDCA]'} rounded-xl text-xs font-bold text-[#4A3728] appearance-none outline-none disabled:opacity-60 disabled:cursor-not-allowed pr-10`}
                                    >
                                        <option value="">Seleccionar restaurante...</option>
                                        {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                                    </select>
                                    {!order && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D2B48C] pointer-events-none" size={16}/>}
                                </div>
                                <ErrorLabel message={errors.restaurant} />
                            </div>
                        </div>

                        {/* Estado Actual — MANTENER TOTALMENTE HABILITADO */}
                        <div className="space-y-1.5 pt-2">
                            <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-widest">
                                <Activity size={12}/> Estado Actual
                            </label>
                            <div className="relative">
                                <select 
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#4A3728] text-white border-none rounded-xl text-[10px] font-black uppercase tracking-widest appearance-none outline-none cursor-pointer pr-10"
                                >
                                    {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={16}/>
                            </div>
                        </div>

                        {/* Detalle de Comanda */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 tracking-widest"><Utensils size={12}/> Detalle de Comanda</label>
                                
                                {!order && (
                                    <button type="button" onClick={handleAddItem} className="bg-[#8B4513] text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-lg flex items-center gap-1 hover:scale-105 transition-transform active:scale-95">
                                        <Plus size={10}/> Añadir Plato
                                    </button>
                                )}
                            </div>
                            
                            <div className="space-y-3">
                                {formData.items.map((item, index) => (
                                    <div key={index} className="flex flex-col gap-1">
                                        <div className={`flex gap-3 items-center bg-white px-4 py-3 rounded-2xl border ${errors.items?.[index] ? 'border-red-500 bg-red-50' : 'border-[#EADDCA]'} shadow-sm transition-colors ${order ? 'opacity-70 bg-gray-50' : ''}`}>
                                            
                                            <div className="relative flex-1">
                                                <select 
                                                    disabled={!!order}
                                                    value={item.menu} 
                                                    onChange={(e) => handleItemChange(index, "menu", e.target.value)}
                                                    className="w-full bg-transparent text-xs font-bold text-[#4A3728] outline-none appearance-none disabled:cursor-not-allowed pr-6"
                                                >
                                                    <option value="">Seleccionar platillo...</option>
                                                    {menus.map(m => (
                                                        <option key={m._id} value={m._id}>{m.name} — ${m.price}</option>
                                                    ))}
                                                </select>
                                                {!order && <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-[#D2B48C] pointer-events-none" size={14}/>}
                                            </div>
                                            
                                            <div className="flex items-center bg-[#FDF8F3] rounded-xl border border-[#EADDCA]/30 px-2 shrink-0">
                                                <input 
                                                    disabled={!!order}
                                                    type="number" min="1" value={item.quantity} 
                                                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                                    className="w-10 bg-transparent text-center font-black text-[#8B4513] py-2 text-xs outline-none disabled:cursor-not-allowed"
                                                />
                                            </div>
                                            
                                            {!order && (
                                                <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-400 hover:text-red-600 transition-colors active:scale-90 shrink-0">
                                                    <Trash2 size={16}/>
                                                </button>
                                            )}
                                        </div>
                                        {errors.items?.[index] && <span className="text-[8px] text-red-500 font-bold ml-3 uppercase italic">{errors.items[index]}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-8 md:p-10 bg-white border-t border-[#EADDCA]/30 shrink-0 space-y-4">
                        <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-[#4A3728] text-white hover:bg-[#8B4513] transition-all font-black text-xs uppercase tracking-[0.25em] shadow-xl active:scale-95 flex items-center justify-center min-h-[60px] disabled:opacity-50">
                            {loading ? "SINCRONIZANDO..." : (order ? "ACTUALIZAR ESTADO" : "LANZAR A COCINA")}
                        </button>
                        
                        {order && (
                            <div className="flex justify-center items-center gap-2 opacity-30">
                                <Fingerprint size={10}/>
                                <span className="text-[8px] font-mono tracking-tighter italic">TX-ID: {order._id}</span>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};