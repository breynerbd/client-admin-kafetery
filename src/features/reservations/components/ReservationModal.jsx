import { useState, useEffect } from "react";
import { useSaveReservation } from "../hooks/useSaveReservation.js";
import { useUsersStore } from "../../users/store/userStore.js";
import { useTableStore } from "../../tables/store/tableStore";
import { useRestaurantStore } from "../../restaurants/store/restaurantStore";
import { showError, showSuccess } from "../../../shared/utils/toast.js";
import { Calendar, Clock, Users as UsersIcon, Fingerprint, Store, ChevronDown, X } from "lucide-react";

export const ReservationModal = ({ isOpen, onClose, reservation }) => {
    const { saveReservation } = useSaveReservation();

    const { users, getUsers } = useUsersStore();
    const { tables, getTables } = useTableStore();
    const { restaurants, getRestaurants } = useRestaurantStore();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        user: "",
        restaurant: "",
        table: "",
        date: "",
        time: "",
        people: 1
    });

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            getUsers();
            getTables();
            getRestaurants();

            if (reservation) {
                setFormData({
                    user: reservation.user?._id || reservation.user || "",
                    restaurant: reservation.restaurant?._id || reservation.restaurant || "",
                    table: reservation.table?._id || reservation.table || "",
                    date: reservation.date ? reservation.date.split('T')[0] : "",
                    time: reservation.time || "",
                    people: reservation.people || reservation.guests || 1
                });
            } else {
                setFormData({ user: "", restaurant: "", table: "", date: "", time: "", people: 1 });
            }
        }
    }, [reservation, isOpen, getUsers, getTables, getRestaurants]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.date) newErrors.date = "Fecha requerida";
        if (!formData.time) newErrors.time = "Hora requerida";
        if (!formData.user) newErrors.user = "Selecciona un cliente";
        if (!formData.restaurant) newErrors.restaurant = "Selecciona sucursal";
        if (!formData.table) newErrors.table = "Asigna una mesa";
        if (formData.people < 1) newErrors.people = "Mínimo 1 persona";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await saveReservation(formData, reservation?._id || reservation?.id);
            showSuccess(reservation ? "Reserva actualizada" : "Reserva creada");
            onClose();
        } catch (error) {
            showError("Error al procesar reserva");
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
            <div className="bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom md:zoom-in duration-300 border border-[#EADDCA]/50">
                
                {/* Header */}
                <div className="p-6 md:p-8 text-white shrink-0" style={{ background: "linear-gradient(135deg, #4A3728 0%, #8B4513 100%)" }}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none">
                                    {reservation ? "Editar Reserva" : "Nueva Reserva"}
                                </h2>
                                <p className="text-[10px] text-[#EADDCA] font-bold uppercase tracking-widest mt-1">KAFETERY RESERVATIONS</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                            <X size={28} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col overflow-hidden bg-[#FDF8F3]/30">
                    <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                        
                        {/* Fecha y Hora */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] ml-1 tracking-widest flex items-center gap-1"><Calendar size={10}/> Fecha</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className={`w-full px-4 py-3.5 bg-white border ${errors.date ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#4A3728] font-bold text-sm outline-none transition-all`}
                                />
                                <ErrorLabel field="date" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] ml-1 tracking-widest flex items-center gap-1"><Clock size={10}/> Hora</label>
                                <input
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className={`w-full px-4 py-3.5 bg-white border ${errors.time ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#4A3728] font-bold text-sm outline-none transition-all`}
                                />
                                <ErrorLabel field="time" />
                            </div>
                        </div>

                        {/* Personas */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-[#D2B48C] ml-1 tracking-widest flex items-center gap-1"><UsersIcon size={10}/> Comensales</label>
                            <input
                                type="number"
                                value={formData.people}
                                onChange={(e) => setFormData({ ...formData, people: Number(e.target.value) })}
                                className={`w-full px-4 py-3.5 bg-white border ${errors.people ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#4A3728] font-black text-lg outline-none`}
                            />
                            <ErrorLabel field="people" />
                        </div>

                        {/* CUADROS DE SELECCIÓN (SELECTS) */}
                        <div className="space-y-4 pt-4 border-t border-[#EADDCA]/50">
                            
                            {/* Selección de Usuario */}
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] ml-1 tracking-widest flex items-center gap-1 mb-2">
                                    <Fingerprint size={12}/> Cliente / Usuario
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.user}
                                        onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                                        className={`w-full px-4 py-3 bg-white border-2 border-dashed ${errors.user ? 'border-red-500' : 'border-[#EADDCA]'} rounded-xl text-[#4A3728] font-bold text-xs appearance-none cursor-pointer outline-none transition-colors`}
                                    >
                                        <option value="" disabled>Seleccione un cliente...</option>
                                        {users?.map(u => (
                                            <option key={u._id} value={u._id}>{u.name || u.username} ({u.email})</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#D2B48C]">
                                        <ChevronDown size={16} />
                                    </div>
                                </div>
                                <ErrorLabel field="user" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Selección de Sucursal */}
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black uppercase text-[#D2B48C] ml-1 tracking-widest flex items-center gap-1 mb-2">
                                        <Store size={12}/> Sucursal
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.restaurant}
                                            onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}
                                            className={`w-full px-4 py-3 bg-white border-2 border-dashed ${errors.restaurant ? 'border-red-500' : 'border-[#EADDCA]'} rounded-xl text-[#4A3728] font-bold text-xs appearance-none cursor-pointer outline-none transition-colors`}
                                        >
                                            <option value="" disabled>Seleccionar...</option>
                                            {restaurants?.map(r => (
                                                <option key={r._id} value={r._id}>{r.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#D2B48C]">
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                    <ErrorLabel field="restaurant" />
                                </div>

                                {/* Selección de Mesa */}
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black uppercase text-[#D2B48C] ml-1 tracking-widest flex items-center gap-1 mb-2">
                                        <UsersIcon size={12}/> Mesa Asignada
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.table}
                                            onChange={(e) => setFormData({ ...formData, table: e.target.value })}
                                            className={`w-full px-4 py-3 bg-white border-2 border-dashed ${errors.table ? 'border-red-500' : 'border-[#EADDCA]'} rounded-xl text-[#4A3728] font-bold text-xs appearance-none cursor-pointer outline-none transition-colors`}
                                        >
                                            <option value="" disabled>Mesa...</option>
                                            {tables?.map(t => (
                                                <option key={t._id} value={t._id}>
                                                    Mesa #{t.tableNumber} (Cap: {t.capacity})
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#D2B48C]">
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                    <ErrorLabel field="table" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 md:p-8 bg-white border-t border-[#EADDCA]/30 space-y-3">
                        <button
                            type="submit" disabled={loading}
                            className="w-full py-4 rounded-2xl bg-[#4A3728] text-white hover:bg-[#8B4513] transition-all font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-brown-900/20 active:scale-95 disabled:opacity-50 flex items-center justify-center min-h-[56px]"
                        >
                            {loading ? "PROCESANDO..." : (reservation ? "GUARDAR CAMBIOS" : "CONFIRMAR CITA")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};