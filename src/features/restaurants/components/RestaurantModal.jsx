import { useState, useEffect } from "react";
import { useRestaurantStore } from "../store/restaurantStore";
import { useUsersStore } from "../../users/store/userStore"; 
import { showError, showSuccess } from "../../../shared/utils/toast";
import { X, Store, MapPin, Phone, Mail, Clock, User, AlignLeft, ChevronDown } from "lucide-react";

export const RestaurantModal = ({ isOpen, onClose, restaurant }) => {
    const { createRestaurant, updateRestaurant, error: storeError } = useRestaurantStore();
    const { users, getUsers } = useUsersStore();
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
        owner: "",
        openingTime: "",
        closingTime: "",
        description: ""
    });

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            getUsers();
            if (restaurant) {
                setFormData({
                    name: restaurant.name || "",
                    address: restaurant.address || "",
                    phone: restaurant.phone || "",
                    email: restaurant.email || "",
                    owner: restaurant.owner?._id || restaurant.owner || "",
                    openingTime: restaurant.openingTime || "",
                    closingTime: restaurant.closingTime || "",
                    description: restaurant.description || ""
                });
            } else {
                setFormData({
                    name: "", address: "", phone: "", email: "",
                    owner: "", openingTime: "", closingTime: "", description: ""
                });
            }
        }
    }, [restaurant, isOpen, getUsers]);

    const validateForm = () => {
        let newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";
        if (!formData.address.trim()) newErrors.address = "La ubicación es obligatoria";
        if (!formData.phone.trim()) newErrors.phone = "El teléfono es obligatorio";
        if (!formData.owner) newErrors.owner = "Debes asignar un administrador";
        if (!formData.openingTime) newErrors.openingTime = "Requerido";
        if (!formData.closingTime) newErrors.closingTime = "Requerido";
        
        if (!formData.email.trim()) {
            newErrors.email = "El email es obligatorio";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Formato de email inválido";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            if (restaurant) {
                await updateRestaurant(restaurant._id || restaurant.id, formData);
                showSuccess("Establecimiento actualizado");
            } else {
                await createRestaurant(formData);
                showSuccess("Sede registrada con éxito");
            }
            onClose();
        } catch (err) {
            showError(restaurant ? "Error al actualizar" : "Error al registrar");
        } finally {
            setLoading(false);
        }
    };

    const ErrorMsg = ({ field }) => (
        errors[field] ? (
            <span className="text-red-500 text-[9px] font-black uppercase mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                {errors[field]}
            </span>
        ) : null
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
                                <Store size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none">
                                    {restaurant ? "Editar Sucursal" : "Nueva Sucursal"}
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
                        
                        {storeError && (
                            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-[10px] font-black uppercase tracking-widest rounded-r-xl">
                                Error: {storeError}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-[0.1em]">
                                <Store size={12}/> Nombre del Establecimiento
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={`w-full px-5 py-4 bg-white border ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#4A3728] font-bold text-sm outline-none transition-all`}
                                placeholder="Ej. Kafetery Central"
                            />
                            <ErrorMsg field="name" />
                        </div>

                        <hr className="border-[#EADDCA]/30" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-[0.1em]">
                                    <Mail size={12}/> Email Público
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full px-5 py-4 bg-white border ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#4A3728] text-sm outline-none transition-all`}
                                />
                                <ErrorMsg field="email" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-[0.1em]">
                                    <Phone size={12}/> Teléfono
                                </label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className={`w-full px-5 py-4 bg-white border ${errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#4A3728] text-sm outline-none transition-all`}
                                />
                                <ErrorMsg field="phone" />
                            </div>
                        </div>

                        <hr className="border-[#EADDCA]/30" />

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-[0.1em]">
                                <User size={12}/> Asignar Administrador (Owner)
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.owner}
                                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                                    className={`w-full px-5 py-4 bg-white border ${errors.owner ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#4A3728] font-bold text-sm outline-none appearance-none cursor-pointer transition-all`}
                                >
                                    <option value="" disabled>Seleccione un usuario...</option>
                                    {users.map((u) => (
                                        <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-[#D2B48C]">
                                    <ChevronDown size={18} />
                                </div>
                            </div>
                            <ErrorMsg field="owner" />
                        </div>

                        <hr className="border-[#EADDCA]/30" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-[0.1em]">
                                    <Clock size={12}/> Apertura
                                </label>
                                <input
                                    type="time"
                                    value={formData.openingTime}
                                    onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                                    className={`w-full px-5 py-4 bg-white border ${errors.openingTime ? 'border-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#4A3728] font-bold outline-none`}
                                />
                                <ErrorMsg field="openingTime" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-[0.1em]">
                                    <Clock size={12}/> Cierre
                                </label>
                                <input
                                    type="time"
                                    value={formData.closingTime}
                                    onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                                    className={`w-full px-5 py-4 bg-white border ${errors.closingTime ? 'border-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#4A3728] font-bold outline-none`}
                                />
                                <ErrorMsg field="closingTime" />
                            </div>
                        </div>

                        <hr className="border-[#EADDCA]/30" />

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-[0.1em]">
                                <MapPin size={12}/> Ubicación Física
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className={`w-full px-5 py-4 bg-white border ${errors.address ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#4A3728] text-sm outline-none transition-all`}
                            />
                            <ErrorMsg field="address" />
                        </div>

                        <hr className="border-[#EADDCA]/30" />

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-[0.1em]">
                                <AlignLeft size={12}/> Reseña / Descripción
                            </label>
                            <textarea
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-5 py-4 bg-white border border-[#EADDCA] rounded-2xl text-[#6F4E37] text-sm outline-none resize-none"
                                placeholder="Ambiente, especialidades, etc..."
                            />
                        </div>
                    </div>

                    <div className="p-8 md:p-10 bg-white border-t border-[#EADDCA]/30 shrink-0">
                        <button
                            type="submit" disabled={loading}
                            className="w-full py-4 rounded-2xl bg-[#4A3728] text-white hover:bg-[#8B4513] transition-all font-black text-xs uppercase tracking-[0.25em] shadow-2xl active:scale-95 flex items-center justify-center min-h-[60px] disabled:opacity-50"
                        >
                            {loading ? "PROCESANDO..." : (restaurant ? "ACTUALIZAR SEDE" : "CONFIRMAR SUCURSAL")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};