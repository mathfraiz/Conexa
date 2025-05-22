import React, { use, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MapaEndereco from "../../componentes/MapEndereco";
import Rodape from "../../componentes/Rodape";
import Navbar from "../../componentes/BarraNav";
import { useAuth } from "../../contexts/AuthContext";
import BarraLateral from "../../componentes/BarraLateral";
import { Evento } from "../../types/Evento";

interface Endereco {
  id: number;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  UF: string;
}
const EventoPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const [usuario] = useSessionStorage<any>("usuario", {
  //   id: 0,
  //   nome: "",
  //   email: "",
  //   tipo: "",
  // });
  const { usuario, token, logout } = useAuth();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [endereco, setEndereco] = useState<Endereco | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const [inscricao, setIncricoes] = useState<any>([]);
  const [idInscricao, setIdInscricao] = useState(0);

  const buscarIncricoesUsuario = async (id) => {
    try {
      const inscricoes = await fetch(
        `http://localhost:3000/inscricoesUsuario/${id}`
      );
      if (inscricoes.ok) {
        const inscricoesJson = await inscricoes.json();
        setIncricoes(inscricoesJson);
      }
    } catch (e) {
      console.error(e);
    }
  };

  //   const buscarUsuarioInscrito = async (idEvento,idUsuario)=>{
  //     try{
  //       const usuarioInscrito = await fetch(`http://localhost:3000/avaliacaoEventoUsuario/${idEvento}/${idUsuario}`)

  //     }catch(e){
  // console.log(e)
  //     }
  //   }

  const buscarEndereco = async (id) => {
    if (evento) {
      try {
        const respEndereco = await fetch(
          "http://localhost:3000/endereco/" + id
        );
        if (respEndereco.ok) {
          const data = await respEndereco.json();
          setEndereco(data);
        }
      } catch (err) {
        console.error(err);
        setMensagem("Erro ao buscar criador do evento.");
      }
    }
  };

  const buscarEvento = async () => {
    try {
      const resp = await fetch(`http://localhost:3000/evento/${id}`);

      if (resp.ok) {
        const data = await resp.json();
        setEvento(data);
        buscarIncricoesUsuario(usuario?.id);
      } else {
        setMensagem("Evento não encontrado.");
        setTimeout(() => {
          setMensagem("");
          navigate("/PaginaInicialLogin");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao buscar evento.");
      setTimeout(() => {
        setMensagem("");
        navigate("/PaginaInicialLogin");
      }, 3000);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    console.log("usuario");
    if (!usuario) {
      return;
    }
    buscarEvento();
    verificaInscricao(evento?.id);
  }, [id, usuario]);

  useEffect(() => {
    buscarEndereco(evento?.endereco_id);
    buscarIncricoesUsuario(usuario?.id);
  }, [evento]);

  useEffect(() => {
    verificaInscricao(evento?.id);
  }, [evento, inscricao]);

  const inscreverUsuario = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const resp = await fetch("http://localhost:3000/inscricao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          evento_id: evento?.id,
          usuario_id: usuario?.id,
        }),
      });

      if (resp.ok) {
        const isncr = await resp.json();
        setMensagem("Inscrição realizada com sucesso!");
        setTimeout(() => {
          setMensagem("");
        }, 3000);
        console.log(isncr);
        setIdInscricao(isncr.id);
      } else if (resp.status == 401) {
        logout();
        navigate("/login");
      } else {
        setMensagem("Você já está inscrito ou ocorreu um erro.");
        setTimeout(() => {
          setMensagem("");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao tentar se inscrever.");
    }
  };

  const desinscreverUsuario = async (id: number) => {
    try {
      const resp = await fetch(`http://localhost:3000/inscricao/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (resp.ok) {
        console.log("ok");
        setIdInscricao(0);
      } else if (resp.status === 401) {
        navigate("/login");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const [avaliacao, setAvaliacao] = useState(0);
  const [hover, setHover] = useState(0);

  const enviarAvaliacao = async (estrela: number) => {
    if (!evento || usuario?.id === 0) {
      setMensagem("Você precisa estar logado para avaliar.");
      setTimeout(() => {
        setMensagem("");
      }, 3000);
      return;
    }

    setAvaliacao(estrela);

    try {
      const resp = await fetch("http://localhost:3000/avaliacao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          evento_id: evento.id,
          usuario_id: usuario?.id,
          nota: estrela,
        }),
      });

      if (resp.ok) {
        setMensagem("Obrigado pela sua avaliação!");
        setTimeout(() => {
          setMensagem("");
        }, 3000);
      } else {
        setMensagem("Erro ao registrar sua avaliação.");
        setTimeout(() => {
          setMensagem("");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setMensagem("Erro na conexão ao enviar avaliação.");
    }
  };

  const verificaInscricao = async (eventoid) => {
    for (let i = 0; i <= inscricao.length; i++) {
      if (inscricao[i]?.evento_id === eventoid) {
        setIdInscricao(inscricao[i]?.id);
        return true;
      }
    }
  };

  if (carregando) return <p className="p-6">Carregando evento...</p>;
  if (!evento) return <p className="p-6 text-red-500">{mensagem}</p>;

  return (
    <div className="flex flex-col min-h-screen bg-purple-50">
      <Navbar onToggleSidebar={toggleSidebar} />
      <BarraLateral isOpen={sidebarOpen} />
      <div
        className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${
          sidebarOpen ? "ml-60" : "ml-0 "
        }  bg-cover bg-center bg-no-repeat bg-[url(/logo.jpg)]`}
      >
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div
            className="flex flex-col gap-6 p-6 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `
      linear-gradient(to right, rgba(202,196,202,0.9), rgba(7,7,7,0.7)),
      url(${evento?.imagem_evento || ""})
    `,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundBlendMode: "overlay",
            }}
          >
            <div
              className="rounded-lg shadow p-6 space-y-4"
              style={{
                backgroundImage: `
      linear-gradient(to right, rgba(202,196,202,0.9), rgba(7,7,7,0.7)),
      url(${evento?.imagem_evento || ""})
    `,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundBlendMode: "overlay",
              }}
            >
              <h1 className="text-3xl font-bold text-purple-700">
                {evento.nome}
              </h1>
              <p className="text-purple-700">
                <strong>Data:</strong>{" "}
                {new Date(evento.data).toLocaleDateString()}
              </p>
              <p className="text-purple-700">
                <strong>Hora:</strong> {evento.hora}
              </p>
              <p className="text-purple-700">{evento.descricao}</p>
              <p className="text-purple-700">
                <strong>Criado por:</strong> {evento.nome_usuario}
              </p>
              {endereco && (
                <p className="text-purple-700">
                  <strong>Local:</strong> {endereco.logradouro},{" "}
                  {endereco.numero}, {endereco.bairro} - {endereco.cidade}/
                  {endereco.UF}
                </p>
              )}
              {idInscricao && (
                <button
                  onClick={() => {
                    desinscreverUsuario(idInscricao);
                  }}
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
                >
                  desinscrever
                </button>
              )}
              ''{" "}
              {!idInscricao && (
                <button
                  onClick={inscreverUsuario}
                  className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
                >
                  Inscrever-se
                </button>
              )}
              {mensagem && (
                <p className="text-green-300 font-semibold">{mensagem}</p>
              )}
            </div>

            {/* Descrição completa */}
            {evento.descricao_completa && (
              <div className="bg-white rounded-lg shadow p-6 text-purple-800 text-sm">
                <h3 className="text-lg font-semibold text-purple-700 mb-2">
                  Descrição do Evento:
                </h3>
                <p className="overflow-y-auto max-h-64">
                  {evento.descricao_completa}
                </p>
              </div>
            )}

            {/* Avaliação */}
            <div className="bg-purple-600 text-white rounded-lg shadow p-6 flex flex-col items-center">
              <p className="font-semibold mb-2">Avalie o evento:</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((estrela) => (
                  <span
                    key={estrela}
                    className={`text-2xl cursor-pointer ${
                      estrela <= (hover || avaliacao)
                        ? "text-yellow-400"
                        : "text-white"
                    }`}
                    onClick={() => enviarAvaliacao(estrela)}
                    onMouseEnter={() => setHover(estrela)}
                    onMouseLeave={() => setHover(0)}
                  >
                    {estrela <= (hover || avaliacao) ? "★" : "☆"}
                  </span>
                ))}
              </div>
            </div>

            {/* Mapa */}
            {endereco && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <MapaEndereco
                  enderecoCompleto={`${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.UF}, Brasil`}
                />
              </div>
            )}
          </div>

          <div></div>
        </div>
      </div>
      <div
        className={` bottom-0 w-full transition-all duration-300 ${
          sidebarOpen ? "ml-58 " : " ml-0"
        }`}
      >
        <Rodape />
      </div>{" "}
    </div>
  );
};
export default EventoPage;
