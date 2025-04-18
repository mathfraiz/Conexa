import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../componentes/BarraNav";
import Rodape from "../../componentes/Rodape";
import usuarioService from "../../services/apiUsuario";

// Sugestões padrão de e-mail
const emailSugeridos = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const sugestoesRef = useRef<HTMLDivElement>(null);

  const logar= async (email,senha) => {
    try {
      const response = await fetch("http://localhost:8080/usuario/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Login bem-sucedido:", data);
        // Redirecionar ou fazer algo após o login
      }

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      // Exibir mensagem de erro ao usuário
    }
  };

  // Fecha a lista de sugestões ao clicar fora
  useEffect(() => {
    const fecharSugestoes = (e: MouseEvent) => {
      if (!sugestoesRef.current?.contains(e.target as Node)) setMostrarSugestoes(false);
    };
    document.addEventListener("mousedown", fecharSugestoes);
    return () => document.removeEventListener("mousedown", fecharSugestoes);
  }, []);

  // Atualiza sugestões de e-mail enquanto o usuário digita
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setEmail(value);

    if (!value.includes("@")) return setMostrarSugestoes(false);

    const dominio = value.split("@")[1] || "";
    setSugestoes(emailSugeridos.filter((s) => s.startsWith(dominio)) || emailSugeridos);
    setMostrarSugestoes(true);
  };

  // Preenche o e-mail com a sugestão clicada
  const selecionarSugestao = (sugestao: string) => {
    setEmail(email.split("@")[0] + "@" + sugestao);
    setMostrarSugestoes(false);
  };

  return (
    <main className="h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/logo2.jpg')" }}>
      <Navbar isLogado={false} />

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md p-8 bg-gray-100 rounded-lg shadow-2xl border border-gray-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>

          {/* Formulário */}
          <form>
            {/* Campo de Email */}
            <div className="mb-4 relative" ref={sugestoesRef}>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={handleEmailChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg shadow-md focus:ring-2 focus:ring-purple-500 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500"
                required
              />
              {/* Sugestões de e-mail */}
              {mostrarSugestoes && (
                <ul className="absolute bg-white border border-gray-300 rounded-md w-full mt-1 shadow-md z-10">
                  {sugestoes.map((s) => (
                    <li key={s} className="px-3 py-2 cursor-pointer hover:bg-purple-50" onClick={() => selecionarSugestao(s)}>
                      {email.split("@")[0]}@{s}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Campo de Senha */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                placeholder="Digite sua senha"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg shadow-md focus:ring-2 focus:ring-purple-500 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <button onClick={()=>{
              logar(email,senha)
            }} className="w-full bg-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-purple-800 transition-all">
              Entrar
            </button>
          </form>

          {/* Link para Cadastro */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Não está registrado?{" "}
              <Link to="/cadastro" className="text-purple-600 hover:text-purple-500">
                Crie uma conta
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Esqueceu a senha?{" "}
              <Link to="/recuperação" className="text-purple-600 hover:text-purple-500">
                Recuperar senha
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Rodape />
    </main>
  );
};

export default Login;
