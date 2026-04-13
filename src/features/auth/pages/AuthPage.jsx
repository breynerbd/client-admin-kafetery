import { useState } from "react";
import { LoginForm } from "../components/LoginForm.jsx";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm.jsx";

export const AuthPage = () => {
    const [isForgot, setIsForgot] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3] p-4">
            
            <div className="w-full max-w-xl bg-white rounded-xl shadow-lg border border-[#EADDCA] p-6 md:p-10">

                <div className="flex justify-center mb-6">
                    <img
                        src="/src/assets/img/Kafetery_logo.png"
                        alt="Kafetery"
                        className="h-50 w-auto"
                    />
                </div>

                <div className="text-center mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold text-[#4A3728] mb-2">
                        {isForgot ? "Recuperar contraseña" : "Bienvenido de nuevo"}
                    </h1>

                    <p className="text-[#6F4E37] text-base max-w-md mx-auto">
                        {isForgot
                            ? "Ingresa tu correo electrónico para restablecer tu contraseña"
                            : "Ingresa a tu cuenta de administrador de Kafetery"}
                    </p>
                </div>

                {isForgot ? (
                    <ForgotPasswordForm
                        onSwitch={() => {
                            setIsForgot(false);
                        }}
                    />
                ) : (
                    <LoginForm 
                        onForgot={() => setIsForgot(true)} 
                    />
                )}
                
            </div>
        </div>
    );
};

export default AuthPage;