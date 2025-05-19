// Arquivo: AdmEvento.tsx
import React, { use, useEffect, useState } from "react";
import Navbar from "../../componentes/BarraNav";
import BarraLateral from "../../componentes/BarraLateral";
import ModalNovoEvento from "./ModalNovoEvento";
import ModalEdicaoEvento from "../../componentes/ModalEdicaoEvento";
import { useAuth } from "../../contexts/AuthContext";
import FiltroEventos from "../../componentes/FiltroEventos";
import { Navigate, useNavigate } from "react-router-dom";
import Rodape from "../../componentes/Rodape";

interface Evento {
  id: number;
  descricao: string;
  descricao_completa: string;
  data: Date;
  hora: string;
  categoria: number;
  imagem_evento: string | null;
  endereco_id: number;
  avaliacao_media: string;
  nome: string;
  criado_em: Date;
  criado_por: number;
  nome_usuario: string;
  email_usuario: string;
}

const AdmEvento = () => {
  const navigate = useNavigate();
  const [EventoList, setEventoList] = useState<Evento[]>([]);
  const { usuario } = useAuth();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [isModalNovoOpen, setIsModalNovoOpen] = useState(false);
  const [isModalEdicaoOpen, setIsModalEdicaoOpen] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(
    null
  );

  const [isModalConfirmarOpen, setIsModalConfirmarOpen] = useState(false);
  const [eventoParaDeletar, setEventoParaDeletar] = useState<Evento | null>(
    null
  );

  const carregarEventos = async () => {
    try {
      const res = await fetch("http://localhost:3000/eventos");
      const data = await res.json();
      setEventos(data);
      setEventoList(data);
    } catch (err) {
      console.error("Erro ao buscar eventos:", err);
    }
  };

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
    }
    if (usuario) {
      if (usuario?.tipo === "usuario") {
        navigate("/PaginaInicialLogin");
      }
      if (usuario?.id) {
        verificaTipo();
      }
    }
    carregarEventos();
  }, [usuario]);

  const verificaTipo = () => {
    if (usuario?.tipo !== "admin") {
      navigate("/login");
    }
  };

  const deletarEvento = async (id: number) => {
    try {
      const resp = await fetch(`http://localhost:3000/eventos/${id}`, {
        method: "DELETE",
      });
      if (resp.ok) {
        setEventos((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error("Erro ao deletar evento:", err);
    }
  };

  return (
    <div className=" bg-gradient-to-br from-purple-100 to-white min-h-screen">
      <Navbar onToggleSidebar={() => setSidebarAberta(!sidebarAberta)} />
      <BarraLateral isOpen={sidebarAberta} />

      <FiltroEventos
        eventosList={EventoList}
        setEventos={setEventos}
        sidebarAberta={sidebarAberta}
      />

      <div
        className={`bg-white rounded-3xl shadow-2xl p-8 transition-all duration-300 ${
          sidebarAberta ? "ml-64" : "ml-6"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-purple-700">
            Gerenciar Eventos
          </h2>
          <button
            onClick={() => setIsModalNovoOpen(true)}
            className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent font-extrabold text-lg px-5 py-2 rounded-xl shadow-md hover:scale-105 transition animate-gradient"
          >
            + Novo Evento
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2 table-fixed">
            <thead>
              <tr className="text-sm text-purple-800">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nome</th>
                <th className="px-4 py-2 hidden sm:table-cell">Descricao</th>
                <th className="px-4 py-2 hidden sm:table-cell">usuario</th>
                <th className="px-4 py-2 hidden sm:table-cell">Data</th>
                <th className="px-4 py-2 hidden sm:table-cell">Hora</th>
                <th className="px-4 py-2 hidden md:table-cell">Avaliação</th>
                <th className="px-4 py-2">Imagem</th>
                <th className="px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm ">
              {eventos.map((evento) => (
                <tr key={evento.id} className="bg-white shadow rounded-xl">
                  <td className="px-4 py-2 font-medium">{evento.id}</td>
                  <td className="px-4 py-2">{evento.nome}</td>
                  <td className="px-4 py-2 hidden sm:table-cell">
                    {evento.descricao_completa}
                  </td>
                  <td className="px-4 py-2 hidden sm:table-cell">
                    {evento.nome_usuario}
                  </td>
                  <td className="px-4 py-2 hidden sm:table-cell">
                    {new Date(evento.data).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 hidden sm:table-cell">
                    {evento.hora}
                  </td>
                  <td className="px-4 py-2 hidden md:table-cell">
                    {parseFloat(evento.avaliacao_media)?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-4 py-2">
                    <img
                      src={
                        evento.imagem_evento
                          ? `${evento.imagem_evento}`
                          : "./photo-video.webp"
                      }
                      alt="Evento"
                      className={`w-10 h-10 rounded-full object-cover ${
                        evento.imagem_evento ? "border-2 border-purple-300" : ""
                      } `}
                    />
                  </td>
                  <td className="py-2 flex gap-2 flex-col">
                    <button
                      onClick={() => {
                        setEventoSelecionado(evento);
                        setIsModalEdicaoOpen(true);
                      }}
                      className="bg-yellow-400 text-white px-4 py-1 rounded-lg hover:bg-yellow-500"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setEventoParaDeletar(evento);
                        setIsModalConfirmarOpen(true);
                      }}
                      className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalNovoOpen && (
        <ModalNovoEvento
          isOpen={isModalNovoOpen}
          onClose={(atualizar) => {
            setIsModalNovoOpen(false);
            if (atualizar) carregarEventos();
          }}
        />
      )}

      {isModalEdicaoOpen && eventoSelecionado && (
        <ModalEdicaoEvento
          evento={eventoSelecionado}
          onClose={(atualizar) => {
            setIsModalEdicaoOpen(false);
            setEventoSelecionado(null);
            if (atualizar) carregarEventos();
          }}
        />
      )}

      {isModalConfirmarOpen && eventoParaDeletar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-80 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Confirmar Deleção
            </h2>
            <p className="mb-6">
              Tem certeza que deseja deletar{" "}
              <strong>{eventoParaDeletar.nome}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
                onClick={() => setIsModalConfirmarOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
                onClick={() => {
                  deletarEvento(eventoParaDeletar.id);
                  setIsModalConfirmarOpen(false);
                }}
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className={` bottom-0  w-full transition-all duration-300 ${
          sidebarAberta ? "ml-58 " : " m-10 ml-0"
        }`}
      >
        <Rodape />
      </div>
    </div>
  );
};

export default AdmEvento;
