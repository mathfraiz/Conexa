import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface ModalEdicaoUsuarioProps {
  isModalOpen: boolean;
  onClose: (foiSalvo: boolean, mensagem?: string) => void;
}

const ModalEdicaoUsuario: React.FC<ModalEdicaoUsuarioProps> = ({
  isModalOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { usuario, login } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState(""); // 🔒 Novo estado da senha
  const [tipo, setTipo] = useState("usuario");
  const [imagemPerfil, setImagemPerfil] = useState<File | string | null>(null);
  const [erros, setErros] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome || "");
      setEmail(usuario.email || "");
      setTelefone(usuario.telefone || "");
      setTipo(usuario.tipo || "usuario");
      setImagemPerfil(usuario.imagem_perfil || null);
    }
  }, [usuario]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose(false);
      }
    };
    if (isModalOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen, onClose]);

  const validarNome = (nome: string) => /^[A-Za-zÀ-ÿ\s]+$/.test(nome);
  const validarTelefone = (telefone: string) =>
    /^\(\d{2}\) \d{4,5}-\d{4}$/.test(telefone);

  const formatarTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);
    if (numeros.length <= 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    }
    return numeros.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatado = formatarTelefone(e.target.value);
    setTelefone(formatado);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const novosErros = {
      nome: !validarNome(nome),
      telefone: !validarTelefone(telefone),
    };
    setErros(novosErros);
    if (Object.values(novosErros).some(Boolean)) return;

    try {
      const token = sessionStorage.getItem("token");
      const formData = new FormData();

      formData.append("nome", nome);
      formData.append("email", email);
      formData.append("telefone", telefone);
      formData.append("tipo", tipo);

      if (senha.trim() !== "") {
        formData.append("senha", senha);
      }

      if (imagemPerfil instanceof File) {
        formData.append("imagem_perfil", imagemPerfil);
      }

      const resp = await fetch(`http://localhost:3000/usuario/${usuario?.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (resp.ok) {
        const novoUsuario = {
          ...usuario!,
          nome,
          email,
          telefone,
          tipo,
          imagem_perfil:
            imagemPerfil instanceof File
              ? URL.createObjectURL(imagemPerfil)
              : usuario?.imagem_perfil,
        };
        login(novoUsuario, token!);
        onClose(true, "Usuário atualizado com sucesso!");
      } else {
        throw new Error("Falha na atualização");
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário", error);
      onClose(false, "Erro ao atualizar usuário");
    }
  };

  const inputClass = (campo: string) =>
    `w-full px-4 py-2 border ${
      erros[campo] ? "border-red-500" : "border-gray-300"
    } rounded-xl focus:ring-2 focus:ring-purple-500 text-black`;

  if (!isModalOpen || !usuario) return null;

  return (
    <div className="fixed top-[5.5rem] right-6 z-50 w-[400px] animate-fade-in">
      <div
        ref={modalRef}
        className="bg-white border border-purple-300 rounded-2xl shadow-2xl p-6 space-y-4"
      >
        <h2 className="text-2xl font-extrabold text-purple-700 text-center">
          Editar Usuário
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={inputClass("nome")}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass("email")}
            required
          />
          <input
            type="tel"
            placeholder="Telefone"
            value={telefone}
            onChange={handleTelefoneChange}
            className={inputClass("telefone")}
          />
          <input
            type="password"
            placeholder="Nova senha (deixe em branco se não for mudar)"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={inputClass("senha")}
          />
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className={inputClass("tipo")}
          >
            <option value="usuario">Usuário</option>
            <option value="admin">Admin</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagemPerfil(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-500"
          />
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg transition"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEdicaoUsuario;
