import { useState, useEffect } from "react";
import { useUsersStore } from "../../users/store/userStore";
import { showError, showSuccess } from "../../../shared/utils/toast.js";
import { X, User, Mail, Lock, ShieldCheck, Fingerprint } from "lucide-react";

export const UserModal = ({ isOpen, onClose, user }) => {
    const { createUser, updateUser } = useUsersStore();
    const [loading, setLoading] = useState(false);

    // Estado para capturar los errores de validación
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        auth_id: "",
        name: "",
        email: "",
        password: "",
        role: "CLIENT"
    });

    useEffect(() => {
        if (isOpen) {
            setErrors({}); // Limpiar errores al abrir el modal
            if (user) {
                setFormData({
                    auth_id: user.auth_id || "",
                    name: user.name || "",
                    email: user.email || "",
                    password: "",
                    role: user.role || "CLIENT"
                });
            } else {
                setFormData({ auth_id: "", name: "", email: "", password: "", role: "CLIENT" });
            }
        }
    }, [user, isOpen]);

    // Lógica de validación manual
    const validateForm = () => {
        let newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.auth_id.trim()) {
            newErrors.auth_id = "El Auth ID es requerido";
        }

        if (!formData.name.trim()) {
            newErrors.name = "El nombre completo es requerido";
        }

        if (!formData.email.trim()) {
            newErrors.email = "El correo es requerido";
        } else if (!formData.email.includes("@")) {
            newErrors.email = "El correo debe contener un '@'";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Formato de correo inválido (ejemplo@dominio.com)";
        }

        // Password solo obligatorio si es usuario nuevo
        if (!user && !formData.password.trim()) {
            newErrors.password = "La contraseña es requerida para nuevos usuarios";
        } else if (!user && formData.password.length < 6) {
            newErrors.password = "Mínimo 6 caracteres";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            if (user) {
                await updateUser(user._id || user.id, formData);
                showSuccess("Usuario actualizado correctamente");
            } else {
                await createUser(formData);
                showSuccess("Usuario creado exitosamente");
            }
            onClose();
        } catch (error) {
            showError("Error al procesar la solicitud");
        } finally {
            setLoading(false);
        }
    };

    // Componente interno para mostrar el mensaje de error en rojo
    const ErrorLabel = ({ field }) => (
        errors[field] ? (
            <span className="text-red-500 text-[10px] font-bold uppercase mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                {errors[field]}
            </span>
        ) : null
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#4A3728]/80 backdrop-blur-md flex justify-center items-end md:items-center z-[100] p-0 md:p-4 transition-all duration-300">
            <div className="bg-white rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl w-full max-w-md max-h-[94vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom md:zoom-in duration-300 border border-[#EADDCA]/50">

                {/* Header */}
                <div className="p-6 md:p-8 text-white shrink-0" style={{ background: "linear-gradient(135deg, #4A3728 0%, #8B4513 100%)" }}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl">
                                <User size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none">
                                    {user ? "Editar Perfil" : "Nuevo Usuario"}
                                </h2>
                                <p className="text-[10px] text-[#EADDCA] font-bold uppercase tracking-widest mt-1">KAFETERY MANAGEMENT</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                            <X size={28} />
                        </button>
                    </div>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} noValidate className="flex flex-col overflow-hidden bg-[#FDF8F3]/30">
                    <div className="p-6 md:p-10 overflow-y-auto space-y-5">

                        {/* Auth ID */}
                        <div className="flex flex-col">
                            <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-[0.1em] mb-1">
                                <Fingerprint size={12} /> Auth ID (Firebase/UID)
                            </label>
                            <input
                                type="text"
                                value={formData.auth_id}
                                onChange={(e) => {
                                    setFormData({ ...formData, auth_id: e.target.value });
                                    if (errors.auth_id) setErrors({ ...errors, auth_id: null });
                                }}
                                className={`w-full px-5 py-4 bg-white border ${errors.auth_id ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#8B4513] font-mono text-xs outline-none focus:ring-4 focus:ring-[#8B4513]/5 transition-all`}
                            />
                            <ErrorLabel field="auth_id" />
                        </div>

                        {/* Nombre */}
                        <div className="flex flex-col">
                            <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-[0.1em] mb-1">
                                <User size={12} /> Nombre Completo
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({ ...formData, name: e.target.value });
                                    if (errors.name) setErrors({ ...errors, name: null });
                                }}
                                className={`w-full px-5 py-4 bg-white border ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#4A3728] font-bold text-sm outline-none focus:ring-4 focus:ring-[#8B4513]/5 transition-all`}
                            />
                            <ErrorLabel field="name" />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col">
                            <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-[0.1em] mb-1">
                                <Mail size={12} /> Correo Electrónico
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => {
                                    setFormData({ ...formData, email: e.target.value });
                                    if (errors.email) setErrors({ ...errors, email: null });
                                }}
                                className={`w-full px-5 py-4 bg-white border ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#4A3728] text-sm outline-none focus:ring-4 focus:ring-[#8B4513]/5 transition-all`}
                            />
                            <ErrorLabel field="email" />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col">
                            <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-[0.1em] mb-1">
                                <Lock size={12} /> Contraseña
                            </label>
                            <input
                                type="password"
                                placeholder={user ? "Dejar en blanco para no cambiar" : "••••••"}
                                value={formData.password}
                                onChange={(e) => {
                                    setFormData({ ...formData, password: e.target.value });
                                    if (errors.password) setErrors({ ...errors, password: null });
                                }}
                                className={`w-full px-5 py-4 bg-white border ${errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-[#EADDCA]'} rounded-2xl text-[#4A3728] text-sm outline-none focus:ring-4 focus:ring-[#8B4513]/5 transition-all`}
                            />
                            <ErrorLabel field="password" />
                        </div>

                        {/* Rol */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-[#D2B48C] flex items-center gap-2 ml-1 tracking-[0.1em]">
                                <ShieldCheck size={12} /> Nivel de Permisos
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-5 py-4 bg-white border border-[#EADDCA] rounded-2xl text-[#4A3728] font-black text-[10px] uppercase tracking-widest outline-none appearance-none cursor-pointer focus:ring-4 focus:ring-[#8B4513]/5 transition-all"
                                >
                                    <option value="CLIENT">Client / Comensal</option>
                                    <option value="RESTAURANT_ADMIN">Restaurant Admin</option>
                                    <option value="PLATFORM_ADMIN">Platform Master</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#D2B48C]">
                                    ▼
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="p-8 md:p-10 bg-white border-t border-[#EADDCA]/30 shrink-0">
                        <button
                            type="submit" disabled={loading}
                            className="w-full py-4 rounded-2xl bg-[#4A3728] text-white hover:bg-[#8B4513] transition-all font-black text-xs uppercase tracking-[0.25em] shadow-xl active:scale-95 flex items-center justify-center min-h-[60px] disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Procesando...
                                </div>
                            ) : (user ? "Guardar Cambios" : "Crear Usuario")}
                        </button>
                        <button
                            type="button" onClick={onClose}
                            className="w-full py-3 mt-3 text-[#D2B48C] hover:text-[#8B4513] transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};