import { useState, useEffect } from "react";
import { useSavePromotion } from "../hooks/useSavePromotion.js";
import { useRestaurantStore } from "../../restaurants/store/restaurantStore";
import { showError, showSuccess } from "../../../shared/utils/toast.js";
import { X, TicketPercent, Calendar, Tag, Percent, Hash, AlignLeft, ChevronDown, Store } from "lucide-react";

export const PromotionModal = ({ isOpen, onClose, promotion }) => {
    const { savePromotion } = useSavePromotion();
    const { restaurants, getRestaurants } = useRestaurantStore();
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        title: "", code: "", description: "", type: "FIXED",
        value: "", restaurant: "", validFrom: "", validTo: ""
    });

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            getRestaurants();

            if (promotion) {
                setFormData({
                    title: promotion.title || "",
                    code: promotion.code || "",
                    description: promotion.description || "",
                    type: promotion.type || "FIXED",
                    value: promotion.value || "",
                    restaurant: promotion.restaurant?._id || promotion.restaurant || "",
                    validFrom: promotion.validFrom ? new Date(promotion.validFrom).toISOString().slice(0, 16) : "",
                    validTo: promotion.validTo ? new Date(promotion.validTo).toISOString().slice(0, 16) : ""
                });
            } else {
                setFormData({ title: "", code: "", description: "", type: "FIXED", value: "", restaurant: "", validFrom: "", validTo: "" });
            }
        }
    }, [promotion, isOpen, getRestaurants]);

    const validateForm = () => {
        let newErrors = {};
        
        if (!formData.title.trim()) newErrors.title = "El título es obligatorio";
        if (!formData.code.trim()) newErrors.code = "El código es requerido";
        if (!formData.value || formData.value <= 0) newErrors.value = "Ingresa un valor válido";
        if (!formData.restaurant) newErrors.restaurant = "Selecciona una sucursal";
        if (!formData.validFrom) newErrors.validFrom = "Fecha de inicio requerida";
        if (!formData.validTo) newErrors.validTo = "Fecha de fin requerida";
        
        // Validación lógica de fechas
        if (formData.validFrom && formData.validTo && formData.validFrom > formData.validTo) {
            newErrors.validTo = "La fecha final debe ser posterior";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await savePromotion({ ...formData, value: parseFloat(formData.value) || 0 }, promotion?._id || promotion?.id);
            showSuccess(promotion ? "Promoción actualizada" : "Promoción creada");
            onClose();
        } catch (error) { 
            showError("Error al procesar la solicitud"); 
        } finally { 
            setLoading(false); 
        }
    };

    const ErrorLabel = ({ field }) => (
        errors[field] ? (
            <span className="text-red-500 text-[9px] font-black uppercase mt-1 ml-1 animate-in fade-in slide-in-from-top-1 tracking-tighter">
                {errors[field]}
            </span>
        ) : null
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#4A3728]/80 backdrop-blur-md flex justify-center items-end md:items-center z-[100] p-0 md:p-4 transition-all">
            <div className="bg-white rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl w-full max-w-2xl max-h-[94vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom md:zoom-in duration-300 border border-[#EADDCA]/50">
                
                {/* Header */}
                <div className="p-6 md:p-8 text-white shrink-0" style={{ background: "linear-gradient(135deg, #4A3728 0%, #8B4513 100%)" }}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl">
                                <TicketPercent size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none">
                                    {promotion ? "Editar Promoción" : "Nueva Promoción"}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            
                            {/* Título */}
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-widest">
                                    <Tag size={12}/> Nombre de la Campaña
                                </label>
                                <input 
                                    type="text" 
                                    value={formData.title} 
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                                    className={`w-full px-5 py-4 bg-white border ${errors.title ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#4A3728] font-bold outline-none transition-all`} 
                                    placeholder="Ej. Black Friday" 
                                />
                                <ErrorLabel field="title" />
                            </div>

                            {/* Código */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-widest">
                                    <Hash size={12}/> Código de Cupón
                                </label>
                                <input 
                                    type="text" 
                                    value={formData.code} 
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
                                    className={`w-full px-5 py-4 bg-white border ${errors.code ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#8B4513] font-mono font-black uppercase outline-none`} 
                                    placeholder="PROMO2024" 
                                />
                                <ErrorLabel field="code" />
                            </div>

                            {/* Valor */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-widest">
                                    <Percent size={12}/> Valor / Porcentaje
                                </label>
                                <input 
                                    type="number" 
                                    value={formData.value} 
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })} 
                                    className={`w-full px-5 py-4 bg-white border ${errors.value ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#4A3728] font-bold outline-none`} 
                                    placeholder="0.00" 
                                />
                                <ErrorLabel field="value" />
                            </div>

                            {/* Fechas */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-widest">
                                    <Calendar size={12}/> Inicia
                                </label>
                                <input 
                                    type="datetime-local" 
                                    value={formData.validFrom} 
                                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })} 
                                    className={`w-full px-5 py-4 bg-white border ${errors.validFrom ? 'border-red-500' : 'border-[#EADDCA]'} rounded-2xl text-xs font-bold outline-none`} 
                                />
                                <ErrorLabel field="validFrom" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-widest">
                                    <Calendar size={12}/> Finaliza
                                </label>
                                <input 
                                    type="datetime-local" 
                                    value={formData.validTo} 
                                    onChange={(e) => setFormData({ ...formData, validTo: e.target.value })} 
                                    className={`w-full px-5 py-4 bg-white border ${errors.validTo ? 'border-red-500' : 'border-[#EADDCA]'} rounded-2xl text-xs font-bold outline-none`} 
                                />
                                <ErrorLabel field="validTo" />
                            </div>

                            {/* CUADRO DE SELECCIÓN (SELECT) PARA SUCURSAL */}
                            <div className="md:col-span-2 space-y-1.5 pt-2">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-widest">
                                    <Store size={12}/> Seleccionar Sucursal
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.restaurant}
                                        onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}
                                        className={`w-full px-5 py-4 bg-white border-2 border-dashed ${errors.restaurant ? 'border-red-500 bg-red-50' : 'border-[#EADDCA]'} rounded-2xl text-[#4A3728] font-bold text-sm appearance-none cursor-pointer outline-none transition-all`}
                                    >
                                        <option value="" disabled>Elige la sucursal de destino...</option>
                                        {restaurants?.map((r) => (
                                            <option key={r._id} value={r._id}>
                                                {r.name} — {r.location || 'Sucursal Principal'}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#D2B48C]">
                                        <ChevronDown size={18} />
                                    </div>
                                </div>
                                <ErrorLabel field="restaurant" />
                            </div>

                            {/* Descripción */}
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-widest">
                                    <AlignLeft size={12}/> Notas adicionales
                                </label>
                                <textarea 
                                    rows="2" 
                                    value={formData.description} 
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                                    className="w-full px-5 py-4 bg-white border border-[#EADDCA] rounded-2xl text-sm outline-none resize-none focus:ring-4 focus:ring-[#8B4513]/5 transition-all" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer con System ID discreto */}
                    <div className="p-8 md:p-10 bg-white border-t border-[#EADDCA]/30 shrink-0 space-y-4">
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full py-4 rounded-2xl bg-[#4A3728] text-white hover:bg-[#8B4513] transition-all font-black text-xs uppercase tracking-[0.25em] shadow-2xl active:scale-95 flex items-center justify-center min-h-[60px] disabled:opacity-50"
                        >
                            {loading ? "PROCESANDO..." : (promotion ? "GUARDAR CAMBIOS" : "LANZAR PROMOCIÓN")}
                        </button>
                        
                        {promotion && (
                            <div className="flex justify-center items-center gap-2 opacity-40">
                                <Fingerprint size={10} className="text-[#4A3728]"/>
                                <span className="text-[8px] font-mono uppercase tracking-tighter text-[#4A3728]">
                                    UID: {promotion._id || promotion.id}
                                </span>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};