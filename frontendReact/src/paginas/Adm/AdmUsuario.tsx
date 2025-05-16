import React, { useEffect, useState } from "react";
import useSessionStorage from "../../../hook/useSessionStorage.tsx";
import Navbar from "../../componentes/BarraNav.tsx";
import ModalNovoUsuario from "./ModalNovoUsuario.tsx";
import ModalEdicaoUsuario from "./ModalEdicaoUsuario.tsx";
import BarraLateral from "../../componentes/BarraLateral.tsx";

interface Usuario {
  email: string;
  id: number;
  imagem_perfil: string | null;
  nome: string;
  senha: string;
  telefone: string;
  tipo: string;
}

const AdmUsuario = () => {
  const [isModalConfirmarOpen, setIsModalConfirmarOpen] = useState(false);
  const [idUsuarioParaDeletar, setIdUsuarioParaDeletar] = useState<
    number | null
  >(null);
  const [nomeUsuarioParaDeletar, setNomeUsuarioParaDeletar] =
    useState<string>("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMensagem, setModalMensagem] = useState("");
  const [sucesso, setSucesso] = useState(true);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [isModalNovoUsuarioOpen, setIsModalNovoUsuarioOpen] = useState(false);
  const [isModalEdicaoOpen, setIsModalEdicaoOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(
    null
  );
  useEffect(() => verificaTipo());

  const [usuarioSession, setUsuarioSessio] = useSessionStorage<any>("usuario", {
    id: 0,
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    tipo: "",
    imagem_perfil: "",
  });
  

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
    if(usuarioSession.tipo !== "admin") {
      location.href = "http://localhost:5173/login";
      return
    }
    carregarUsuarios();
  }, []);

  const deletarUsuario = async (id: number) => {
    try {
      const resp = await fetch(`http://localhost:3000/usuario/${id}`, {
        method: "DELETE",
      });
      if (resp.ok) {
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
        abrirModalMensagem(`Usuário ID ${id} deletado!`, false); // Agora toast vermelho
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
    setTimeout(() => setModalOpen(false), 3000);
  };

  const handleOpenModalNovoUsuario = () => {
    setUsuarioSelecionado(null);
    setIsModalNovoUsuarioOpen(true);
  };

  const handleOpenModalEditarUsuario = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setIsModalEdicaoOpen(true);
  };

  const handleCloseModalNovoUsuario = (foiSalvo: boolean) => {
    setIsModalNovoUsuarioOpen(false);
    if (foiSalvo) {
      abrirModalMensagem("Usuário cadastrado com sucesso!", true);
      carregarUsuarios();
    }
  };

  const handleCloseModalEditarUsuario = (foiSalvo: boolean) => {
    setIsModalEdicaoOpen(false);
    setUsuarioSelecionado(null);
    if (foiSalvo) {
      abrirModalMensagem("Usuário editado com sucesso!", true);
      carregarUsuarios();
    }
  };
  const verificaTipo = () => {
    if (usuarioSession.tipo !== "admin") {
      location.href = "http://localhost:3000/login";
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-purple-100 to-white min-h-screen ">
      <Navbar onToggleSidebar={() => setSidebarAberta(!sidebarAberta)} />
      <BarraLateral isOpen={sidebarAberta} />

      <div
        className={` w-90% bg-white rounded-3xl shadow-2xl p-8 transition-all duration-300 ${
          sidebarAberta ? "ml-64 " : " m-10 ml-0"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-purple-700">
            Gerenciar Usuários
          </h2>
          <button
            className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent font-extrabold text-lg px-5 py-2 rounded-xl shadow-md hover:scale-105 transition animate-gradient"
            onClick={handleOpenModalNovoUsuario}
          >
            + Novo Usuário
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-sm text-purple-800">
                {/* Colunas visíveis apenas em telas médias para cima */}
                <th className="px-4 py-2 hidden sm:table-cell">ID</th>
                <th className="px-4 py-2 hidden sm:table-cell">Nome</th>

                {/* Sempre visível */}
                <th className="px-4 py-2">Email</th>

                {/* Oculto em mobile */}
                <th className="px-4 py-2 hidden md:table-cell">Telefone</th>
                <th className="px-4 py-2 hidden md:table-cell">Tipo</th>

                {/* Sempre visível */}
                <th className="px-4 py-2 hidden sm:table-cell">Imagem</th>
                <th className="px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {usuarios.map((user) => (
                <tr key={user.id} className="bg-white shadow rounded-xl">
                  <td className="px-4 py-2 hidden sm:table-cell font-medium">
                    {user.id}
                  </td>
                  <td className="px-4 py-2 hidden sm:table-cell ">
                    {user.nome}
                  </td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 hidden md:table-cell">
                    {user.telefone}
                  </td>
                  <td className="px-4 py-2 hidden md:table-cell capitalize">
                    {user.tipo}
                  </td>

                  <td className="px-4 py-2 hidden sm:table-cell">
                    <img
                      src={
                        user.imagem_perfil
                          ? `data:image/jpeg;base64,${user.imagem_perfil}`
                          : "./imagem_Icon_User.png"
                      }
                      alt="Perfil"
                      className="w-10 h-10 rounded-full object-cover border-2 border-purple-300"
                    />
                  </td>
                  <td className=" py-2 flex gap-2 flex-col">
                    <button
                      className="bg-yellow-400 text-white px-4 py-1 rounded-lg hover:bg-yellow-500"
                      onClick={() => handleOpenModalEditarUsuario(user)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
                      onClick={() => {
                        setIdUsuarioParaDeletar(user.id);
                        setNomeUsuarioParaDeletar(user.nome);
                        setIsModalConfirmarOpen(true);
                      }}
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalNovoUsuarioOpen && (
        <ModalNovoUsuario
          isOpen={isModalNovoUsuarioOpen}
          onClose={handleCloseModalNovoUsuario}
        />
      )}

      {isModalEdicaoOpen && usuarioSelecionado && (
        <ModalEdicaoUsuario
          isModalOpen={isModalEdicaoOpen}
          usuario={usuarioSelecionado}
          onClose={handleCloseModalEditarUsuario}
        />
      )}

      {modalOpen && (
        <div
          className={`fixed bottom-6 right-6 ${
            sucesso
              ? "bg-green-100 border-2 border-green-600 text-green-700"
              : "bg-red-100 border-2 border-red-600 text-red-700"
          } px-6 py-3 rounded-xl shadow-2xl animate-fade-in text-center font-semibold`}
        >
          {modalMensagem}
        </div>
      )}

      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradientShift 5s ease infinite;
          }
        `}
      </style>
      {isModalConfirmarOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-80 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Confirmar Deleção
            </h2>
            <p className="mb-6">
              Tem certeza que deseja deletar{" "}
              <strong>{nomeUsuarioParaDeletar}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
                onClick={() => setIsModalConfirmarOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
                onClick={() => {
                  if (idUsuarioParaDeletar !== null) {
                    deletarUsuario(idUsuarioParaDeletar);
                    setIsModalConfirmarOpen(false);
                  }
                }}
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmUsuario;
