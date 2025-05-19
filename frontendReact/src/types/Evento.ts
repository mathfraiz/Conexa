export interface Evento {
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
  nome_usuario: string;
  email_usuario: string;
}

