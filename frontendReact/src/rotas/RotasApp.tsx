// RotasApp.tsx
import "../App.css";
import { Routes, Route } from "react-router-dom";
import Login from "../paginas/login/login";
import Cadastro from "../paginas/cadastro/cadastro";
import Home from "../paginas/index/index";
import RecuperacaoSenha from "../paginas/recuperação/recuperação";
import PaginaInicialLogin from "../paginas/PaginaInicialLogin/PaginaInicialLogin";
import CriarEvento from "../paginas/cadastroEvento/cadastroEvento";
import AdmUsuario from "../paginas/Adm/AdmUsuario";
import EventoPage from "../paginas/Evento/Evento";
import AdmEvento from "../paginas/Adm/AdmEvento";
import UsuarioEventos from "../paginas/usuario/usuarioEventos/UsuarioEventos";
import ConfiguracoesAdm from "../paginas/Adm/ConfiguracoesAdm";
import PaginaInicialAdmin from "../paginas/Adm/PaginaInicialAdm";
import Inscritos from "../paginas/inscritos/inscritos";
import { useLogoutAuto } from "../contexts/useLogoutAuto";
import { useAuth } from "../contexts/AuthContext";

export default function RotasApp() {
  useLogoutAuto();
  const { usuario } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/recuperação" element={<RecuperacaoSenha />} />

      {usuario?.tipo === "admin" && (
        <>
          <Route path="/admin" element={<PaginaInicialAdmin />} />
          <Route path="/admusuarios" element={<AdmUsuario />} />
          <Route path="/admEventos" element={<AdmEvento />} />
          <Route path="/configuracoes" element={<ConfiguracoesAdm />} />
        </> 
      )}
      {usuario?.tipo === "usuario" && (
        <>
          <Route path="/paginainiciallogin" element={<PaginaInicialLogin />} />
          <Route path="/cadastroEvento" element={<CriarEvento />} />
          <Route path="/eventos/:id" element={<EventoPage />} />
          <Route path="/Eventos/Usuario" element={<UsuarioEventos />} />
          <Route path="/Inscricoes" element={<Inscritos />} />
        </>
      )}

      <Route path="*" element={<Home />} />
    </Routes>
  );
}
