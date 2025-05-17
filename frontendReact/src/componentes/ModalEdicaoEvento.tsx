import React, { useEffect, useRef, useState } from "react";

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

interface ModalEdicaoEventoProps {
  evento: Evento;
  onClose: (foiSalvo: boolean) => void;
}

const ModalEdicaoEvento: React.FC<ModalEdicaoEventoProps> = ({
  evento,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [nome, setNome] = useState(evento.nome);
  const [data, setData] = useState(evento.data.split("T")[0]);
  const [hora, setHora] = useState(evento.hora);
  const [descricao, setDescricao] = useState(evento.descricao);
  const [descricaoCompleta, setDescricaoCompleta] = useState(
    evento.descricao_completa || ""
  );
  const [imagem, setImagem] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    const token = sessionStorage.getItem("token");

    e.preventDefault();
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("data", data);
    formData.append("hora", hora);
    formData.append("descricao", descricao);
    formData.append("descricao_completa", descricaoCompleta);
    if (imagem) formData.append("imagem", imagem);

    try {
      await fetch(`http://localhost:3000/eventos/${evento.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      onClose(true);
    } catch (err) {
      console.error("Erro ao atualizar evento:", err);
      onClose(false);
    }
  };

  return (
    <div className="fixed top-[5.5rem] right-6 z-50 w-[400px] animate-fade-in">
      <div
        ref={modalRef}
        className="bg-white border border-purple-300 rounded-2xl shadow-2xl p-6 space-y-4"
      >
        <h2 className="text-2xl font-extrabold text-purple-700 text-center">
          Editar Evento
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            placeholder="Nome do evento"
          />
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          />
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          />
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            placeholder="Descrição curta"
          />
          <textarea
            value={descricaoCompleta}
            onChange={(e) => setDescricaoCompleta(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            placeholder="Descrição completa"
          />

          <span>
            <img src={``} alt="" />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagem(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-500"
            />
          </span>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg transition"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEdicaoEvento;
