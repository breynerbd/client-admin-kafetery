export const LoginForm = ({ onForgot }) => {
    return (
        <>
            <form className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-[#4A3728] mb-1.5">
                        Email o Usuario
                    </label>
                    <input
                        type="text"
                        placeholder="correo@ejemplo.com o usuario"
                        className="w-full px-3 py-2 text-sm border border-[#D2B48C] rounded-lg focus:ring-2 focus:ring-[#8B4513] outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#4A3728] mb-1.5">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-sm border border-[#D2B48C] rounded-lg focus:ring-2 focus:ring-[#8B4513] outline-none transition-all"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#6F4E37] hover:bg-[#5D4037] text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm shadow-sm"
                >
                    Iniciar Sesión
                </button>
            </form>

            <p className="text-center text-sm mt-4">
                <button
                    type="button"
                    onClick={onForgot}
                    className="text-[#8B4513] font-medium hover:underline"
                >
                    ¿Olvidaste tu contraseña?
                </button>
            </p>
        </>
    );
};

export default LoginForm;