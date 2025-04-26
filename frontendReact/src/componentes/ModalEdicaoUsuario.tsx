import React, { useState, useEffect, useRef } from "react";

interface ModalEdicaoUsuarioProps {
  isModalOpen: boolean;
  onClose: () => void;
}

const ModalEdicaoUsuario: React.FC<ModalEdicaoUsuarioProps> = ({ isModalOpen, onClose }) => {
  const usuarioString = sessionStorage.getItem("usuario");
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;

  const [id, setId] = useState(usuario ? usuario.id : "");
  const [nome, setNome] = useState(usuario ? usuario.nome : "");
  const [email, setEmail] = useState(usuario ? usuario.email : "");
  const [senha, setSenha] = useState(usuario ? usuario.senha : "");
  const [telefone, setTelefone] = useState(usuario ? usuario.telefone : "");
  const [imagemPerfil, setImagemPerfil] = useState<File | string | null>(usuario ? usuario.imagem_perfil : null);
  const [tipo, setTipo] = useState(usuario ? usuario.tipo : "usuario");
  const [loading, setLoading] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (usuario) {
      setId(usuario.id);
      setNome(usuario.nome);
      setEmail(usuario.email);
      setSenha(usuario.senha);
      setTelefone(usuario.telefone);
      setImagemPerfil(usuario.imagem_perfil);
      setTipo(usuario.tipo);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("form")
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const form = new FormData();
      form.append("nome", nome);
      form.append("email", email);
      form.append("telefone", telefone);
      form.append("senha", senha);
      form.append("tipo", tipo);
      if (imagemPerfil && typeof imagemPerfil !== "string") {
        form.append("imagem_perfil", imagemPerfil);
      }

      const response = await fetch(`http://localhost:3000/usuario/${id}`, {
        method: "PUT",
        body: form,
      });

      if (response.ok) {
        const novoUsuario = {
          ...usuario,
          nome,
          email,
          senha,
          telefone,
          tipo,
          imagem_perfil: typeof imagemPerfil === "string" ? imagemPerfil : "",
        };
        sessionStorage.setItem("usuario", JSON.stringify(novoUsuario));
        onClose();
      } else {
        alert("Erro ao atualizar usuário");
      }
    } catch {
      alert("Erro na comunicação com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-24 right-6 z-50 w-[400px]">
      <div ref={modalRef} className="bg-white border border-gray-300 rounded-2xl shadow-2xl p-6">
        <h3 className="text-2xl font-bold text-purple-700 mb-4 text-center">Editar Perfil</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-black"
            required
          />
          <input
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="Telefone"
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="usuario">Usuário</option>
          </select>
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
                src={
                  typeof imagemPerfil === "string"
                    ? imagemPerfil
                    : URL.createObjectURL(imagemPerfil)
                }
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
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg transition flex items-center justify-center"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEdicaoUsuario;
