import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ModalEdicaoUsuario from "../../../componentes/ModalEdicaoUsuario";

const Perfil: React.FC<{ onClosePerfil: (foiSalvo: boolean) => void }> = ({ onClosePerfil }) => {
  const [usuario, setUsuario] = useState<any | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const perfilRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioString = sessionStorage.getItem("usuario");
    if (usuarioString) {
      setUsuario(JSON.parse(usuarioString));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        perfilRef.current &&
        !perfilRef.current.contains(event.target as Node) &&
        !mostrarModal
      ) {
        onClosePerfil(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClosePerfil, mostrarModal]);

  if (!usuario) return null;

  const handleEditarClick = () => {
    setMostrarModal(true);
  };

  const handleCloseModal = (foiSalvo: boolean = false) => {
    setMostrarModal(false);
    onClosePerfil(foiSalvo);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <div className="fixed top-[0rem] right-6 z-50 w-80 animate-fade-in">
      {!mostrarModal && (
        <div ref={perfilRef} className="bg-white rounded-xl shadow-lg p-6 border border-gray-300 space-y-4">
          <div className="flex flex-col items-center">
            <img
              src={usuario.imagem_perfil || "/placeholder.jpg"}
              alt="Perfil"
              className="w-24 h-24 rounded-full object-cover border-4 border-purple-600 shadow-md"
            />
            <h2 className="text-xl font-bold text-purple-800 mt-4">{usuario.nome}</h2>
            <p className="text-gray-600 text-sm">{usuario.email}</p>
            <p className="text-gray-600 text-sm">{usuario.telefone}</p>
            <span className="mt-2 px-3 py-1 text-sm font-medium text-purple-800 bg-purple-100 rounded-full">
              {usuario.tipo === "admin" ? "Administrador" : "Usuário"}
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleEditarClick}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Editar Perfil
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Deslogar
            </button>
          </div>
        </div>
      )}

      {mostrarModal && (
        <ModalEdicaoUsuario
          isModalOpen={mostrarModal}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Perfil;
