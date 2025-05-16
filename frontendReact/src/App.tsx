import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./paginas/login/login";
import Cadastro from "./paginas/cadastro/cadastro";
import Home from "./paginas/index/index";
import RecuperacaoSenha from "./paginas/recuperação/recuperação";
import PaginaIncialLogin from "./paginas/PaginaInicialLogin/PaginaInicialLogin";
import CriarEvento from "./paginas/cadastroEvento/cadastroEvento";
import Index from "./paginas/index";
import AdmUsuario from "./paginas/Adm/admUsuario";
import Evento from "./paginas/Evento/Evento";
import AdmEvento from "./paginas/Adm/admEvento";
import UsuarioEventos from "./paginas/usuario/usuarioEventos/UsuarioEventos";

function App() {
  return (
    <div className="w-screen h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperação" element={<RecuperacaoSenha />} />
          <Route path="/cadastroEvento" element={<CriarEvento />} />
          <Route path="/PaginaInicialLogin" element={<PaginaIncialLogin />} />
          <Route path="/index" element={<Index />} /> 
          <Route path="/admusuarios" element={<AdmUsuario />} />
          <Route path="/eventos/:id" element={<Evento />} />
          <Route path="/admEventos" element={<AdmEvento />} />
          <Route path="/Eventos/Usuario" element={<UsuarioEventos />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
