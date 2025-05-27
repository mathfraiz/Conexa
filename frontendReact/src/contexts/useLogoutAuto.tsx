import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./AuthContext";

const tempoInativo = 10 * 60 * 1000;

interface JwtPayload {
  exp: number;
}

export function useLogoutAuto() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const verificarExpiracaoToken = () => {
    if (!token) return true;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const expMs = decoded.exp * 1000;
      return Date.now() > expMs;
    } catch (e) {
      console.log("erro no verificarExpiraçãoToken:", e);
      return true;
    }
  };

  const resetTimer = () => {
    clearTimeout(timeout);

    if (token && verificarExpiracaoToken()) {
      logout();
      alert("sessao Expirada");
      return;
    }

    if (token) {
      timeout = setTimeout(() => {
        logout();
        alert("sessao Expirada por inatividade");
        return;
      }, tempoInativo);
    }
  };

  let timeout: ReturnType<typeof setTimeout>;
  const eventos = ["mousemove", "keydown", "scroll", "click"];

  useEffect(() => {
    resetTimer();

    eventos.forEach((e) => window.addEventListener(e, resetTimer));

    return () => {
      clearTimeout(timeout);
      eventos.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [navigate]);
}
