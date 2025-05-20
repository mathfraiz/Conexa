import React, { useEffect, useState } from "react";
import MotionContainer from "../../componentes/MotionConteiner";
import { Link } from "react-router-dom";
import Navbar from "../../componentes/BarraNav";
import { Evento } from "../../types/Evento";
import BarraLateral from "../../componentes/BarraLateral";
import { useAuth } from "../../contexts/AuthContext";
import Rodape from "../../componentes/Rodape";
import FiltroEventos from "../../componentes/FiltroEventos";

const Inscritos = () => {
  const { usuario, logout } = useAuth();
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [eventosList, setEventos] = useState<Evento[]>([]);

  const buscarEventosUsuario = async () => {
    try {
      const resp = await fetch(
        "http://localhost:3000/inscricoesUsuario/" + usuario?.id
      );
      if (resp.ok) {
        const resposta = await resp.json();
        setEventos(resposta);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    buscarEventosUsuario();
  }, [usuario]);

  return (
    <div className="min-h-screen  flex flex-col bg-[url(/logo.jpg)] text-white bg-cover bg-center">
      {/* Navbar fixa no topo */}
      <div className="flex-shrink-0">
        <Navbar
          onToggleSidebar={() => {
            setSideBarOpen(!sideBarOpen);
          }}
        />
      </div>

      <div className="flex pt-8   h-full">
        {/* Sidebar */}
        <BarraLateral isOpen={sideBarOpen} />

        {/* Conteúdo */}
        <main
          className={`flex-1 flex flex-col transition-all overflow-hidden duration-300 min-h-screen ${
            sideBarOpen ? "ml-60" : "ml-0"
          }`}
        >
          <FiltroEventos
            eventosList={eventosList!}
            setEventos={setEventos}
            sidebarAberta={sideBarOpen}
          />

          {/* Aqui a grid ocupa todo o espaço disponível */}
          {/* <div className="">

          </div> */}
          
          <div className=" flex flex-grow grid grid-cols-1 mr-12 sm:grid-cols-2 pl-6 lg:grid-cols-3 gap-6">
            {eventosList?.map((evento) => (
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

          {/* Rodapé colado no fundo */}
          <div className="mt-10">
            <Rodape />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Inscritos;
