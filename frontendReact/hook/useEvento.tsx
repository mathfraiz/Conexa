import { useState, useEffect } from "react";

export interface Evento {
  id: number;
  nome: string;
  descricao: string;
  descricao_completa: string;
  data: string;
  hora: string;
  imagem_evento: string | null;
  avaliacao_media: number;
  criado_em: string;
  criado_por: number;
  endereco_id: number;
}

export function useEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    const carregarEventos = async () => {
      try {
        const resposta = await fetch("localhost:3000/eventos");
        if (!resposta.ok) {
          throw new Error("Erro ao buscar eventos");
        }
        const dados = await resposta.json();
        setEventos(dados);
      } catch (err: any) {
        console.error("Erro ao buscar eventos:", err);
        // Aqui você pode definir um estado de erro, se necessário
      }
    };
    carregarEventos();
  }, []);

  return {
    eventos, // ← AQUI ESTÃO OS EVENTOS DISPONÍVEIS
    setEventos, // ← para redefinir eventos manualmente, se quiser
  };
}
