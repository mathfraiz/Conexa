import React, { useEffect, useRef, useState } from "react";

interface ModalEdicaoUsuarioProps {
  isModalOpen: boolean;
  usuario: any;
  onClose: (foiSalvo: boolean, mensagem?: string) => void;
}

const ModalEdicaoUsuario: React.FC<ModalEdicaoUsuarioProps> = ({ isModalOpen, usuario, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
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
  const validarTelefone = (telefone: string) => /^\(\d{2}\) \d{4,5}-\d{4}$/.test(telefone);

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
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("email", email);
      formData.append("telefone", telefone);
      formData.append("tipo", tipo);
      if (imagemPerfil && typeof imagemPerfil !== "string") {
        formData.append("imagem_perfil", imagemPerfil);
      }

      await fetch(`http://localhost:3000/usuario/${usuario.id}`, {
        method: "PUT",
        body: formData,
      });

      // Aqui fecha o modal E manda a mensagem
      onClose(true, "Usuário atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar usuário", error);
      onClose(false);
    }
  };

  const inputClass = (campo: string) => 
    `w-full px-4 py-2 border ${erros[campo] ? "border-red-500" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-purple-500 text-black`;

  if (!isModalOpen) return null;

  return (
    <div className="fixed top-[5.5rem] right-6 z-50 w-[400px] animate-fade-in">
      <div ref={modalRef} className="bg-white border border-purple-300 rounded-2xl shadow-2xl p-6 space-y-4">
        <h2 className="text-2xl font-extrabold text-purple-700 text-center">Editar Usuário</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} className={inputClass("nome")} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass("email")} required />
          <input type="tel" placeholder="Telefone" value={telefone} onChange={handleTelefoneChange} className={inputClass("telefone")} />
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={inputClass("tipo")}>
            <option value="usuario">Usuário</option>
            <option value="admin">Admin</option>
          </select>
          <input type="file" accept="image/*" onChange={(e) => setImagemPerfil(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500" />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => onClose(false)} className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400">Cancelar</button>
            <button type="submit" className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg transition">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEdicaoUsuario;
