import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MotionContainer from "../../../componentes/MotionConteiner";
import ModalEdicaoEvento from "../../../componentes/ModalEdicaoEvento";
import Navbar from "../../../componentes/BarraNav";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { Evento } from "../../../types/Evento";

export default function UsuarioEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventoParaDeletar, setEventoParaDeletar] = useState<Evento | null>(
    null
  );
  const [eventoParaEditar, setEventoParaEditar] = useState<Evento | null>(null);
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    if (usuario?.id === 0 || usuario?.tipo !== "usuario") {
      navigate("/login");
    } else {
      buscarEventos();
    }
  }, [usuario]);

  const buscarEventos = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const resposta = await fetch(
        `http://localhost:3000/eventos/usuario/${usuario?.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (resposta.ok) {
        const dados = await resposta.json();
        setEventos(dados);
      } else if (resposta.status == 201) {
        logout();
        navigate("/login");
      }
    } catch (erro) {
      console.error("Erro ao buscar eventos:", erro);
    }
  };

  const confirmarDelecao = async () => {
    if (eventoParaDeletar) {
      const token = sessionStorage.getItem("token");
      const resposta = await fetch(
        `http://localhost:3000/evento/${eventoParaDeletar.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (resposta.ok) {
        setEventoParaDeletar(null);
        buscarEventos();
      } else if (resposta.status == 201) {
        logout();
        navigate("/login");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[url(/logo.jpg)] bg-cover bg-center bg-no-repeat flex flex-col">
      <Navbar onToggleSidebar={toggleSidebar} />

      <aside
        className={`fixed top-16 left-0 z-40 h-full w-60 p-6 bg-white shadow-xl transition-transform duration-300 border-r-2 border-purple-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-4">
          <Link
            to="/cadastroEvento"
            className="text-purple-700 font-bold py-2 px-4 rounded-xl border border-purple-500 hover:bg-purple-100 transition"
          >
            Criar Evento
          </Link>
          <Link
            to="/eventos/usuario"
            className="text-purple-700 font-bold py-2 px-4 rounded-xl border border-purple-500 hover:bg-purple-100 transition"
          >
            Meus Eventos
          </Link>
        </div>
      </aside>

      <main
        className={`pt-24 px-6 transition-all duration-300 ${
          sidebarOpen ? "ml-60" : "ml-0"
        }`}
      >
        <h1 className="text-3xl font-extrabold text-white drop-shadow mb-8">
          Meus Eventos
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map((evento) => (
            <MotionContainer
              key={evento.id}
              height="h-64"
              className="rounded-2xl shadow-xl bg-white bg-blend-overlay hover:shadow-2xl transition relative duration-700 transform hover:scale-105"
              onClick={() => navigate(`/eventos/${evento.id}`)}
            >
              <img
                src={evento.imagem_evento || ""}
                alt={evento.nome}
                className="absolute inset-0 w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl flex flex-col justify-between p-4">
                <div>
                  <h2 className="text-lg font-bold text-white mb-2 drop-shadow">
                    {evento.nome}
                  </h2>
                  <p className="text-sm text-white drop-shadow">
                    {new Date(evento.data).toLocaleDateString()} - {evento.hora}
                  </p>
                  <p className="text-sm text-white mt-1 drop-shadow">
                    {evento.descricao.length > 60
                      ? evento.descricao.slice(0, 60) + "..."
                      : evento.descricao}
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEventoParaEditar(evento);
                    }}
                    className="bg-yellow-400 text-white px-3 py-1 rounded shadow hover:bg-yellow-500"
                  >
                    Editar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEventoParaDeletar(evento);
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </MotionContainer>
          ))}
        </div>
      </main>

      {eventoParaEditar && (
        <ModalEdicaoEvento
          evento={eventoParaEditar}
          onClose={(foiSalvo) => {
            setEventoParaEditar(null);
            if (foiSalvo) buscarEventos();
          }}
        />
      )}

      {eventoParaDeletar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Confirmar Deleção
            </h2>
            <p className="mb-6">
              Tem certeza que deseja deletar o evento{" "}
              <strong>{eventoParaDeletar.nome}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
                onClick={() => setEventoParaDeletar(null)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
                onClick={confirmarDelecao}
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
