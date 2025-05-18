export interface Evento {
  id: number;
  nome: string;
  descricao: string;
  descricao_completa: string;
  data: Date;
  hora: string;
  categoria: number;
  imagem_evento: string | null;
  endereco_id: number;
  avaliacao_media: string;
  criado_em: Date;
  criado_por: number;
  nome_usuario?: string;
}
