import React, { useEffect, useState } from "react";
import MotionContainer from "../../componentes/MotionConteiner";
import { Link } from "react-router-dom";
import Navbar from "../../componentes/BarraNav";
import useSessionStorage from "../../../hook/useSessionStorage";

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
}
// interface User{
//   id:number,
//   nome:string,
//   email:string,
//   senha:string,
//   telefone:string
//   tipo:string,
// }

const PaginaInicialLogin = () => {
  const [usuarioSession] = useSessionStorage<any>("usuario", {
    id: 0,
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    tipo: "",
    imagem_perfil: "",
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const [eventosList, setEventoList] = useState<Evento[]>([]);
  const [eventos1, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    if (usuarioSession.id === 0) location.href = "/login";
    else respEventos();
  }, []);

  const respEventos = async () => {
    const response = await fetch("http://localhost:3000/eventos");
    const data = await response.json();
    console.log(data)
    setEventoList(data);
    setEventos(data);
  };

  return (
    <div>
      {usuarioSession.id !== 0 && (
        <div className="flex flex-col h-screen text-white bg-[url(\logo.jpg))] ">
          <Navbar onToggleSidebar={toggleSidebar} />

          <div className="flex pt-16 h-full">
            {/* Sidebar */}

            <aside
              className={`fixed top-16 left-0 z-40 h-full bg-purple-600 w-60 p-4 transition-transform duration-300 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full w-0"
              }`}
            >
              <Link
                to="/cadastroEvento"
                className="block bg-purple-300 text-black font-semibold px-3 py-2 rounded shadow hover:bg-purple-200 mb-4"
              >
                Criar Evento
              </Link>
              {/* Adicione mais links se quiser */}
            </aside>

            {/* Conteúdo */}
            <main
              className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${
                sidebarOpen ? "ml-60" : "ml-0 "
              }`}
            >
              <div className="w-1/2 h-6 bg-white rounded-lg mb-8">
                <input
                  onChange={(e) => {
                    const filtro = e.target.value;
                    const filtrados = eventosList.filter((ev) =>
                      ev.nome.toLowerCase().includes(filtro.toLowerCase())
                    );
                    setEventos(filtrados);
                  }}
                  className="w-full text-black"
                  placeholder="       nome do evento"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventos1.map((evento) => (
                  <MotionContainer
                    key={evento.id}
                    height="h-64"
                    animation={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative bg-purple-100 rounded-lg shadow-md hover:scale-105 transition-transform overflow-hidden flex items-end p-4"
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
                        to={`/eventos'/${evento.id}`}
                        className="text-purple-300 hover:underline"
                      >
                        Saiba mais
                      </Link>
                    </div>
                  </MotionContainer>
                ))}
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginaInicialLogin;
