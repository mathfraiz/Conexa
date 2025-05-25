import api from "./apiController.ts";

// Serviço de evento
const eventoService = {
  listarEventos: () => api.get("eventos"),
  buscarEventoPorId: (id: number) => api.get(`evento/${id}`),
  criarEvento: (evento: object) => api.post("evento", evento),
  atualizarEvento: (id: number, dados: object) =>
    api.put(`evento/${id}`, dados),
  deletarEvento: (id: number) => api.delete(`evento/${id}`),
};

export default eventoService;
