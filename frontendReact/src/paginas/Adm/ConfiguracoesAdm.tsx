import React, { useEffect, useState } from "react";
import Navbar from "../../componentes/BarraNav";
import BarraLateral from "../../componentes/BarraLateral";

const ConfiguracoesAdm = () => {
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [tema, setTema] = useState("Claro");
  const [cadastroHabilitado, setCadastroHabilitado] = useState(true);
  const [limiteHorario, setLimiteHorario] = useState("");

  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema");
    if (temaSalvo === "Escuro") {
      setTema("Escuro");
      document.documentElement.classList.add("modo-escuro");
    }
  }, []);

  useEffect(() => {
    if (tema === "Escuro") {
      document.documentElement.classList.add("modo-escuro");
    } else {
      document.documentElement.classList.remove("modo-escuro");
    }
    localStorage.setItem("tema", tema);
  }, [tema]);

  const handleExportar = async (tipo: string) => {
    try {
      const token = sessionStorage.getItem("token");
      const rota = tipo === "usuarios" ? "usuario/exportar" : "evento/exportar";

      const response = await fetch(`http://localhost:3000/${rota}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao exportar dados");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${tipo}.json`;
      link.click();
    } catch (error) {
      console.error("Erro ao exportar:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white modo-escuro:bg-[#1a1a1a] modo-escuro:text-white transition-colors duration-300">
      <Navbar onToggleSidebar={() => setSidebarAberta(!sidebarAberta)} />
      <BarraLateral isOpen={sidebarAberta} />

      <main
        className={`transition-all duration-300 ${
          sidebarAberta ? "ml-64" : "ml-0"
        } p-8`}
      >
        <h1 className="text-3xl font-extrabold text-purple-700 mb-6 preservar-cor">
          Configurações do Administrador
        </h1>

 

        <section className="bg-white modo-escuro:bg-[#2a2a2a] rounded-xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Preferências</h2>
          <div className="flex items-center gap-4 mb-4">
            <span>Tema:</span>
            <button
              onClick={() => setTema("Claro")}
              className={`px-4 py-1 rounded ${
                tema === "Claro"
                  ? "bg-purple-300 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              Claro
            </button>
            <button
              onClick={() => setTema("Escuro")}
              className={`px-4 py-1 rounded ${
                tema === "Escuro"
                  ? "bg-purple-700 text-white"
                  : "bg-gray-800 text-white"
              }`}
            >
              Escuro
            </button>
          </div>
          <p className="text-sm">Tema atual: {tema}</p>
        </section>

        <section className="bg-white modo-escuro:bg-[#2a2a2a] rounded-xl shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4">Exportação de Dados</h2>
          <button
            onClick={() => handleExportar("usuarios")}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mr-4"
          >
            Exportar Usuários
          </button>
          <button
            onClick={() => handleExportar("eventos")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Exportar Eventos
          </button>
        </section>
      </main>
    </div>
  );
};

export default ConfiguracoesAdm;
