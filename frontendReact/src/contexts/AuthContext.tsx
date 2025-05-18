// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  telefone?: string;
  imagem_perfil?: string | null;
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  isAutenticado: boolean;
  login: (usuario: Usuario, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUsuario = sessionStorage.getItem("usuario");
    const storedToken = sessionStorage.getItem("token");

    if (storedUsuario && storedToken) {
      setUsuario(JSON.parse(storedUsuario));
      setToken(storedToken);
    }
  }, []);

  const login = (usuario: Usuario, token: string) => {
    sessionStorage.setItem("usuario", JSON.stringify(usuario));
    sessionStorage.setItem("token", token);
    setUsuario(usuario);
    setToken(token);
    console.log(token);
  };

  const logout = () => {
    sessionStorage.clear();
    setUsuario(null);
    setToken(null);
    location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ usuario, token, isAutenticado: !!usuario, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
}
