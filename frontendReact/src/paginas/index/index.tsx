import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../componentes/BarraNav"; // Importando a Navbar
import MotionContainer from "../../componentes/MotionConteiner"; // Importando MotionContainer

const Home = () => {
  return (
    <div className="w-screen h-screen bg-center bg-fixed bg-cover" style={{ backgroundImage: "url('/logo.jpg')" }}>

      {/* Navbar */}
      <Navbar />

      {/* Banner utilizando MotionContainer */}
      <MotionContainer 
        backgroundImage="/banner.jpg"
        height="h-[400px]"
        animation={{ opacity: 0, y: -50 }}
        transition={{ duration: 1 }}
        className="flex items-center justify-center"
      >
        <div className="bg-black bg-opacity-50 p-6 rounded-lg text-center text-white">
          <h2 className="text-3xl font-bold mb-2">Encontre e participe dos melhores eventos!</h2>
          <p className="text-lg">Cadastre-se e aproveite experiências incríveis.</p>
        </div>
      </MotionContainer>

      {/* Seção de Eventos em Destaque */}
      <div className=" bg-transparent" >
        <h3 className="text-2xl font-bold text-center text-gray-800">Eventos em Destaque</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          
          {/* Evento 1 */}
          <MotionContainer 
            height="h-auto" 
            animation={{ scale: 1 }} 
            transition={{ duration: 0.3 }}
            className="bg-white p-4 rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            <img src="/evento1.jpg" alt="Evento 1" className="w-full h-40 object-cover rounded-md" />
            <h4 className="text-lg font-bold mt-2">Workshop de Fotografia</h4>
            <p className="text-gray-600 text-sm">Data: 20 de Abril - 14h</p>
            <Link to="/eventos/1" className="text-purple-600 hover:underline mt-2 block">Saiba mais</Link>
          </MotionContainer>

          {/* Evento 2 */}
          <MotionContainer 
            height="h-auto" 
            animation={{ scale: 1 }} 
            transition={{ duration: 0.3 }}
            className="bg-white p-4 rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            <img src="/evento2.jpg" alt="Evento 2" className="w-full h-40 object-cover rounded-md" />
            <h4 className="text-lg font-bold mt-2">Festival de Música</h4>
            <p className="text-gray-600 text-sm">Data: 25 de Maio - 18h</p>
            <Link to="/eventos/2" className="text-purple-600 hover:underline mt-2 block">Saiba mais</Link>
          </MotionContainer>

          {/* Evento 3 */}
          <MotionContainer 
            height="h-auto" 
            animation={{ scale: 1 }} 
            transition={{ duration: 0.3 }}
            className="bg-white p-4 rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            <img src="/evento3.jpg" alt="Evento 3" className="w-full h-40 object-cover rounded-md" />
            <h4 className="text-lg font-bold mt-2">Hackathon de Programação</h4>
            <p className="text-gray-600 text-sm">Data: 10 de Junho - 9h</p>
            <Link to="/eventos/3" className="text-purple-600 hover:underline mt-2 block">Saiba mais</Link>
          </MotionContainer>

        </div>
      </div>

      {/* Rodapé */}
      <footer className="bg-gray-800 text-white text-center p-4  mb-10">
        <p>© 2025 Eventos+. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;
