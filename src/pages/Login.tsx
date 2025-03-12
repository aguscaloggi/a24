import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@aws-amplify/auth";
import LoginForm from "../components/LoginForm";
import "../css/Login.css";

function Login() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await Auth.currentAuthenticatedUser();
                navigate("/");
            } catch (error) {
                // Usuario no autenticado, permanece en la página de login
            }
        };

        checkAuth();
    }, [navigate]);

    return (
        <div className="login-page">
            <div className="auth-container">
                <h2>{isLogin ? "Iniciar sesión" : "Crear cuenta"}</h2>
                
                <LoginForm isLogin={isLogin} />
                
                <p>
                    {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="toggle-auth-mode"
                    >
                        {isLogin ? "Regístrate" : "Ingresa aquí"}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;
