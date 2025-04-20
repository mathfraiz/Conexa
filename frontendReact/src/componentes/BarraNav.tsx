import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  isLogado: boolean;
}
const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");
console.log(usuario)

const Navbar: React.FC<NavbarProps> = ({ isLogado }) => {
  const [isVisible, setIsVisible] = useState(true);
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


  return (
    <div className="h-16">
      <nav
        className={`fixed top-0 left-0 w-full bg-purple-700 py-3 px-6 text-white flex justify-between items-center shadow-lg z-50 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Logo com animação */}
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-wide flex items-center gap-2 transition-all"
        >
          <span className="bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
            CONEXA+
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {!isLogado ? (
            <>
              {/* Ações (Entrar/Criar Conta) */}
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
            <img
              src={usuario.imagem_perfil ? usuario.imagem_perfil : ""}
              alt="perfil"
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
        </div>

        {/* Estilo para animação */}
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
    </div>
  );
};

export default Navbar;
