// Navbar.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useSessionStorage from "../../hook/useSessionStorage";
import Perfil from "../paginas/usuario/perfil/perfil";
import { Menu } from "lucide-react"; // ou qualquer ícone
import { useAuth } from "../contexts/AuthContext";

const Navbar = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  // const [usuario, setUsuarioSessio] = useSessionStorage<any>("usuario", {
  //   id: 0,
  //   nome: "",
  //   email: "",
  //   senha: "",
  //   telefone: "",
  //   tipo: "",
  //   imagem_perfil: "",
  // });
  const { usuario, login, logout } = useAuth();

  const [isLogado, setIsLogado] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [modalPerfilOpen, setModalPerfilOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("bg-green-500");

  useEffect(() => {
    let lastScrollY = 0;
    const handleScroll = () => {
      setIsVisible(window.scrollY < lastScrollY);
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!usuario) {
      setIsLogado(false);
      return;
    }

    if (usuario?.id > 0) {
      setIsLogado(true);
    } else if (usuario?.id === 0) {
      setIsLogado(false);
    }
  }, []);

  const handleClosePerfil = (foiSalvo: boolean) => {
    setModalPerfilOpen(false);
    if (foiSalvo) {
      if (usuario) {
        setToastMessage("Perfil atualizado com sucesso!");
        setToastColor("bg-green-500");
        setTimeout(() => setToastMessage(""), 3000);
      }
    }
  };

  return (
    <div className="h-16">
      <nav
        className={`fixed top-0 left-0 w-full bg-purple-700 py-3 px-6 text-white flex justify-between items-center shadow-lg z-50 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (usuario?.tipo === "admin" || usuario?.tipo === "usuario") {
                onToggleSidebar();
              }
            }}
            className="p-2 rounded hover:bg-purple-600"
          >
            <Menu size={28} />
          </button>

          <Link
            to={
              isLogado && usuario?.tipo === "usuario"
                ? "/PaginaInicialLogin"
                : "/"
            }
            className="text-3xl font-extrabold tracking-wide flex items-center gap-2 transition-all"
          >
            <span className="bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
              CONEXA+
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {!isLogado ? (
            <>
              <Link
                to="/login"
                className="bg-amber-400 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-gray-300 transition-all"
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="border-2 border-amber-400 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-amber-400 transition-all"
              >
                Criar Conta
              </Link>
            </>
          ) : (
            <button
              onClick={() => setModalPerfilOpen(true)}
              className="transition-transform duration-300 hover:scale-110"
            >
              <img
                src={usuario?.imagem_perfil || "./imagem_Icon_User.png"}
                alt="Perfil"
                className="w-10 h-10 rounded-full object-cover"
              />
            </button>
          )}
        </div>
      </nav>

      {modalPerfilOpen && (
        <div className="fixed top-[4.5rem] right-6 z-50 animate-scale-in">
          <Perfil onClosePerfil={handleClosePerfil} />
        </div>
      )}

      {toastMessage && (
        <div
          className={`fixed top-[5rem] right-6 ${toastColor} text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in z-[9999]`}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Navbar;
