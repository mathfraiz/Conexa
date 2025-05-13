import React from "react";
import Navbar from "../../componentes/BarraNav";
import Rodape from "../../componentes/Rodape";
import MotionContainer from "../../componentes/MotionConteiner";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-purple-50">

      <Navbar/>

      <main className="flex-1 pt-28 px-6 md:px-16">
        {/* Título principal */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-purple-800 mb-4 drop-shadow-sm">
            Quem Somos
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Criamos conexões humanas por meio da tecnologia, da cultura e da colaboração em eventos únicos e transformadores.
          </p>
        </section>

        {/* Seção de Visão / Missão / Valores */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          <MotionContainer
            height="h-full"
            animation={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition"
          >
            <h3 className="text-xl font-semibold text-purple-700 mb-3">Nossa Visão</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Ser referência nacional em experiências conectadas, criando pontes entre ideias, pessoas e oportunidades através de eventos inovadores.
            </p>
          </MotionContainer>

          <MotionContainer
            height="h-full"
            animation={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition"
          >
            <h3 className="text-xl font-semibold text-purple-700 mb-3">Nossa Missão</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Empoderar indivíduos e organizações a criarem e participarem de eventos que gerem valor real, com praticidade, beleza e impacto.
            </p>
          </MotionContainer>

          <MotionContainer
            height="h-full"
            animation={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition"
          >
            <h3 className="text-xl font-semibold text-purple-700 mb-3">Nossos Valores</h3>
            <ul className="text-gray-700 text-sm leading-relaxed list-disc pl-4">
              <li>Inovação com propósito</li>
              <li>Respeito e diversidade</li>
              <li>Transparência e ética</li>
              <li>Foco em experiência</li>
            </ul>
          </MotionContainer>
        </section>

        {/* Frase de impacto */}
        <section className="bg-purple-100 rounded-2xl py-10 px-6 md:px-20 text-center shadow-inner">
          <p className="text-purple-800 text-xl font-semibold italic">
            "Juntos, transformamos eventos em conexões reais, com tecnologia, emoção e propósito."
          </p>
        </section>
      </main>

      <Rodape />
    </div>
  );
};

export default Index;
