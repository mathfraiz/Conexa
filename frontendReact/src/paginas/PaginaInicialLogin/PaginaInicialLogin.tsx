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
  const [usuarioSession, setUsuarioSession] = useSessionStorage<any>(
    "usuario",
    {
      id: 0,
      nome: "",
      email: "",
      senha: "",
      telefone: "",
      tipo: "",
      imagem_perfil: "",
    }
  );

  useEffect(() => {
    if (usuarioSession.id === 0) {
      location.href = "/login";
    }
  }, []);
  // const us = sessionStorage.getItem("usuario")
  const [eventosList, setEventoList] = useState<Evento[]>([]);
  const [eventos1, setEventos] = useState<Evento[]>([]);
  // const [user,setUsers] = useState<>

  const respEventos = async () => {
    try {
      const response = await fetch("http://localhost:3000/eventos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEventoList(data);
        setEventos(data);
      } else {
        console.error("Erro ao buscar eventos:", response.statusText);
      }
    } catch (error) {
      console.error("Erro de rede:", error);
    }
  };

  // const criadoresEventos = async ()=>{

  //   try{
  //     const res = await fetch("http://localhost:3000/usuario",{
  //       method:"GET",
  //       headers:{
  //         "Content-Type": "application/json",
  //       }
  //     }
  //   )
  //   const users = await res.json()

  //   }
  //   catch{

  //   }

  // }
  useEffect(() => {
    respEventos();
  }, []);

  useEffect(() => {
    verificaUsuario();
  });

  const verificaUsuario = () => {
    if (usuarioSession.id === 0) {
      location.href = "http://localhost:5173/login";
    }
  };
  const filtrarEventos = (eventos: Evento[], filtro: string) => {
    const eventosFiltrados: Evento[] = [];

    if (filtro == "") {
      console.log(eventosList);
      return eventosList;
    }
    eventos.map((e) => {
      console.log("letra");
      if (e.nome.toLowerCase().includes(filtro.toLowerCase())) {
        console.log(e);
        eventosFiltrados.push(e);
      }
    });

    return eventosFiltrados;
  };

  return (
    <div>
      {usuarioSession.id !== 0 && (
        <div className="flex flex-col h-screen bg-[url(./logo.jpg)] text-white bg-cover bg-center bg-no-repeat">
          <div className="flex-shrink-0">
            <Navbar />
          </div>

          {/* Container com aside fixo e main scrollável */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar fixa à esquerda */}
            <aside className="w-60 bg-purple-600 p-4 flex-shrink-0 flex flex-col gap-4">
              {/* <Link
            to="/MeusEventos"
            className="bg-purple-300 font-semibold px-3 py-2 rounded shadow hover:bg-purple-200 transition text-black"
          >
            Meus Eventos
          </Link> */}

              {/* <Link
            to="/Inscritos"
            className="bg-purple-300 font-semibold px-3 py-2 rounded shadow hover:bg-purple-200 transition text-black"
          >
            Inscritos
          </Link> */}

              <Link
                to="/cadastroEvento"
                className="bg-purple-300 font-semibold px-3 py-2 rounded shadow hover:bg-purple-200 transition text-black"
              >
                Criar Evento
              </Link>

              {/* 
          <Link
            to="/configuracoes"
            className="bg-purple-300 font-semibold px-3 py-2 rounded shadow hover:bg-purple-200 transition text-black"
          >
            Configurações
          </Link> */}
            </aside>

            {/* Conteúdo principal com scroll interno */}
            <main className="flex-1 overflow-y-auto p-6 relative">
              {/* Botão no topo direito */}

              {/* Faixa branca ou título */}
              <div className="w-1/2 h-6 bg-white rounded-lg mb-8">
                <input
                  onChange={(e) => {
                    const eventosFiltrados = filtrarEventos(
                      eventosList,
                      e.target.value
                    );
                    if (eventosFiltrados) setEventos(eventosFiltrados);
                  }}
                  type="text"
                  name="pesquisa"
                  id="pesquisa"
                  className="w-full text-black"
                  placeholder="       nome do evento"
                />
              </div>

              {/* Grid responsivo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventos1?.map((evento) => (
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
                        to={`/eventos/${evento.id}`}
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
