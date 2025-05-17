import React, { useState } from "react";

const FiltroEventos = ({ eventosList, setEventos }) => {
  const [filtros, setFiltros] = useState({
    id: "",
    nome: "",
    categoria: "",
    criador: "",
  });

  const handleFiltroChange = (campo, valor) => {
    const novosFiltros = { ...filtros, [campo]: valor };
    setFiltros(novosFiltros);
    console.log(novosFiltros);

    // Verifica se todos os filtros estão vazios
    if (novosFiltros) {
      console.log("1");
    }
    const todosVazios = Object.values(novosFiltros).every(
      (val) => val.trim() === ""
    );

    if (todosVazios) {
      // Se todos os filtros estiverem vazios, mostra todos os eventos
      console.log("2");
      setEventos(eventosList);
      return;
    }

    const filtrados = eventosList.filter((ev) => {
      const matchId =
        novosFiltros.id === "" ||
        ev.id.toString().includes(novosFiltros.id.toLowerCase());

      const matchNome =
        novosFiltros.nome === "" ||
        ev.nome.toLowerCase().includes(novosFiltros.nome.toLowerCase());

      const matchCategoria =
        novosFiltros.categoria === "" ||
        ev.categoria
          ?.toLowerCase()
          .includes(novosFiltros.categoria.toLowerCase());

      const matchCriador =
        novosFiltros.criador === "" ||
        ev.nome_usuario
          ?.toLowerCase()
          .includes(novosFiltros.criador.toLowerCase());

      return matchId && matchNome && matchCategoria && matchCriador;
    });

    setEventos(filtrados);
  };

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex gap-4 justify-center">
        <input
          type="text"
          placeholder="Filtrar por ID"
          className="text-black px-2 py-1 rounded"
          value={filtros.id}
          onChange={(e) => handleFiltroChange("id", e.target.value)}
        />
        <input
          type="text"
          placeholder="Filtrar por Nome"
          className="text-black px-2 py-1 rounded"
          value={filtros.nome}
          onChange={(e) => handleFiltroChange("nome", e.target.value)}
        />
        <input
          type="text"
          placeholder="Filtrar por Categoria"
          className="text-black px-2 py-1 rounded"
          value={filtros.categoria}
          onChange={(e) => handleFiltroChange("categoria", e.target.value)}
        />
        <input
          type="text"
          placeholder="Filtrar por Criador"
          className="text-black px-2 py-1 rounded"
          value={filtros.criador}
          onChange={(e) => handleFiltroChange("criador", e.target.value)}
        />
      </div>
    </div>
  );
};

export default FiltroEventos;
