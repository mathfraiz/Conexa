import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../componentes/BarraNav"; // Importando a Navbar
import MotionContainer from "../../componentes/MotionConteiner"; // Importando MotionContainer
import Rodape from "../../componentes/Rodape";

const Home = () => {
  return (
    <div className="min-w-screen min-h-screen bg-fixed bg-cover flex flex-col" style={{ backgroundImage: "url('/logo.jpg')" }}>

      {/* Navbar */}
      <Navbar />

      {/* Seção de Eventos em Destaque */}
      <div className=" bg-transparent mb-10 ml-10 mr-10 flex-1"  >
        <h3 className="text-2xl font-bold text-center text-white inline-block bg-amber-400 rounded-xl p-3 mb-5
          ">Eventos em Destaque</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
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
      <Rodape>
      </Rodape>
    </div>
  );
};

export default Home;
