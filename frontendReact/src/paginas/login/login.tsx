import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../componentes/BarraNav";
import Rodape from "../../componentes/Rodape";

// Sugestões padrão de e-mail
const emailSugeridos = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const sugestoesRef = useRef<HTMLDivElement>(null);

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
    <main className="h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/logo.jpg')" }}>
      <Navbar login={true} />

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <button type="submit" className="w-full bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-800 focus:ring-2 focus:ring-purple-500">
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
          </div>
        </div>
      </div>

      <Rodape />
    </main>
  );
};

export default Login;
