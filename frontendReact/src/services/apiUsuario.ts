import api from "./apiController.ts";

const usuarioService = {
  listarUsuarios: () => api.get("usuario"),
  buscarPorEmail: (email: string) => api.post("usuario/email", { email }),
  criarUsuario: (usuario: object) => api.post("usuario", usuario),
  atualizarUsuario: (id: number, dados: object) =>
    api.put(`usuario/${id}`, dados),
  deletarUsuario: (id: number) => api.delete(`usuario/${id}`),
  login: (credenciais: object) => api.post("login", credenciais),
};

export default usuarioService;
