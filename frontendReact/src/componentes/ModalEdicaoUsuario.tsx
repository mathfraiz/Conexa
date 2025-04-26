import React, { useState, useEffect, useRef } from "react";

interface ModalEdicaoUsuarioProps {
  isModalOpen: boolean;
  onClose: (foiSalvo: boolean) => void;
}

const formatarTelefone = (valor: string) => {
  const somenteNumeros = valor.replace(/\D/g, "").slice(0, 11);
  if (somenteNumeros.length <= 10) {
    return somenteNumeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else {
    return somenteNumeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
};

const ModalEdicaoUsuario: React.FC<ModalEdicaoUsuarioProps> = ({ isModalOpen, onClose }) => {
  const usuarioString = sessionStorage.getItem("usuario");
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;

  const [id, setId] = useState(usuario ? usuario.id : "");
  const [nome, setNome] = useState(usuario ? usuario.nome : "");
  const [email, setEmail] = useState(usuario ? usuario.email : "");
  const [telefone, setTelefone] = useState(usuario ? formatarTelefone(usuario.telefone) : "");
  const [imagemPerfil, setImagemPerfil] = useState<File | string | null>(usuario ? usuario.imagem_perfil : null);
  const [tipo] = useState(usuario ? usuario.tipo : "usuario");
  const [alterarSenha, setAlterarSenha] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState<{ [key: string]: boolean }>({});
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (usuario) {
      setId(usuario.id);
      setNome(usuario.nome);
      setEmail(usuario.email);
      setTelefone(formatarTelefone(usuario.telefone));
      setImagemPerfil(usuario.imagem_perfil);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isModalOpen) return null;

  const validarNome = (nome: string) => /^[A-Za-zÀ-ÿ\s]+$/.test(nome);
  const validarEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarTelefone = (telefone: string) => /^\(\d{2}\) \d{4,5}-\d{4}$/.test(telefone);
  const validarNovaSenha = (senha: string) => /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(senha);

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.replace(/\D/g, "").slice(0, 11);
    setTelefone(formatarTelefone(valor));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const novosErros: { [key: string]: boolean } = {
      nome: !validarNome(nome),
      email: !validarEmail(email),
      telefone: !validarTelefone(telefone),
      senhaAtual: alterarSenha && !senhaAtual,
      novaSenha: alterarSenha && !validarNovaSenha(novaSenha),
      confirmarSenha: alterarSenha && novaSenha !== confirmarSenha,
    };

    setErros(novosErros);
    if (Object.values(novosErros).some((erro) => erro)) return;

    try {
      setLoading(true);
      const form = new FormData();
      form.append("nome", nome);
      form.append("email", email);
      form.append("telefone", telefone);
      form.append("senha", alterarSenha ? novaSenha : senhaAtual);
      form.append("tipo", tipo);
      if (imagemPerfil && typeof imagemPerfil !== "string") {
        form.append("imagem_perfil", imagemPerfil);
      }

      const response = await fetch(`http://localhost:3000/usuario/${id}`, {
        method: "PUT",
        body: form,
      });

      if (response.ok) {
        sessionStorage.setItem("usuario", JSON.stringify({
          ...usuario,
          nome,
          email,
          telefone,
          imagem_perfil: typeof imagemPerfil === "string" ? imagemPerfil : "",
        }));
        onClose(true);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (campo: string) => `w-full px-4 py-2 border ${erros[campo] ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-purple-500 text-black`;

  const renderErro = (campo: string, mensagem: string) => (
    erros[campo] && <p className="text-sm text-red-500 mt-1">{mensagem}</p>
  );

  return (
    <div className="fixed top-[0rem] right-6 z-50 w-[400px] max-w-full px-2 animate-fade-in">
      <div
        ref={modalRef}
        className="bg-white border border-gray-300 rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto p-6"
      >
        <h3 className="text-2xl font-bold text-purple-700 mb-4 text-center">Editar Perfil</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" className={inputClass("nome")} required />
            {renderErro("nome", "Nome inválido. Apenas letras e espaços são permitidos.")}
          </div>

          <div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={inputClass("email")} required />
            {renderErro("email", "Email inválido.")}
          </div>

          <div>
            <input type="tel" value={telefone} onChange={handleTelefoneChange} placeholder="Telefone" className={inputClass("telefone")} />
            {renderErro("telefone", "Telefone inválido. Ex: (41) 99999-9999")}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-700 font-semibold">Deseja alterar a senha?</span>
            <button type="button" className="text-purple-600 hover:underline text-sm" onClick={() => setAlterarSenha((prev) => !prev)}>
              {alterarSenha ? "Cancelar" : "Alterar"}
            </button>
          </div>

          {alterarSenha && (
            <>
              <div>
                <input type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} placeholder="Senha Atual" className={inputClass("senhaAtual")} />
                {renderErro("senhaAtual", "Informe sua senha atual.")}
              </div>
              <div>
                <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} placeholder="Nova Senha" className={inputClass("novaSenha")} />
                {renderErro("novaSenha", "A nova senha deve ter no mínimo 6 caracteres, 1 letra maiúscula e 1 número.")}
              </div>
              <div>
                <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} placeholder="Confirmar Nova Senha" className={inputClass("confirmarSenha")} />
                {renderErro("confirmarSenha", "As senhas não coincidem.")}
              </div>
            </>
          )}

          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setImagemPerfil(file || null);
            }}
            className="w-full text-sm text-gray-500"
            accept="image/*"
          />
          {imagemPerfil && (
            <div className="flex flex-col items-center">
              <img
                src={typeof imagemPerfil === "string" ? imagemPerfil : URL.createObjectURL(imagemPerfil)}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-purple-500 shadow-md"
              />
              {typeof imagemPerfil !== "string" && (
                <button
                  type="button"
                  onClick={() => setImagemPerfil(null)}
                  className="text-orange-500 text-xs underline mt-2"
                >
                  Remover imagem
                </button>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2 sticky bottom-0 bg-white pb-2">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg transition flex items-center justify-center"
            >
              {loading ? "Enviando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEdicaoUsuario;
