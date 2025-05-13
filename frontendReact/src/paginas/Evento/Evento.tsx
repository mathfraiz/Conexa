import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSessionStorage from "../../../hook/useSessionStorage";

interface Evento {
  id: number;
  nome: string;
  descricao: string;
  data: Date;
  hora: string;
  imagem_evento: string | null;
  criado_por: number;
}

const Evento = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [usuario] = useSessionStorage<any>("usuario", {
    id: 0,
    nome: "",
    email: "",
    tipo: "",
  });
  const [evento, setEvento] = useState<Evento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const buscarEvento = async () => {
      try {
        const resp = await fetch(`http://localhost:3000/evento/${id}`);
        if (resp.ok) {
            const data = await resp.json();
            console.log(data)
          setEvento(data);
        } else {
          setMensagem("Evento não encontrado.");
        }
      } catch (err) {
        console.error(err);
        setMensagem("Erro ao buscar evento.");
      } finally {
        setCarregando(false);
      }
    };

    buscarEvento();
  }, [id]);

  const inscreverUsuario = async () => {
    if (usuario.id === 0) {
      navigate("/login");
      return;
    }

    try {
      const resp = await fetch("http://localhost:3000/inscricoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: usuario.id,
          evento_id: evento?.id,
        }),
      });

      if (resp.ok) {
        setMensagem("Inscrição realizada com sucesso!");
      } else {
        setMensagem("Você já está inscrito ou ocorreu um erro.");
      }
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao tentar se inscrever.");
    }
  };

  if (carregando) return <p className="p-6">Carregando evento...</p>;
  if (!evento) return <p className="p-6 text-red-500">{mensagem}</p>;

  return (
    <div className="min-h-screen bg-gray-100 text-black p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {evento.imagem_evento && (
          <img
            src={evento.imagem_evento}
            alt={evento.nome}
            className="w-full h-64 object-cover"
          />
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold text-purple-700 mb-4">
            {evento.nome}
          </h1>
          <p className="text-gray-700 mb-2">
            <strong>Data:</strong> {new Date(evento.data).toLocaleDateString()}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Hora:</strong> {evento.hora}
          </p>
          <p className="text-gray-800 mb-6">{evento.descricao}</p>

          <button
            onClick={inscreverUsuario}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
          >
            Inscrever-se
          </button>

          {mensagem && (
            <p className="mt-4 text-green-600 font-semibold">{mensagem}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Evento;
