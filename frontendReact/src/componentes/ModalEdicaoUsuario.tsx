import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  tipo: string;
  imagem_perfil: string | null;
}

interface ModalEdicaoUsuarioProps {
  isModalOpen: boolean;
  onClose: (foiSalvo: boolean) => void;
  user?: Usuario | null;
}

const formatarTelefone = (valor: string) => {
  const somenteNumeros = valor.replace(/\D/g, "").slice(0, 11);
  if (somenteNumeros.length <= 10) {
    return somenteNumeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else {
    return somenteNumeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
};

const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
};

const ModalEdicaoUsuario: React.FC<ModalEdicaoUsuarioProps> = ({
  isModalOpen,
  onClose,
  user,
}) => {
  const { usuario: usuarioAuth, token, login } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  let usuario;
  if (user) {
    usuario = user;
  } else {
    usuario = usuarioAuth;
  }

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [imagemPerfil, setImagemPerfil] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [alterarSenha, setAlterarSenha] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState<{ [key: string]: boolean }>({});
  const [erroSenha, setErroSenha] = useState("");

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome);
      setEmail(usuario.email);
      setTelefone(formatarTelefone(usuario.telefone || ""));

      if (usuario.imagem_perfil?.startsWith("data:image")) {
        setPreview(usuario.imagem_perfil); // usado para exibir
        const file = base64ToFile(usuario.imagem_perfil, "perfil.jpg");
        setImagemPerfil(file); // usado no formData
      } else {
        setImagemPerfil(null);
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, usuario]);

  useEffect(() => {
    if (imagemPerfil instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(imagemPerfil);
    } else {
      setPreview(null);
    }
  }, [imagemPerfil]);
  console.log(imagemPerfil);
  if (!isModalOpen || !usuario) return null;

  const validarNome = (nome: string) => /^[A-Za-zÀ-ÿ\s]+$/.test(nome);
  const validarEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarTelefone = (telefone: string) =>
    /^\(\d{2}\) \d{4,5}-\d{4}$/.test(telefone);
  const validarNovaSenha = (senha: string) =>
    /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(senha);

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

    if (Object.values(novosErros).some((erro) => erro)) {
      setErros(novosErros);
      setTimeout(() => {
        setErros({});
      }, 3000);
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append("nome", nome);
      form.append("email", email);
      form.append("telefone", telefone);
      if (alterarSenha) {
        form.append("senha", senhaAtual);
        form.append("senhaNova", novaSenha);
      }

      form.append("tipo", usuario.tipo);

      if (imagemPerfil instanceof File) {
        form.append("imagem_perfil", imagemPerfil);
      }

      const response = await fetch(
        `http://localhost:3000/usuario/${usuario.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      if (response.ok) {
        const resp = await response.json();
        console.log("nome");
        console.log(resp.nome);
        const dadosAtualizados = {
          ...usuario,
          nome: resp.nome,
          email: resp.email,
          telefone: resp.telefone,
          imagem_perfil: resp.imagem_perfil,
        };
        console.log(resp);

        if (!user) login(dadosAtualizados, token!);
        onClose(true);
      } else if (response.status == 401) {
        setErroSenha("senha incorreta");
        setTimeout(() => {
          setErroSenha("");
        }, 2000);
      }
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (campo: string) =>
    `w-full px-4 py-2 border ${
      erros[campo] ? "border-red-500" : "border-gray-300"
    } rounded-lg focus:ring-2 focus:ring-purple-500 text-black`;

  const renderErro = (campo: string, mensagem: string) =>
    erros[campo] && <p className="text-sm !text-red-500 mt-1">{mensagem}</p>;

  return (
    <div className="fixed top-[0rem] right-6 z-50 w-[400px] max-w-full px-2 animate-fade-in">
      <div
        ref={modalRef}
        className="bg-white border border-gray-300 rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto p-6"
      >
        <h3 className="text-2xl font-bold text-purple-700 mb-4 text-center">
          Editar Perfil
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            className={inputClass("nome")}
            required
          />
          {renderErro("nome", "Nome inválido. Apenas letras e espaços.")}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={inputClass("email")}
            required
          />
          {renderErro("email", "Email inválido.")}

          <input
            type="tel"
            value={telefone}
            onChange={handleTelefoneChange}
            placeholder="Telefone"
            className={inputClass("telefone")}
          />
          {renderErro("telefone", "Telefone inválido. Ex: (41) 99999-9999")}

          {(!user || user.id == usuarioAuth?.id) && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-700 font-semibold">
                Deseja alterar a senha?
              </span>
              <button
                type="button"
                className="text-white hover:underline hover:text-amber-500 text-sm"
                onClick={() => setAlterarSenha((prev) => !prev)}
              >
                {alterarSenha ? "Cancelar" : "Alterar"}
              </button>
            </div>
          )}

          {alterarSenha && (
            <>
              <input
                type="password"
                value={senhaAtual}
                onChange={(e) => {
                  setSenhaAtual(e.target.value);
                  console.log(e.target.value);
                }}
                placeholder="Senha Atual"
                className={inputClass("senhaAtual")}
              />
              {renderErro("senhaAtual", "Informe sua senha atual.")}

              <input
                type="password"
                value={novaSenha}
                onChange={(e) => {
                  console.log(e.target.value);
                  setNovaSenha(e.target.value);
                }}
                placeholder="Nova Senha"
                className={inputClass("novaSenha")}
              />
              {renderErro(
                "novaSenha",
                "A nova senha deve ter 6+ caracteres, 1 letra maiúscula e 1 número."
              )}

              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => {
                  console.log(e.target.value);
                  setConfirmarSenha(e.target.value);
                }}
                placeholder="Confirmar Nova Senha"
                className={inputClass("confirmarSenha")}
              />
              {renderErro("confirmarSenha", "As senhas não coincidem.")}
            </>
          )}
          {erroSenha ? (
            <p className="text-sm !text-red-500 mt-1">{erroSenha}</p>
          ) : (
            ""
          )}

          <div className="flex items-center gap-2">
            {preview && (
              <img
                src={preview}
                alt="Prévia"
                className="w-24 h-24 object-cover rounded-xl border-2 border-purple-400 shadow-md"
              />
            )}

            <label className="cursor-pointer bg-purple-100 text-purple-700 px-4 py-2 rounded-xl border border-purple-300 hover:bg-purple-200 transition">
              Selecionar imagem
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImagemPerfil(file);
                  } else {
                    setImagemPerfil(null);
                  }
                }}
              />
            </label>
          </div>

          {imagemPerfil && (
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => setImagemPerfil(null)}
                className="text-orange-500 text-xs underline mt-2"
              >
                Remover imagem
              </button>
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
