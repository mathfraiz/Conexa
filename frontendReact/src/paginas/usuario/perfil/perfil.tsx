import React, { useState, useEffect, useRef } from "react";
import ModalEdicaoUsuario from "../../../componentes/ModalEdicaoUsuario";

const Perfil: React.FC<{ onClosePerfil: () => void }> = ({ onClosePerfil }) => {
  const [usuario, setUsuario] = useState<any | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const perfilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const usuarioString = sessionStorage.getItem("usuario");
    if (usuarioString) {
      setUsuario(JSON.parse(usuarioString));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        perfilRef.current &&
        !perfilRef.current.contains(event.target as Node) &&
        !mostrarModal
      ) {
        onClosePerfil();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClosePerfil, mostrarModal]);

  if (!usuario) {
    return null;
  }

  const handleEditarClick = () => {
    setMostrarModal(true);
  };

  const handleCloseModal = () => {
    setMostrarModal(false);
    onClosePerfil();
  };

  return (
    <div className="fixed top-20 right-6 z-50 w-80">
      <div
        ref={perfilRef}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-300"
      >
        <div className="flex flex-col items-center">
          <img
            src={usuario.imagem_perfil || "/placeholder.jpg"}
            alt="Perfil"
            className="w-24 h-24 rounded-full object-cover border-4 border-purple-600 shadow-md"
          />
          <h2 className="text-xl font-bold text-purple-800 mt-4">
            {usuario.nome}
          </h2>
          <p className="text-gray-600 text-sm">{usuario.email}</p>
          <p className="text-gray-600 text-sm">{usuario.telefone}</p>
          <span className="mt-2 px-3 py-1 text-sm font-medium text-purple-800 bg-purple-100 rounded-full">
            {usuario.tipo === "admin" ? "Administrador" : "Usuário"}
          </span>
        </div>

        <button
          onClick={handleEditarClick}
          className="mt-6 w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Editar Perfil
        </button>
      </div>

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
