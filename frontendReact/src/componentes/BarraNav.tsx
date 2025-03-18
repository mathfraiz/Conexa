import React from "react";
import { Link } from "react-router-dom";


interface navbarr {
  login?:boolean,
  cadastro?:boolean
}
const Navbar:React.FC<navbarr> = ({login,cadastro}) => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-purple-700 p-4 text-white flex justify-between items-center shadow-md z-50">
      {/* Logo */}
      <h1 className="text-2xl font-bold">
        <Link to="/">Eventos+</Link>
      </h1>

      {/* Links de navegação */}
      <div className="space-x-4">

        <Link to="/" className="hover:underline ">
          Eventos
        </Link> 
        <Link to="/login" className={`bg-amber-400 text-white px-4 py-2 rounded-lg hover:bg-gray-300 transition ${login?"hidden":""}`}>
          Login
        </Link>
        <Link
          to="/cadastro"
          className={`bg-amber-400 text-white px-4 py-2 rounded-lg hover:bg-gray-300 transition ${cadastro?"hidden":""}` }
        >
          Criar Conta
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
