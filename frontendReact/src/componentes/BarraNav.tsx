import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-purple-700 p-4 text-white flex justify-between items-center shadow-md z-50">
      {/* Logo */}
      <h1 className="text-2xl font-bold">
        <Link to="/">Eventos+</Link>
      </h1>

      {/* Links de navegação */}
      <div className="space-x-4">
        <Link to="/eventos" className="hover:underline">
          Eventos
        </Link>
        <Link to="/login" className="hover:underline">
          Login
        </Link>
        <Link
          to="/cadastro"
          className="bg-white text-purple-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          Criar Conta
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
