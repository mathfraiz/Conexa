import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useSessionStorage from "../../hook/useSessionStorage";
import Perfil from "../paginas/usuario/perfil/perfil";

const Navbar = () => {
  const [usuario] = useSessionStorage<any>("usuario", {});  
  const [isLogado, setIsLogado] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [modalPerfilOpen, setModalPerfilOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("bg-green-500");

  let lastScrollY = 0;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const usuarioSalvo = sessionStorage.getItem("usuario");
    setIsLogado(!!usuarioSalvo);
  }, []);

  const handleClosePerfil = (foiSalvo: boolean) => {
    setModalPerfilOpen(false);

    if (foiSalvo) {
      const usuarioAtualizado = sessionStorage.getItem("usuario");
      if (usuarioAtualizado) {
        const usuarioObj = JSON.parse(usuarioAtualizado);

        if (usuarioObj.analisePendente) {
          setToastMessage("Alterações enviadas para análise!");
          setToastColor("bg-yellow-500");
        } else {
          setToastMessage("Perfil atualizado com sucesso!");
          setToastColor("bg-green-500");
        }

        setTimeout(() => {
          setToastMessage("");
        }, 3000);
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
        <Link
          to={isLogado ? "/PaginaInicialLogin" : "/"}
          className="text-3xl font-extrabold tracking-wide flex items-center gap-2 transition-all"
        >
          <span className="bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
            CONEXA+
          </span>
        </Link>

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
              onClick={() => {
                setModalPerfilOpen(true);
              }}
              className="transition-transform duration-300 hover:scale-110"
            >
              <img
                src={usuario?.imagem_perfil || "/placeholder.jpg"}
                alt="Perfil"
                className="w-10 h-10 rounded-full object-cover"
              />
            </button>
          )}
        </div>

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
      </nav>

      {modalPerfilOpen && (
        <div className="fixed top-[4.5rem] right-6 z-50 animate-scale-in">
          <Perfil onClosePerfil={handleClosePerfil} />
        </div>
      )}

      {toastMessage && (
        <div className={`fixed top-[5rem] right-6 ${toastColor} text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in z-[9999]`}>
          {toastMessage}
        </div>
      )}

      <style>
        {`
          @keyframes scaleIn {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-scale-in {
            animation: scaleIn 0.3s ease-out forwards;
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Navbar;
