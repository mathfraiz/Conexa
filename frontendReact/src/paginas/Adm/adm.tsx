import React, { useEffect, useState } from "react";
import useSessionStorage from "../../../hook/useSessionStorage";
import Navbar from "../../componentes/BarraNav";
import ModalNovoUsuario from "./ModalNovoUsuario";
import ModalEdicaoUsuario from "./ModalEdicaoUsuario.tsx";

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
  const [sucesso, setSucesso] = useState(true);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isModalNovoUsuarioOpen, setIsModalNovoUsuarioOpen] = useState(false);
  const [isModalEdicaoOpen, setIsModalEdicaoOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);

  const [usuarioSession] = useSessionStorage<any>("usuario", {
    id: 0, nome: "", email: "", senha: "", telefone: "", tipo: "", imagem_perfil: ""
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
    carregarUsuarios();
  }, []);

  const deletarUsuario = async (id: number) => {
    try {
      const resp = await fetch(`http://localhost:3000/usuario/${id}`, { method: "DELETE" });
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
  

  return (
    <div className="p-6 bg-gradient-to-br from-purple-100 to-white min-h-screen">
      <Navbar isLogado={true} />
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-purple-700">Gerenciar Usuários</h2>
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
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nome</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Telefone</th>
                <th className="px-4 py-2">Tipo</th>
                <th className="px-4 py-2">Imagem</th>
                <th className="px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr key={user.id} className="bg-white shadow rounded-xl">
                  <td className="px-4 py-2 font-medium">{user.id}</td>
                  <td className="px-4 py-2">{user.nome}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.telefone}</td>
                  <td className="px-4 py-2 capitalize">{user.tipo}</td>
                  <td className="px-4 py-2">
                    {user.imagem_perfil && (
                      <img
                        src={`data:image/jpeg;base64,${user.imagem_perfil}`}
                        alt="Perfil"
                        className="w-10 h-10 rounded-full object-cover border-2 border-purple-300"
                      />
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="bg-yellow-400 text-white px-4 py-1 rounded-lg hover:bg-yellow-500"
                      onClick={() => handleOpenModalEditarUsuario(user)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
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
  <div className={`fixed bottom-6 right-6 ${sucesso ? "bg-green-100 border-2 border-green-600 text-green-700" : "bg-red-100 border-2 border-red-600 text-red-700"} px-6 py-3 rounded-xl shadow-2xl animate-fade-in text-center font-semibold`}>
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
    </div>
  );
};

export default Adm;
