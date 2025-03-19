import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../componentes/BarraNav";
import MotionContainer from "../../componentes/MotionConteiner";
import Rodape from "../../componentes/Rodape";

const Home = () => {
  return (
    <div className="min-w-screen min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('/logo.jpg')" }}>
      
      <Navbar />

      {/* Seção de Eventos em Destaque */}
      <div className="flex flex-col items-center flex-1 p-8 mt-16">

      <h3 className="text-2xl font-bold text-gray-800 bg-gray-200 px-6 py-3 rounded-xl shadow-lg mb-6 border border-gray-300">
  Eventos em Destaque
</h3>

        {/* Primeira linha de eventos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">

          {/* Criar Evento */}
          <MotionContainer 
            height="h-64"
            animation={{ scale: 1 }} 
            transition={{ duration: 0.3 }}
            className="relative bg-white/30 backdrop-blur-lg flex flex-col justify-center items-center rounded-lg shadow-lg hover:scale-105 transition-transform overflow-hidden"
          >
            <h4 className="text-lg font-bold text-gray-800 z-10">Criar Novo Evento</h4>
            <p className="text-gray-600 text-sm text-center z-10">Clique aqui para criar um evento</p>
            <Link to="/criar-evento" className="bg-purple-700 text-white font-bold py-2 px-4 mt-4 rounded-lg shadow-md hover:bg-purple-800 transition-all z-10">
              Criar Evento
            </Link>
          </MotionContainer>

          {/* Evento 1 */}
          <MotionContainer 
            height="h-64"
            animation={{ scale: 1 }} 
            transition={{ duration: 0.3 }}
            className="relative bg-gray-100 rounded-lg shadow-md hover:scale-105 transition-transform overflow-hidden flex items-end p-4"
          >
            <img src="/evento1.jpg" alt="Evento 1" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative bg-black/50 p-4 rounded-lg w-full text-white">
              <h4 className="text-lg font-bold">Workshop de Fotografia</h4>
              <p className="text-sm">Data: 20 de Abril - 14h</p>
              <Link to="/eventos/1" className="text-purple-700 hover:underline">Saiba mais</Link>
            </div>
          </MotionContainer>

          {/* Evento 2 */}
          <MotionContainer 
            height="h-64"
            animation={{ scale: 1 }} 
            transition={{ duration: 0.3 }}
            className="relative bg-gray-100 rounded-lg shadow-md hover:scale-105 transition-transform overflow-hidden flex items-end p-4"
          >
            <img src="/evento2.jpg" alt="Evento 2" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative bg-black/50 p-4 rounded-lg w-full text-white">
              <h4 className="text-lg font-bold">Festival de Música</h4>
              <p className="text-sm">Data: 25 de Maio - 18h</p>
              <Link to="/eventos/2" className="text-purple-700 hover:underline">Saiba mais</Link>
            </div>
          </MotionContainer>

        </div>

        {/* Segunda linha de eventos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-6">

          {/* Evento 3 */}
          <MotionContainer 
            height="h-64"
            animation={{ scale: 1 }} 
            transition={{ duration: 0.3 }}
            className="relative bg-gray-100 rounded-lg shadow-md hover:scale-105 transition-transform overflow-hidden flex items-end p-4"
          >
            <img src="/evento3.jpg" alt="Evento 3" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative bg-black/50 p-4 rounded-lg w-full text-white">
              <h4 className="text-lg font-bold">Palestra sobre Inteligência Artificial</h4>
              <p className="text-sm">Data: 15 de Agosto - 10h</p>
              <Link to="/eventos/5" className="text-purple-700 hover:underline">Saiba mais</Link>
            </div>
          </MotionContainer>

          {/* Evento 4 */}
          <MotionContainer 
            height="h-64"
            animation={{ scale: 1 }} 
            transition={{ duration: 0.3 }}
            className="relative bg-gray-100 rounded-lg shadow-md hover:scale-105 transition-transform overflow-hidden flex items-end p-4"
          >
            <img src="/evento4.jpg" alt="Evento 4" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative bg-black/50 p-4 rounded-lg w-full text-white">
              <h4 className="text-lg font-bold">Exposição de Arte Moderna</h4>
              <p className="text-sm">Data: 5 de Julho - 16h</p>
              <Link to="/eventos/4" className="text-purple-700 hover:underline">Saiba mais</Link>
            </div>
          </MotionContainer>

          {/* Evento 5 */}
          <MotionContainer 
            height="h-64"
            animation={{ scale: 1 }} 
            transition={{ duration: 0.3 }}
            className="relative bg-gray-100 rounded-lg shadow-md hover:scale-105 transition-transform overflow-hidden flex items-end p-4"
          >
            <img src="/evento5.jpg" alt="Evento 5" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative bg-black/50 p-4 rounded-lg w-full text-white">
              <h4 className="text-lg font-bold">Hackathon de Programação</h4>
              <p className="text-sm">Data: 10 de Junho - 9h</p>
              <Link to="/eventos/3" className="text-purple-700 hover:underline">Saiba mais</Link>
            </div>
          </MotionContainer>

        </div>

      </div>

      {/* Rodapé */}
      <Rodape />
    </div>
  );
};

export default Home;
