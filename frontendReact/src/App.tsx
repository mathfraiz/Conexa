import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./paginas/login/login";
import Cadastro from "./paginas/cadastro/cadastro";
import Home from "./paginas/index/index";
import RecuperacaoSenha from "./paginas/recuperação/recuperação";
import PaginaInicialLogin from "./paginas/PaginaInicialLogin/PaginaInicialLogin";
import CriarEvento from "./paginas/cadastroEvento/cadastroEvento";
// import Index from "./paginas/index";
import AdmUsuario from "./paginas/Adm/AdmUsuario";
import EventoPage from "./paginas/Evento/Evento";
import AdmEvento from "./paginas/Adm/AdmEvento";
import UsuarioEventos from "./paginas/usuario/usuarioEventos/UsuarioEventos";
import ConfiguracoesAdm from "./paginas/Adm/ConfiguracoesAdm";
import PaginaInicialAdmin from "./paginas/Adm/PaginaInicialAdm";
import Inscritos from "./paginas/inscritos/inscritos";

function App() {
  return (
    <div className="w-screen h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<PaginaInicialAdmin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperação" element={<RecuperacaoSenha />} />
          <Route path="/cadastroEvento" element={<CriarEvento />} />
          <Route path="/PaginaInicialLogin" element={<PaginaInicialLogin />} />
          <Route path="/admusuarios" element={<AdmUsuario />} />
          <Route path="/eventos/:id" element={<EventoPage />} />
          <Route path="/admEventos" element={<AdmEvento />} />
          <Route path="/Eventos/Usuario" element={<UsuarioEventos />} />
          <Route path="/configuracoes" element={<ConfiguracoesAdm />} />
          <Route path="*" element={<Home />} />
          <Route path="/Inscricoes" element={<Inscritos />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
