import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../componentes/BarraNav";
import Rodape from "../../componentes/Rodape";
import useSessionStorage from "../../../hook/useSessionStorage"; // <-- importa o hook!

const emailSugeridos = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];

const Login: React.FC = () => {
  const [modalMensagem, setModalMensagem] = useState("");
  const [verdeMensagem, setVerdeMensagem] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const sugestoesRef = useRef<HTMLDivElement>(null);

  const [usuarioSession, setUsuarioSession] = useSessionStorage<any>(
    "usuario",
    {
      id: 0,
      nome: "",
      email: "",
      senha: "",
      telefone: "",
      tipo: "",
      imagem_perfil: "",
    }
  );

  const logar = async (email: string, senha: string) => {
    if (!(email && senha)) {
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUsuarioSession(data);
        setVerdeMensagem(true);
        setModalMensagem("Login realizado com sucesso");
        setMostrarModal(true);

        console.log(data.tipo);

        if (data.tipo === "admin") {
          setTimeout(() => {
            location.href = "/Adm";
          }, 2000);
        } else if (data.tipo === "usuario") {
          setTimeout(() => {
            location.href = "/paginaInicialLogin";
          }, 2000);
        }
      } else {
        setVerdeMensagem(false);
        setModalMensagem("Email ou senha incorretos");
        setMostrarModal(true);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  const fecharSugestoes = (e: MouseEvent) => {
    if (!sugestoesRef.current?.contains(e.target as Node)) {
      setMostrarSugestoes(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", fecharSugestoes);
    return () => document.removeEventListener("mousedown", fecharSugestoes);
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMostrarModal(false);
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const value = e.target.value.trim();
    const dominio = value.split("@")[1] || "";
    setEmail(value);

    setSugestoes(
      emailSugeridos.filter((s) => s.startsWith(dominio)) || emailSugeridos
    );

    if (!regex.test(value)) return setMostrarSugestoes(true);
    if (!value.includes("@")) return setMostrarSugestoes(true);
    setMostrarSugestoes(false);
  };

  const selecionarSugestao = (sugestao: string) => {
    setEmail(email.split("@")[0] + "@" + sugestao);
    setMostrarSugestoes(false);
  };

  return (
    <main
      className="h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/logo2.jpg')" }}
    >
      <Navbar />

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md p-8 bg-purple-100 rounded-lg shadow-2xl border border-gray-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              logar(email, senha);
            }}
          >
            <div
              className={
                verdeMensagem
                  ? "text-green-500 text-center mb-4"
                  : "text-red-500 text-center mb-4"
              }
            >
              {mostrarModal && modalMensagem}
            </div>

            {/* Campo de Email */}
            <div className="mb-4 relative" ref={sugestoesRef}>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={handleEmailChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-purple-50 text-gray-900 rounded-lg shadow-md focus:ring-2 focus:ring-purple-500"
                required
              />
              {mostrarSugestoes && (
                <ul className="absolute bg-white border border-gray-300 rounded-md w-full mt-1 shadow-md z-10">
                  {sugestoes.map((s) => (
                    <li
                      key={s}
                      className="px-3 py-2 cursor-pointer hover:bg-purple-50"
                      onClick={() => selecionarSugestao(s)}
                    >
                      {email.split("@")[0]}@{s}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Campo de Senha */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-purple-50 text-gray-900 rounded-lg shadow-md focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-purple-800 transition-all"
            >
              Entrar
            </button>
          </form>

          {/* Link para Cadastro e Recuperação */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Não está registrado?{" "}
              <Link
                to="/cadastro"
                className="text-purple-600 hover:text-purple-500"
              >
                Crie uma conta
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Esqueceu a senha?{" "}
              <Link
                to="/recuperação"
                className="text-purple-600 hover:text-purple-500"
              >
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
