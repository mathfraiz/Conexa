import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  login?: boolean;
  cadastro?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ login, cadastro }) => {
  const [isVisible, setIsVisible] = useState(true);
  let lastScrollY = 0;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false); // Esconder a barra ao rolar para baixo
      } else {
        setIsVisible(true); // Mostrar a barra ao rolar para cima
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full bg-purple-700 py-3 px-6 text-white flex justify-between items-center shadow-lg z-50 rounded-b-lg transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
      
      {/* Logo */}
      <Link to="/" className="text-white text-3xl font-extrabold tracking-wide flex items-center gap-2 hover:text-amber-400 transition-all">
        <span className="text-amber-400">Eventos</span>+
      </Link>

      {/* Botões de Ação */}
      <div className="hidden md:flex items-center gap-4">
        <Link to="/login" className={`bg-amber-400 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-gray-300 transition-all ${login ? "hidden" : ""}`}>
          Entrar
        </Link>
        <Link to="/cadastro" className={`border-2 border-amber-400 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-amber-400 transition-all ${cadastro ? "hidden" : ""}`}>
          Criar Conta
        </Link>
      </div>

      {/* Menu Responsivo */}
      <div className="md:hidden text-white cursor-pointer text-2xl p-2 rounded-md hover:bg-purple-800 transition-all">
        ☰ {/* Ícone de menu alternativo */}
      </div>
      
    </nav>
  );
};

export default Navbar;
