import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MotionContainer from "../../../componentes/MotionConteiner";
import ModalEdicaoEvento from "../../../componentes/ModalEdicaoEvento";
import useSessionStorage from "../../../../hook/useSessionStorage";
import Navbar from "../../../componentes/BarraNav";
import { Link } from "react-router-dom";

interface Evento {
  id: number;
  nome: string;
  data: string;
  hora: string;
  descricao: string;
  descricao_completa: string;
  imagem_evento: string | null;
  endereco_id: number;
  criado_por: number;
}
export default function UsuarioEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventoParaDeletar, setEventoParaDeletar] = useState<Evento | null>(
    null
  );
  const [eventoParaEditar, setEventoParaEditar] = useState<Evento | null>(null);
  const navigate = useNavigate();
  const [usuario, setUsuarioSession] = useSessionStorage<any>("usuario", {
    id: 0,
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    tipo: "",
    imagem_perfil: "",
  });
  useEffect(() => {
    if (usuario.id === 0 || usuario.tipo !== "usuario") {
      navigate("/login");
    }
  }, [usuario]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const buscarEventos = async () => {
    try {
      const token = sessionStorage.getItem("token");
      console.log(usuario);
      const resposta = await fetch(
        `http://localhost:3000/eventos/usuario/${usuario.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (resposta.ok) {
        const dados = await resposta.json();
        setEventos(dados);
        console.log(dados);
      }
    } catch (erro) {
      console.error("Erro ao buscar eeeeeeeeeeeee:", erro);
    }
  };

  const confirmarDelecao = async () => {
    if (eventoParaDeletar) {
      const token = sessionStorage.getItem("token");

      const resposta = await fetch(
        `http://localhost:3000/evento/${eventoParaDeletar.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resposta.ok) {
        setEventoParaDeletar(null);
        buscarEventos();
      } else {
        console.error("Erro ao deletar evento");
      }
    }
  };

  useEffect(() => {
    buscarEventos();
  }, []);

  return (
    <div
      className={`p-6 bg-[url(/logo.jpg)] bg-cover bg-center bg-no-repeat h-screen `}
    >
      <div>
        <Navbar onToggleSidebar={toggleSidebar} />
      </div>

      <aside
        className={`fixed top-16 left-0 z-40 h-full bg-purple-600 w-60 p-4 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full w-0"
        }`}
      >
        <Link
          to="/cadastroEvento"
          className="block bg-purple-300 text-black font-semibold  py-2 rounded shadow hover:bg-purple-200 mb-4"
        >
          Criar Evento
        </Link>
        {/* Adicione mais links se quiser */}
      </aside>

      <div
        className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${
          sidebarOpen ? "ml-60" : "ml-0 "
        }`}
      >
        <h1 className="text-2xl font-bold mb-4">Meus Eventos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map((evento) => (
            <MotionContainer
              key={evento.id}
              height="h-64"
              className="rounded-2xl shadow-xl bg-white bg-blend-overlay hover:shadow-2xl transition relative duration-700 transform hover:scale-105"
              onClick={() => {
                navigate(`/eventos/${evento.id}`);
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-2xl">
                <img
                  src={evento.imagem_evento || ""}
                  alt={evento.nome}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-xl font-bold mb-2">
                    <span className="bg-yellow-200 text-black px-2 rounded">
                      {evento.nome}
                    </span>
                  </h2>

                  <p className="text-white text-sm mb-1 drop-shadow">
                    <span className="bg-yellow-200 text-black px-2 rounded">
                      {new Date(evento.data).toLocaleDateString()} às{" "}
                      {evento.hora}
                    </span>
                  </p>
                  <p className="text-white text-sm drop-shadow">
                    <span className="bg-yellow-200 text-black px-2 rounded">
                      {evento.descricao.length > 60
                        ? evento.descricao.slice(0, 60) + "..."
                        : evento.descricao}
                    </span>
                  </p>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setEventoParaEditar(evento)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded shadow hover:bg-yellow-500"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setEventoParaDeletar(evento)}
                    className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </MotionContainer>
          ))}
        </div>
      </div>

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
