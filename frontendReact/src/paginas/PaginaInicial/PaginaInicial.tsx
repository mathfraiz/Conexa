import React, { useEffect, useState } from "react";
import MotionContainer from "../../componentes/MotionConteiner";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../componentes/BarraNav";
import { useAuth } from "../../contexts/AuthContext";
import FiltroEventos from "../../componentes/FiltroEventos";
import BarraLateral from "../../componentes/BarraLateral";
import Rodape from "../../componentes/Rodape";
import { Evento } from "../../types/Evento";

// interface User{
//   id:number,
//   nome:string,
//   email:string,
//   senha:string,
//   telefone:string
//   tipo:string,
// }

const PaginaInicial = () => {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const [mensagem, setMensagem] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const [eventosList, setEventoList] = useState<Evento[]>([]);
  const [eventos1, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    if (usuario) respEventos();
  }, [usuario]);

  const respEventos = async () => {
    try {
      const response = await fetch("http://localhost:3000/eventos");

      if (response.ok) {
        const data = await response.json();
        console.log("data", data);

        setEventoList(data);
        setEventos(data);
      } else if (response.status == 401) {
        setMensagem("Sessao expirada");
        setTimeout(() => {
          logout();
          navigate("/login");
        }, 3000);
      }
    } catch (erro) {
      if (
        erro.message.includes("Failed to fetch") ||
        erro.message.includes("ERR_CONNECTION_REFUSED")
      ) {
        setMensagem("erro ao acessar o backend tente novamente mais tarte");
        setTimeout(() => {
          setMensagem("");
        }, 3000);
        return;
      }
      console.log("data", erro);
      if (erro) {
        setMensagem(erro);
        return;
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[url(/logo.jpg)] text-white bg-cover bg-center">
      {/* Navbar fixa no topo */}
      <div className="flex-shrink-0">
        <Navbar onToggleSidebar={toggleSidebar} />
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <BarraLateral isOpen={sidebarOpen} />

        {/* Conteúdo principal */}
        <main
          className={`flex-1 flex flex-col overflow-x-hidden transition-all duration-300 ${
            sidebarOpen ? "ml-60" : "ml-0"
          }`}
        >
          {mensagem && (
            <span className="bg-yellow-500 text-white text-lg">{mensagem}</span>
          )}

          <FiltroEventos
            eventosList={eventosList}
            setEventos={setEventos}
            sidebarAberta={sidebarOpen}
          />

          <div className="grid grid-cols-1 mr-12 sm:grid-cols-2 pl-6 lg:grid-cols-3 gap-6 flex-grow">
            {eventos1.map((evento) => (
              <MotionContainer
                key={evento.id}
                height="h-64"
                animation={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl shadow-xl bg-white bg-blend-overlay hover:shadow-2xl transition relative duration-700 transform hover:scale-105"
                onClick={() => {
                  location.href = `/eventos/${evento.id}`;
                }}
              >
                <img
                  src={evento.imagem_evento || ""}
                  alt={evento.nome}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative bg-black/50 p-4 rounded-lg w-full text-white">
                  <h4 className="text-lg font-bold">{evento.nome}</h4>
                  <p className="text-sm">
                    Data: {new Date(evento.data).toLocaleDateString()} -{" "}
                    {evento.hora}
                  </p>
                  <Link
                    to={`/eventos/${evento.id}`}
                    className="text-purple-300 hover:underline"
                  >
                    Saiba mais
                  </Link>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((estrela) => {
                      const notaInteira = Math.floor(
                        Number(evento.avaliacao_media)
                      );
                      return (
                        <span
                          key={estrela}
                          className={`text-2xl ${
                            estrela <= notaInteira
                              ? "text-yellow-400"
                              : "text-white"
                          }`}
                        >
                          {estrela <= notaInteira ? "★" : "☆"}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </MotionContainer>
            ))}
          </div>

          <div className="mt-auto">
            <Rodape />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaginaInicial;
