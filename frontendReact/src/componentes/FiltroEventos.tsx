import React, { useState } from "react";
import { Evento } from "../types/Evento";

interface Props {
  eventosList: Evento[];
  setEventos: React.Dispatch<React.SetStateAction<Evento[]>>;
  sidebarAberta: boolean;
}

interface Props {
  eventosList: Evento[];
  setEventos: React.Dispatch<React.SetStateAction<Evento[]>>;
  sidebarAberta: boolean;
}

const FiltroEventos: React.FC<Props> = ({ eventosList, setEventos, sidebarAberta }) => {
  const [campoSelecionado, setCampoSelecionado] = useState("nome");
  const [valorFiltro, setValorFiltro] = useState("");

  const handleFiltroChange = (valor: string) => {
    setValorFiltro(valor);

    if (valor.trim() === "") {
      setEventos(eventosList);
      return;
    }

    const valorLower = valor.toLowerCase();

    const filtrados = eventosList.filter((ev) => {
      switch (campoSelecionado) {
        case "id":
          return ev.id.toString().includes(valorLower);
        case "nome":
          return ev.nome.toLowerCase().includes(valorLower);
        case "descricao":
          return ev.descricao?.toLowerCase().includes(valorLower);
        case "criador":
          return ev.nome_usuario?.toLowerCase().includes(valorLower);
        case "data":
          return new Date(ev.data).toISOString().split("T")[0] === valorFiltro;
        default:
          return true;
      }
    });

    setEventos(filtrados);
  };

  return (
    <div className={`transition-all duration-300 mb-4 ${sidebarAberta ? "ml-64" : "ml-0"}`}>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 p-4 bg-white shadow-md rounded-2xl mx-4 md:mx-16">
        <select
          className="w-32 px-4 py-2 rounded-lg border border-purple-700 text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-700 transition"
          value={campoSelecionado}
          onChange={(e) => {
            setCampoSelecionado(e.target.value);
            setValorFiltro("");
            setEventos(eventosList);
          }}
        >
          <option value="id">ID</option>
          <option value="nome">Nome</option>
          <option value="descricao">Categoria</option>
          <option value="criador">Criador</option>
          <option value="data">Data</option>
        </select>

        {campoSelecionado === "data" ? (
          <input
            type="date"
            className="px-4 py-2 rounded-lg border border-purple-700 text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-700 transition"
            value={valorFiltro}
            onChange={(e) => handleFiltroChange(e.target.value)}
          />
        ) : (
          <input
            type="text"
            placeholder={`Filtrar por ${campoSelecionado}`}
            className="px-4 py-2 rounded-lg border border-purple-700 text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-700 transition w-64"
            value={valorFiltro}
            onChange={(e) => handleFiltroChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        )}

        <button
          onClick={() => {
            setValorFiltro("");
            setEventos(eventosList);
          }}
          className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg transition"
        >
          Limpar Filtro
        </button>
      </div>
    </div>
  );
};

export default FiltroEventos;
