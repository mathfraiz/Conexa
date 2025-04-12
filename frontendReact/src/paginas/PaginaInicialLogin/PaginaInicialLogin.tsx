import React from "react";
import MotionContainer from "../../componentes/MotionConteiner";
import {Link} from "react-router-dom";
import Navbar from "../../componentes/BarraNav";

const PaginaInicialLogin = () => {

    interface Usuario {
        id: number;
        nome: string;
        email: string;
        senha: string;
    }

  return (
    <div className=" bg-[url(./logo.jpg)] flex flex-colum min-h-screen text-white bg-cover bg-center bg-no-repeat">
      <Navbar isLogado={true}/>
      {/* Sidebar */}
      <aside className="w-50 p-4 bg-purple-600 flex flex-col gap-4 mt-15">
  <Link to="/MeusEventos" className="bg-purple-300 font-semibold px-3 py-2 rounded shadow hover:bg-purple-200 transition text-black font-bold">
    Meus Eventos
  </Link>
  <Link to="/Inscritos" className="bg-purple-300 font-semibold px-3 py-2 rounded shadow hover:bg-purple-200 transition text-black font-bold">
    Inscritos
  </Link>
  <Link to="/cadastroEvento" className="bg-purple-300 font-semibold px-3 py-2 rounded shadow hover:bg-purple-200 transition text-black font-bold">
    Criar Evento
  </Link>
  <Link to="/configuracoes" className="bg-purple-300 font-semibold px-3 py-2 rounded shadow hover:bg-purple-200 transition text-black font-bold">
    Configurações
  </Link>
</aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 relative">
        
        {/* Botão circular no canto superior direito */}
        <div className="absolute top-4 right-6 w-10 h-10 bg-gray-200 rounded-full shadow-md">
            <img src="" alt="Sair" className="w-full h-full object-cover rounded-full" />
        </div>

        {/* Faixa branca (provavelmente barra de busca ou título) */}
        <div className="w-full h-6 bg-white rounded-lg mb-8"></div>

        {/* Grade de eventos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
 
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

        </div>
      </main>
      
    </div>
  );
};

export default PaginaInicialLogin;
