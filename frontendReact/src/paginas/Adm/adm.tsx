import React, { useEffect, useState } from "react";
import useSessionStorage from "../../../hook/useSessionStorage";
import Navbar from "../../componentes/BarraNav";

interface Usuario {
  email: string;
  id: number;
  imagem_perfil: string | null;
  nome: string;
  senha: string;
  telefone: string;
  tipo: string;
}

const Adm = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMensagem, setModalMensagem] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [id, setId] = useState<number | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipo, setTipo] = useState("usuario");
  const [imagemPreview, setImagemPreview] = useState<File | string | null>(
    null
  );
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
  const carregarUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/usuario");
      if (response.ok) {
        const data: Usuario[] = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const openModal = (edit = false, usuario: Usuario | null = null) => {
    setEditMode(edit);
    if (edit && usuario) {
      setId(usuario.id);
      setNome(usuario.nome);
      setEmail(usuario.email);
      setSenha(usuario.senha);
      setTelefone(usuario.telefone);
      setTipo(usuario.tipo);
      setImagemPreview(
        usuario.imagem_perfil
          ? `data:image/jpeg;base64,${usuario.imagem_perfil}`
          : null
      );
    } else {
      limparFormulario();
    }
    setIsModalOpen(true);
  };

  const limparFormulario = () => {
    setId(null);
    setNome("");
    setEmail("");
    setSenha("");
    setTelefone("");
    setTipo("usuario");
    setImagemPreview(null);
  };

  const closeModal = () => {
    limparFormulario();
    setIsModalOpen(false);
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImagemPreview(file);
  };

  const deletarUsuario = async (id: number) => {
    try {
      const resp = await fetch(`http://localhost:3000/usuario/${id}`, {
        method: "DELETE",
      });
      if (resp.ok) {
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
        abrirModalMensagem(`Usuário com ID ${id} deletado com sucesso`, true);
      }
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      abrirModalMensagem("Erro ao deletar usuário", false);
    }
  };

  const abrirModalMensagem = (mensagem: string, sucessoStatus: boolean) => {
    setModalMensagem(mensagem);
    setSucesso(sucessoStatus);
    setModalOpen(true);
    setTimeout(() => setModalOpen(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(nome && email && senha && telefone && tipo)) return;

    const form = new FormData();
    form.append("nome", nome);
    form.append("email", email);
    form.append("telefone", telefone);
    form.append("senha", senha);
    form.append("tipo", tipo);
    if (imagemPreview && typeof imagemPreview !== "string") {
      form.append("imagem_perfil", imagemPreview);
    }

    const url = id
      ? `http://localhost:3000/usuario/${id}`
      : "http://localhost:3000/usuario";
    const method = id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        body: form,
      });

      if (response.ok) {
        await carregarUsuarios();
        closeModal();
        abrirModalMensagem("Usuário salvo com sucesso", true);

        // Atualizar sessionStorage se editar o próprio usuário logado
        const usuarioSession = sessionStorage.getItem("usuario");
        if (usuarioSession) {
          const usuarioAtual = JSON.parse(usuarioSession);
          if (usuarioAtual.id === id) {
            const novoUsuario = {
              ...usuarioAtual,
              nome,
              email,
              telefone,
              tipo,
              imagem_perfil:
                typeof imagemPreview === "string"
                  ? imagemPreview
                  : usuarioAtual.imagem_perfil,
            };
            sessionStorage.setItem("usuario", JSON.stringify(novoUsuario));
          }
        }
      } else {
        closeModal();
        abrirModalMensagem("Erro ao salvar usuário", false);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      closeModal();
      abrirModalMensagem("Erro na comunicação com o servidor", false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Navbar isLogado={true} />
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">
            Gerenciar Usuários
          </h2>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => openModal(false)}
          >
            Novo Usuário
          </button>
        </div>

        {/* Tabela de usuários */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-sm text-gray-700">
              <th className="p-3 border-b">ID</th>
              <th className="p-3 border-b">Nome</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Telefone</th>
              <th className="p-3 border-b">Tipo</th>
              <th className="p-3 border-b">Imagem</th>
              <th className="p-3 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id} className="text-sm border-t">
                <td className="p-3">{user.id}</td>
                <td className="p-3">{user.nome}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.telefone}</td>
                <td className="p-3 capitalize">{user.tipo}</td>
                <td className="p-3">
                  {user.imagem_perfil && (
                    <img
                      src={`data:image/jpeg;base64,${user.imagem_perfil}`}
                      alt="Perfil"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    onClick={() => openModal(true, user)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => deletarUsuario(user.id)}
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Cadastro/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {editMode ? "Editar Usuário" : "Novo Usuário"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="Telefone"
                className="w-full border p-2 rounded"
              />
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="usuario">Usuário</option>
                <option value="admin">Admin</option>
              </select>
              <input
                type="file"
                onChange={handleImagemChange}
                className="w-full"
                accept="image/*"
              />
              {imagemPreview && (
                <img
                  src={
                    typeof imagemPreview === "string"
                      ? imagemPreview
                      : URL.createObjectURL(imagemPreview)
                  }
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-full mx-auto"
                />
              )}
              {imagemPreview && typeof imagemPreview !== "string" && (
                <button
                  type="button"
                  className="text-red-500 text-sm underline block mx-auto mt-2"
                  onClick={() => setImagemPreview(null)}
                >
                  Remover imagem
                </button>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Sucesso ou Erro */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h3
              className={`text-xl font-bold mb-4 ${
                sucesso ? "text-green-600" : "text-red-600"
              }`}
            >
              {sucesso ? "Sucesso!" : "Erro!"}
            </h3>
            <p className="text-gray-700 mb-4">{modalMensagem}</p>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adm;
