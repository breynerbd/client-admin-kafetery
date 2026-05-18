import { useState, useEffect } from "react";
import { useTableStore } from "../store/tableStore";
import { useRestaurantStore } from "../../../features/restaurants/store/restaurantStore";
import { showError, showSuccess } from "../../../shared/utils/toast.js";
import { X, Hash, Users, Store, ChevronDown, UtensilsCrossed } from "lucide-react";

export const TableModal = ({ isOpen, onClose, table }) => {
    const { createTable, updateTable } = useTableStore();
    const { restaurants, getRestaurants } = useRestaurantStore();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        tableNumber: "",
        capacity: "",
        restaurant: ""
    });

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            getRestaurants();

            if (table) {
                setFormData({
                    tableNumber: table.tableNumber || "",
                    capacity: table.capacity || "",
                    restaurant: table.restaurant?._id || table.restaurant || ""
                });
            } else {
                setFormData({ tableNumber: "", capacity: "", restaurant: "" });
            }
        }
    }, [table, isOpen, getRestaurants]);

    const validateForm = () => {
        let newErrors = {};

        if (!String(formData.tableNumber).trim()) {
            newErrors.tableNumber = "El número de mesa es obligatorio";
        } else if (Number(formData.tableNumber) <= 0) {
            newErrors.tableNumber = "Debe ser mayor a 0";
        }

        if (!String(formData.capacity).trim()) {
            newErrors.capacity = "La capacidad es obligatoria";
        } else if (Number(formData.capacity) <= 0) {
            newErrors.capacity = "Mínimo 1 persona";
        }

        if (!formData.restaurant) {
            newErrors.restaurant = "Selecciona un restaurante";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const payload = {
                tableNumber: Number(formData.tableNumber),
                capacity: Number(formData.capacity),
                restaurant: formData.restaurant
            };

            if (table) {
                await updateTable(table._id || table.id, payload);
                showSuccess("Mesa actualizada exitosamente");
            } else {
                await createTable(payload);
                showSuccess("Mesa creada exitosamente");
            }
            onClose();
        } catch (error) {
            showError("Error al procesar la mesa");
        } finally {
            setLoading(false);
        }
    };

    const ErrorLabel = ({ field }) => (
        errors[field] ? (
            <span className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                {errors[field]}
            </span>
        ) : null
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#4A3728]/80 backdrop-blur-md flex justify-center items-end md:items-center z-[100] p-0 md:p-4">
            <div className="bg-white rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl w-full max-w-lg max-h-[94vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom md:zoom-in duration-300 border border-[#EADDCA]/50">

                {/* Header */}
                <div className="p-6 md:p-8 text-white shrink-0" style={{ background: "linear-gradient(135deg, #4A3728 0%, #8B4513 100%)" }}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl">
                                <UtensilsCrossed size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none">
                                    {table ? "Editar Mesa" : "Nueva Mesa"}
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

                        {/* Grid de Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-widest mb-2">
                                    <Hash size={12} /> No. Mesa
                                </label>
                                <input
                                    type="number"
                                    value={formData.tableNumber}
                                    onChange={(e) => {
                                        setFormData({ ...formData, tableNumber: e.target.value });
                                        if (errors.tableNumber) setErrors({ ...errors, tableNumber: null });
                                    }}
                                    className={`w-full px-4 py-3 bg-white border ${errors.tableNumber ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-xl text-sm font-bold text-[#4A3728] outline-none focus:border-[#8B4513] transition-colors`}
                                    placeholder="00"
                                />
                                <ErrorLabel field="tableNumber" />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-widest mb-2">
                                    <Users size={12} /> Capacidad
                                </label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => {
                                        setFormData({ ...formData, capacity: e.target.value });
                                        if (errors.capacity) setErrors({ ...errors, capacity: null });
                                    }}
                                    className={`w-full px-4 py-3 bg-white border ${errors.capacity ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-xl text-sm font-bold text-[#4A3728] outline-none focus:border-[#8B4513] transition-colors`}
                                    placeholder="Personas"
                                />
                                <ErrorLabel field="capacity" />
                            </div>
                        </div>

                        {/* SELECCIÓN DE RESTAURANTE */}
                        <div className="flex flex-col pt-2">
                            <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-widest mb-2">
                                <Store size={12} /> Sucursal
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.restaurant}
                                    onChange={(e) => {
                                        setFormData({ ...formData, restaurant: e.target.value });
                                        if (errors.restaurant) setErrors({ ...errors, restaurant: null });
                                    }}
                                    className={`w-full px-4 py-3 bg-white border ${errors.restaurant ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-xl text-sm font-bold text-[#4A3728] outline-none focus:border-[#8B4513] transition-colors appearance-none cursor-pointer`}
                                >
                                    <option value="" disabled>Seleccionar sucursal...</option>
                                    {restaurants?.map((res) => (
                                        <option key={res._id} value={res._id}>
                                            {res.name || res.title || "Restaurante sin nombre"}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#D2B48C]">
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                            <ErrorLabel field="restaurant" />
                        </div>
                    </div>

                    {/* Botón de Acción Estilo OrderModal */}
                    <div className="p-8 md:p-10 bg-white border-t border-[#EADDCA]/30 shrink-0">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-2xl bg-[#4A3728] text-white hover:bg-[#8B4513] transition-all font-black text-xs uppercase tracking-[0.25em] shadow-2xl active:scale-95 flex items-center justify-center min-h-[60px] disabled:opacity-50"
                        >
                            {loading ? "PROCESANDO..." : (table ? "GUARDAR CAMBIOS" : "CREAR MESA")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};