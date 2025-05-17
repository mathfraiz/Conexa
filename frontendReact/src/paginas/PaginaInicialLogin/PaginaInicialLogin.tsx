import React, { useEffect, useState } from "react";
import MotionContainer from "../../componentes/MotionConteiner";
import { Link } from "react-router-dom";
import Navbar from "../../componentes/BarraNav";
import { useAuth } from "../../contexts/AuthContext";

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
  
  const { usuario } = useAuth();
  const [mensagem, setMensagem] = useState("");
  const [usuarioCriador,setusuarioCriador] = useState("")

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const [eventosList, setEventoList] = useState<Evento[]>([]);
  const [eventos1, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    if (usuario?.id === 0) {
      location.href = "/login";
    } else {
      respEventos();

    }
  }, []);

  const respEventos = async () => {
    try {
      const response = await fetch("http://localhost:3000/eventos");
      if (response.ok) {
        const data = await response.json();
        console.log("data", data);

        setEventoList(data);
        setEventos(data);
      }
    } catch (e) {
      console.log("data", e);
      if (e) {
        setMensagem("Nao foi possivel encontrar eventos");
        return;
      }
    }
  };
  

  return (
    <div className="min-h-screen  flex flex-col bg-[url(/logo.jpg)] text-white bg-cover bg-center">
      {/* Navbar fixa no topo */}
      <div className="flex-shrink-0">
        <Navbar onToggleSidebar={toggleSidebar} />
      </div>

      <div className="flex pt-8 h-full">
        {/* Sidebar */}

        <aside
          className={`fixed top-16 left-0 z-40 h-full bg-purple-600 w-60 p-4 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full w-0"
          }`}
        >
          <Link
            to="/cadastroEvento"
            className="block bg-purple-700 text-black font-semibold px-3 py-2 rounded shadow hover:bg-purple-300 mb-4 transition duration-700"
          >
            Criar Evento
          </Link>
          {/* Adicione mais links se quiser */}
          <Link
            to={"/eventos/usuario"}
            className=" block bg-purple-700 text-black font-semibold px-3 py-2 rounded shadow hover:bg-purple-300 mb-4 transition duration-700"
          >
            Meus Eventos
          </Link>
        </aside>

        {/* Conteúdo */}
        <main
          className={`flex-1 overflow-y-auto pl-6 transition-all duration-300 ${
            sidebarOpen ? "ml-60" : "ml-0 "
          }`}
        >
          {mensagem && (
            <span className="bg-yellow-500 text-black text-lg">{mensagem}</span>
          )}

          <div className=" flex justify-center ">
            <span className=" h-6 bg-gray-500 rounded-lg mb-8 ">
              <input
                onChange={(e) => {
                  const filtro = e.target.value;
                  const filtrados = eventosList.filter((ev) =>
                    ev.nome.toLowerCase().includes(filtro.toLowerCase())
                  );
                  setEventos(filtrados);
                }}
                className="w-full text-black text-center"
                placeholder="nome do evento"
              />
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos1.map((evento) => (
              <MotionContainer
                key={evento.id}
                height="h-64"
                animation={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl shadow-xl bg-white bg-blend-overlay hover:shadow-2xl transition relative duration-700 transform hover:scale-110"
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
                    to={`/eventos'/${evento.id}`}
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
        </main>
      </div>
    </div>
  );
};

export default PaginaInicialLogin;
