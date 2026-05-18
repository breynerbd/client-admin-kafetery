import { useState, useEffect } from "react";
import { useSaveMenu } from "../hooks/useSaveMenu.js";
import { useRestaurantStore } from "../../restaurants/store/restaurantStore.js";
import { showError, showSuccess } from "../../../shared/utils/toast.js";
import { X, Utensils, DollarSign, Package, Clock, MapPin, ChevronDown, BookOpen } from "lucide-react";

export const MenuModal = ({ isOpen, onClose, menu }) => {
    const { saveMenu } = useSaveMenu();
    const { restaurants, getRestaurants } = useRestaurantStore();
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: "", description: "", price: "", stock: "",
        prepTime: "", availableFrom: "", availableTo: "", restaurant: ""
    });

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            getRestaurants();

            if (menu) {
                setFormData({
                    name: menu.name || "",
                    description: menu.description || "",
                    price: menu.price || "",
                    stock: menu.stock || "",
                    prepTime: menu.prepTime || "",
                    availableFrom: menu.availableFrom || "",
                    availableTo: menu.availableTo || "",
                    restaurant: menu.restaurant?._id || menu.restaurant || ""
                });
            } else {
                setFormData({ name: "", description: "", price: "", stock: "", prepTime: "", availableFrom: "", availableTo: "", restaurant: "" });
            }
        }
    }, [menu, isOpen, getRestaurants]);

    const validateForm = () => {
        let newErrors = {};

        if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";
        if (!formData.description.trim()) newErrors.description = "La descripción es obligatoria";
        if (!formData.restaurant) newErrors.restaurant = "Selecciona una sucursal";
        
        if (!formData.price || Number(formData.price) <= 0) {
            newErrors.price = "Monto mayor a 0";
        }
        if (formData.stock === "" || Number(formData.stock) < 0) {
            newErrors.stock = "No puede ser negativo";
        }
        if (!formData.prepTime || Number(formData.prepTime) <= 0) {
            newErrors.prepTime = "Mínimo 1 min";
        }
        if (!formData.availableFrom) newErrors.availableFrom = "Obligatorio";
        if (!formData.availableTo) newErrors.availableTo = "Obligatorio";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Sanitizamos valores antes de despachar
            const payload = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                prepTime: Number(formData.prepTime)
            };

            await saveMenu(payload, menu?._id || menu?.id);
            showSuccess(menu ? "Actualizado correctamente" : "Platillo creado");
            onClose();
        } catch (error) {
            showError("Ocurrió un problema");
        } finally {
            setLoading(false);
        }
    };

    const ErrorLabel = ({ message }) => (
        message ? <span className="text-[9px] text-red-500 font-black uppercase mt-1 ml-1 tracking-tighter">{message}</span> : null
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#4A3728]/80 backdrop-blur-md flex justify-center items-end md:items-center z-[100] p-0 md:p-4">
            <div className="bg-white rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl w-full max-w-xl max-h-[95vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom md:zoom-in duration-300 border border-[#EADDCA]/50">
                
                {/* Header */}
                <div className="p-6 md:p-8 text-white shrink-0" style={{ background: "linear-gradient(135deg, #4A3728 0%, #8B4513 100%)" }}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none">
                                    {menu ? "Gestionar Menu" : "Nuevo Menu"}
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
                    <div className="p-6 md:p-10 overflow-y-auto space-y-5">
                        
                        {/* Nombre */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-[#D2B48C] tracking-widest ml-1 flex items-center gap-2">
                                <Utensils size={12}/> Nombre del Platillo
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={`w-full px-5 py-3.5 bg-white border ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#4A3728] font-bold text-sm outline-none focus:border-[#8B4513] transition-all shadow-sm`}
                                placeholder="Ej. Pepián Tradicional"
                            />
                            <ErrorLabel message={errors.name} />
                        </div>

                        {/* Grid 2 Columnas: Precio y Stock */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] tracking-widest ml-1 flex items-center gap-2">
                                    <DollarSign size={12}/> Precio
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className={`w-full px-5 py-3.5 bg-white border ${errors.price ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#4A3728] font-bold text-sm outline-none focus:border-[#8B4513]`}
                                    placeholder="0.00"
                                />
                                <ErrorLabel message={errors.price} />
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] tracking-widest ml-1 flex items-center gap-2">
                                    <Package size={12}/> Stock
                                </label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    className={`w-full px-5 py-3.5 bg-white border ${errors.stock ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#4A3728] font-bold text-sm outline-none focus:border-[#8B4513]`}
                                    placeholder="20"
                                />
                                <ErrorLabel message={errors.stock} />
                            </div>
                        </div>

                        {/* Sucursal ID transformada a SELECT */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-[#D2B48C] tracking-widest ml-1 flex items-center gap-2">
                                <MapPin size={12}/> Sucursal Destino
                            </label>
                            <div className="relative">
                                <select 
                                    value={formData.restaurant}
                                    onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}
                                    className={`w-full px-5 py-3.5 bg-white border ${errors.restaurant ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#4A3728] font-bold text-sm appearance-none outline-none focus:border-[#8B4513] cursor-pointer pr-12`}
                                >
                                    <option value="">Selecciona un restaurante...</option>
                                    {restaurants.map(r => (
                                        <option key={r._id} value={r._id}>
                                            {r.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D2B48C] pointer-events-none" size={18}/>
                            </div>
                            <ErrorLabel message={errors.restaurant} />
                        </div>

                        {/* Tiempos y Horarios */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] tracking-widest ml-1 flex items-center gap-2 italic">
                                    <Clock size={12}/> Prep. (Min)
                                </label>
                                <input
                                    type="number"
                                    value={formData.prepTime}
                                    onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                                    className={`w-full px-4 py-3 bg-white border ${errors.prepTime ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-xl text-[#4A3728] font-bold text-sm outline-none`}
                                />
                                <ErrorLabel message={errors.prepTime} />
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] tracking-widest ml-1">Desde</label>
                                <input
                                    type="time"
                                    value={formData.availableFrom}
                                    onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                                    className={`w-full px-4 py-3 bg-white border ${errors.availableFrom ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-xl text-[#4A3728] font-bold text-xs outline-none`}
                                />
                                <ErrorLabel message={errors.availableFrom} />
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] tracking-widest ml-1">Hasta</label>
                                <input
                                    type="time"
                                    value={formData.availableTo}
                                    onChange={(e) => setFormData({ ...formData, availableTo: e.target.value })}
                                    className={`w-full px-4 py-3 bg-white border ${errors.availableTo ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-xl text-[#4A3728] font-bold text-xs outline-none`}
                                />
                                <ErrorLabel message={errors.availableTo} />
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-[#D2B48C] tracking-widest ml-1 italic">Descripción / Ingredientes</label>
                            <textarea
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className={`w-full px-5 py-4 bg-white border ${errors.description ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#6F4E37] text-sm outline-none resize-none focus:border-[#8B4513]`}
                                placeholder="Describe el platillo..."
                            ></textarea>
                            <ErrorLabel message={errors.description} />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-8 md:p-10 bg-white border-t border-[#EADDCA]/30 shrink-0">
                        <button 
                            type="submit" disabled={loading}
                            className="w-full py-4 rounded-2xl bg-[#4A3728] text-white hover:bg-[#8B4513] transition-all font-black text-xs uppercase tracking-[0.25em] shadow-2xl active:scale-95 flex items-center justify-center min-h-[60px] disabled:opacity-50"
                        >
                            {loading ? "PROCESANDO..." : (menu ? "GUARDAR CAMBIOS" : "AGREGAR A CARTA")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};