export const ForgotPasswordForm = ({ onSwitch }) => {
    return (
        <form className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-[#4A3728] mb-1.5">
                    Email
                </label>
                <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className="w-full px-3 py-2 text-sm border border-[#D2B48C] rounded-lg focus:ring-2 focus:ring-[#8B4513] outline-none transition-all"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-[#6F4E37] text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-[#5D4037] transition-colors shadow-sm"
            >
                Enviar correo
            </button>

            <p className="text-center text-sm text-[#6F4E37]">
                ¿Recordaste tu contraseña?{" "}
                <button
                    type="button"
                    onClick={onSwitch}
                    className="text-[#8B4513] font-bold hover:underline"
                >
                    Iniciar sesión
                </button>
            </p>
        </form>
    );
};