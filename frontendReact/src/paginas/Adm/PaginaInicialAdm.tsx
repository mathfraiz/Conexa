import React, { use, useEffect, useState } from "react";
import Navbar from "../../componentes/BarraNav";
import BarraLateral from "../../componentes/BarraLateral";
import Rodape from "../../componentes/Rodape"; // ✅ Adicionado aqui
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function PaginaInicialAdmin() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!usuario) {
      navigate("/");
    } else if (usuario.tipo == "usuario") {
      navigate("/PaginaInicialLogin");
    }
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col gap bg-purple-50 modo-escuro:bg-[#9333ea] transition-colors duration-300">
      <Navbar onToggleSidebar={toggleSidebar} />
      <BarraLateral isOpen={isSidebarOpen} />

      <main
        className={`flex-1 pt-24 px-6 md:px-20 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Saudação */}
        <section className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-purple-800 drop-shadow-sm tracking-tight modo-escuro:text-white preservar-cor">
            Bem-vindo de volta, {usuario?.nome || "Administrador"} 👋
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-6 modo-escuro:text-gray-100 preservar-cor-gray">
            Você está logado como{" "}
            <span className="font-semibold text-purple-700 preservar-cor">
              Administrador do Conexa
            </span>
          </p>
        </section>

        {/* Mensagem Institucional */}
        <section className="max-w-4xl mx-auto bg-white modo-escuro:bg-purple-800 rounded-3xl shadow-2xl px-12 py-12 text-center border border-gray-200 modo-escuro:border-none space-y-8">
          <p className="text-2xl font-semibold text-purple-700 modo-escuro:text-white tracking-tight">
            🛡️ Sua função vai além da supervisão
          </p>
          <p className="text-lg text-gray-700 modo-escuro:text-gray-100 leading-relaxed">
            Administrar o Conexa é liderar com propósito. Você é o ponto de
            equilíbrio entre usuários, eventos e o ecossistema digital da
            plataforma. Seu papel garante que todas as conexões aconteçam de
            forma fluida, segura e impactante.
          </p>
          <p className="text-lg text-gray-700 modo-escuro:text-gray-100 leading-relaxed">
            Neste painel, você encontra as ferramentas para manter a ordem,
            promover melhorias e acompanhar o que realmente importa. Use essa
            central com responsabilidade e visão estratégica.
          </p>
          <p className=" text-gray-500 modo-escuro:text-gray-200 italic text-base">
            “Excelência na gestão não se impõe — ela se sente em cada detalhe.”
          </p>
        </section>
      </main>
      <div
        className={` bottom-0  w-full transition-all duration-300 mt-10  ${
          isSidebarOpen ? "ml-58 " : "  ml-0"
        }`}
      >
        <Rodape />
      </div>
    </div>
  );
}
