import React, { useState } from "react";

const FiltroUsuario = ({ usuariosList, setUsuarios, sidebarAberta }) => {
  const [campoSelecionado, setCampoSelecionado] = useState("nome");
  const [valorFiltro, setValorFiltro] = useState("");

  const handleFiltroChange = (valor) => {
    setValorFiltro(valor);

    if (valor.trim() === "") {
      setUsuarios(usuariosList);
      return;
    }

    const filtrados = usuariosList.filter((user) => {
      const valorLower = valor.toLowerCase();

      switch (campoSelecionado) {
        case "id":
          return user.id.toString().includes(valorLower);
        case "nome":
          return user.nome.toLowerCase().includes(valorLower);
        case "email":
          return user.email.toLowerCase().includes(valorLower);
        case "telefone":
          return user.telefone.toLowerCase().includes(valorLower);
        case "tipo":
          return user.tipo.toLowerCase().includes(valorLower);
        default:
          return true;
      }
    });

    setUsuarios(filtrados);
  };

  return (
    <div
      className={`transition-all duration-300 mb-4 ${
        sidebarAberta ? "ml-64" : "ml-0"
      }`}
    >
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 p-4 bg-white shadow-md rounded-2xl mx-4 md:mx-16">
        <select
          className="w-32 px-4 py-2 rounded-lg border border-purple-700 text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-700 transition"
          value={campoSelecionado}
          onChange={(e) => {
            setCampoSelecionado(e.target.value);
            setValorFiltro("");
            setUsuarios(usuariosList);
          }}
        >
          <option value="id">ID</option>
          <option value="nome">Nome</option>
          <option value="email">Email</option>
          <option value="telefone">Telefone</option>
          <option value="tipo">Tipo</option>
        </select>

        <input
          type="text"
          placeholder={`Filtrar por ${campoSelecionado}`}
          className="px-4 py-2 rounded-lg border border-purple-700 text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-700 transition w-64"
          value={valorFiltro}
          onChange={(e) => handleFiltroChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />

        <button
          onClick={() => {
            setValorFiltro("");
            setUsuarios(usuariosList);
          }}
          className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg transition"
        >
          Limpar Filtro
        </button>
      </div>
    </div>
  );
};

export default FiltroUsuario;
