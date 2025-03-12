import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@aws-amplify/auth";
import GoogleButton from "react-google-button";
import "../css/LoginForm.css";

interface LoginFormProps {
  isLogin: boolean;
}

function LoginForm({ isLogin }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleTraditionalAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!isLogin && password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            setLoading(true);
            if (isLogin) {
                await Auth.signIn(email, password);
            } else {
                await Auth.signUp({
                    username: email,
                    password,
                    attributes: { email }
                });
            }
            navigate("/");
        } catch (err: any) {
            setError(handleAuthError(err.code));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        try {
            setLoading(true);
            await Auth.federatedSignIn({ provider: "Google" });
            navigate("/");
        } catch (err: any) {
            setError(handleAuthError(err.code));
        } finally {
            setLoading(false);
        }
    };

    const handleAuthError = (errorCode: string) => {
        switch (errorCode) {
            case "UserNotConfirmedException":
                return "Confirma tu correo electrónico primero";
            case "UsernameExistsException":
                return "El usuario ya existe";
            case "InvalidParameterException":
                return "Formato de email inválido";
            case "NotAuthorizedException":
                return "Credenciales incorrectas";
            case "PasswordResetRequiredException":
                return "Reinicia tu contraseña";
            default:
                return "Error en la autenticación";
        }
    };

    return (
        <div className="auth-wrapper">
            <form onSubmit={handleTraditionalAuth}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                />
                
                {!isLogin && (
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmar contraseña"
                        required
                    />
                )}

                {error && <div className="auth-error">{error}</div>}

                <button type="submit" disabled={loading}>
                    {loading ? "Cargando..." : (isLogin ? "Ingresar" : "Registrarse")}
                </button>
            </form>

            <div className="auth-separator">
                <span>o</span>
            </div>

            <GoogleButton
                onClick={handleGoogleAuth}
                label={isLogin ? "Iniciar con Google" : "Registrarse con Google"}
                disabled={loading}
                style={{ width: "100%", borderRadius: "4px" }}
            />
        </div>
    );
}

export default LoginForm;
