import { useState, useEffect } from "react";
import useSessinStorage from "./useSessionStorage"

export function useAuth() {
  
  const [usuario, setUsuario] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { login } = useAuth();

  useEffect(() => {
    const storedUsuario = sessionStorage.getItem("usuario");
    const storedToken = sessionStorage.getItem("token");

    if (storedUsuario && storedToken) {
      setUsuario(JSON.parse(storedUsuario));
      setToken(storedToken);
    }
  }, []);

  const login = (usuarioData: any, jwt: string) => {
    sessionStorage.setItem("usuario", JSON.stringify(usuarioData));
    sessionStorage.setItem("token", jwt);
    setUsuario(usuarioData);
    setToken(jwt);
  };

  const logout = () => {
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("token");
    setUsuario(null);
    setToken(null);
    location.href = "/login";
  };

  return {
    usuario,
    token,
    isAutenticado: !!usuario,
    login,
    logout,
  };
}
