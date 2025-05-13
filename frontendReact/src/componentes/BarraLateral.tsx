import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSessionStorage from "../../hook/useSessionStorage";

interface Props {
  isOpen: boolean;
}

const BarraLateral: React.FC<Props> = ({ isOpen }) => {
  const [usuario] = useSessionStorage<any>("usuario", {
    id: 0,
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    tipo: "",
    imagem_perfil: "",
  });

  const [tipo, setTipo] = useState("");

  useEffect(() => {
    if (usuario && usuario.tipo) {
      setTipo(usuario.tipo);
    }
  }, [usuario]);

  const isAdmin = tipo === "admin";

  return (
    <aside
      className={`fixed top-16 left-0 z-40 h-full bg-purple-600 w-60 p-4 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {isAdmin ? (
        <>
          <Link
            to="/PaginaInicialLogin"
            className="block bg-purple-300 text-black font-semibold px-3 py-2 rounded shadow hover:bg-purple-200 mb-4"
          >
            Página Inicial
          </Link>
          <Link
            to="/adm"
            className="block bg-purple-300 text-black font-semibold px-3 py-2 rounded shadow hover:bg-purple-200 mb-4"
          >
            Gerenciar Usuários
          </Link>
          <Link
            to="#"
            className="block bg-purple-300 text-black font-semibold px-3 py-2 rounded shadow hover:bg-purple-200 mb-4"
          >
            Eventos
          </Link>
          <Link
            to="#"
            className="block bg-purple-300 text-black font-semibold px-3 py-2 rounded shadow hover:bg-purple-200 mb-4"
          >
            Configurações
          </Link>
        </>
      ) : tipo === "usuario" ? (
        <Link
          to="/cadastroEvento"
          className="block bg-purple-300 text-black font-semibold px-3 py-2 rounded shadow hover:bg-purple-200 mb-4"
        >
          Criar Evento
        </Link>
      ) : null}

      <Link
        to="/login"
        className="block bg-red-600 text-white font-semibold px-3 py-2 rounded shadow hover:bg-red-500 mt-4 text-center"
      >
        Sair
      </Link>
    </aside>
  );
};

export default BarraLateral;
