import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
}

const BarraLateral: React.FC<Props> = ({ isOpen }) => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [tipo, setTipo] = useState("");
  const [modoEscuro, setModoEscuro] = useState(false);

  useEffect(() => {
    if (usuario && usuario.tipo) {
      setTipo(usuario.tipo);
    }
  }, [usuario]);

  useEffect(() => {
    const isAtivado = localStorage.getItem("modoEscuro") === "true";
    setModoEscuro(isAtivado);
    if (isAtivado) {
      document.documentElement.classList.add("modo-escuro");
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (modoEscuro) {
      root.classList.add("modo-escuro");
    } else {
      root.classList.remove("modo-escuro");
    }
    localStorage.setItem("modoEscuro", JSON.stringify(modoEscuro));
  }, [modoEscuro]);

  return (
    <aside
      className={`fixed top-16 left-0 z-40 h-full w-60 p-6 bg-white shadow-xl transition-transform duration-300 border-r-2 border-purple-300 flex flex-col justify-between ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col gap-4">
        {tipo === "admin" ? (
          <>
            <button
              onClick={() => {
                navigate("/admin");
              }}
              className="text-purple-700 font-bold py-2 px-4 rounded-xl border border-purple-500 hover:bg-purple-100 transition"
            >
              Página Inicial
            </button>
            <button
              onClick={() => {
                navigate("/admusuarios");
              }}
              className="text-purple-700 font-bold py-2 px-4 rounded-xl border border-purple-500 hover:bg-purple-100 transition"
            >
              Gerenciar Usuários
            </button>
            <button
              onClick={() => {
                navigate("/admeventos");
              }}
              className="text-purple-700 font-bold py-2 px-4 rounded-xl border border-purple-500 hover:bg-purple-100 transition"
            >
              Gerenciar Eventos
            </button>
            <button
              onClick={() => {
                navigate("/configuracoes");
              }}
              className="text-purple-700 font-bold py-2 px-4 rounded-xl border border-purple-500 hover:bg-purple-100 transition"
            >
              Configurações
            </button>
          </>
        ) : tipo === "usuario" ? (
          <>
            <button
              onClick={() => {
                navigate("/paginainicial");
              }}
              className="text-purple-700 font-bold py-2 px-4 rounded-xl border border-purple-500 hover:bg-purple-100 transition"
            >
              Página Inicial
            </button>

            <button
              onClick={() => {
                navigate("/cadastroEvento");
              }}
              className="text-purple-700 font-bold py-2 px-4 rounded-xl border border-purple-500 hover:bg-purple-100 transition"
            >
              Criar Evento
            </button>
            <button
              onClick={() => {
                navigate("/eventos/usuario");
              }}
              className="text-purple-700 font-bold py-2 px-4 rounded-xl border border-purple-500 hover:bg-purple-100 transition"
            >
              Meus Eventos
            </button>
            <button
              onClick={() => {
                navigate("/inscricoes");
              }}
              className="text-purple-700 font-bold py-2 px-4 rounded-xl border border-purple-500 hover:bg-purple-100 transition"
            >
              Minhas Inscrições
            </button>
          </>
        ) : null}

        {/* Botão "Sobre" para ambos os tipos */}
        <button
          onClick={() => {
            navigate("/");
          }}
          className="text-purple-700 font-bold py-2 px-4 rounded-xl border border-purple-500 hover:bg-purple-100 transition"
        >
          Sobre
        </button>
      </div>

      {/* Botão Modo Escuro */}
      <div className="pt-6 mt-2 mb-16 border-t border-purple-200">
        <span className="text-sm font-semibold text-purple-700 mb-2 block">
          Modo Escuro
        </span>
        <div
          onClick={() => setModoEscuro(!modoEscuro)}
          className={`w-12 h-6 flex items-center rounded-full cursor-pointer p-1 transition duration-300 ${
            modoEscuro
              ? "bg-purple-300 justify-end"
              : "bg-purple-700 justify-start"
          }`}
        >
          <div className="w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300" />
        </div>
      </div>
    </aside>
  );
};

export default BarraLateral;
