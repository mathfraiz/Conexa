import React, { useEffect, useRef, useState } from "react";

interface Evento {
  id: number;
  nome: string;
  data: string;
  hora: string;
  descricao: string;
  imagem_evento: string | null;
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
  const [imagem, setImagem] = useState<File | null>(null);
  console.log(data);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("data", data);
    formData.append("hora", hora);
    formData.append("descricao", descricao);
    if (imagem) formData.append("imagem", imagem);

    try {
      await fetch(`http://localhost:3000/eventos/${evento.id}`, {
        method: "PUT",
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
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagem(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-500"
          />
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
