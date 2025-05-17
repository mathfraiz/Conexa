import React, { useState } from "react";

const FiltroEventos = ({ eventosList, setEventos }) => {
  const [campoSelecionado, setCampoSelecionado] = useState("nome");
  const [valorFiltro, setValorFiltro] = useState("");

  const handleFiltroChange = (valor) => {
    setValorFiltro(valor);

    if (valor.trim() === "") {
      setEventos(eventosList);
      return;
    }

    const filtrados = eventosList.filter((ev) => {
      const valorLower = valor.toLowerCase();

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
    <div className="flex flex-col gap-4 mb-8 items-center">
      <div className="flex gap-4 flex-wrap justify-center">
        <select
          className="text-black px-2 py-1 rounded"
          value={campoSelecionado}
          onChange={(e) => {
            setCampoSelecionado(e.target.value);
            setValorFiltro(""); // limpa valor ao trocar campo
            setEventos(eventosList); // reseta lista
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
            className="text-black px-2 py-1 rounded"
            value={valorFiltro}
            onChange={(e) => handleFiltroChange(e.target.value)}
          />
        ) : (
          <input
            type="text"
            placeholder={`Filtrar por ${campoSelecionado}`}
            className="text-black px-2 py-1 rounded"
            value={valorFiltro}
            onChange={(e) => handleFiltroChange(e.target.value)}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FiltroEventos;
