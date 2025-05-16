import React from "react";
import MotionContainer from "../../componentes/MotionConteiner";
import { Link } from "react-router-dom";
import Navbar from "../../componentes/BarraNav";

const Inscritos = () => {
  const eventosInscritos = [
    {
      id: 1,
      titulo: "Workshop de Fotografia",
      data: "20 de Abril - 14h",
      imagem: "/evento1.jpg",
    },
    {
      id: 2,
      titulo: "Festival de Música",
      data: "25 de Maio - 18h",
      imagem: "/evento2.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-purple-50 to-purple-100 text-gray-800">
      <Navbar onToggleSidebar={() => {}} />

      <div className="flex flex-col md:flex-row pt-24 px-6 max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="md:w-64 bg-white border border-purple-200 p-6 rounded-2xl shadow-md mb-8 md:mb-0 md:mr-10">
          <h2 className="text-2xl font-bold text-purple-800 mb-6 border-b pb-2 border-purple-100">
            Painel
          </h2>
          <nav className="flex flex-col gap-4">
            <Link
              to="/MeusEventos"
              className="hover:bg-purple-50 text-purple-700 font-medium py-2 px-4 rounded-lg transition border border-purple-100"
            >
              Meus Eventos
            </Link>
            <Link
              to="/inscritos"
              className="bg-purple-200 text-purple-900 font-semibold py-2 px-4 rounded-lg shadow-inner transition"
            >
              Inscritos
            </Link>
            <Link
              to="/configuracoes"
              className="hover:bg-purple-50 text-purple-700 font-medium py-2 px-4 rounded-lg transition border border-purple-100"
            >
              Configurações
            </Link>
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-purple-800 mb-2">
              Eventos Inscritos
            </h1>
            <p className="text-gray-500 text-lg">
              Confira abaixo os eventos que você escolheu participar:
            </p>
          </header>

          {eventosInscritos.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow text-center text-gray-500 text-lg">
              Você ainda não se inscreveu em nenhum evento.
            </div>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventosInscritos.map((evento) => (
                <MotionContainer
                  key={evento.id}
                  height="h-64"
                  animation={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-transform bg-white"
                >
                  <img
                    src={evento.imagem}
                    alt={evento.titulo}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition duration-300"
                  />
                  <div className="relative bg-black/60 backdrop-blur-sm p-5 rounded-b-2xl text-white z-10">
                    <h4 className="text-xl font-bold mb-1">{evento.titulo}</h4>
                    <p className="text-sm mb-2">{evento.data}</p>
                    <Link
                      to={`/eventos/${evento.id}`}
                      className="text-purple-300 font-medium hover:underline"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </MotionContainer>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Inscritos;
