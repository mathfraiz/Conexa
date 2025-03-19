import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../componentes/BarraNav";
import Rodape from "../../componentes/Rodape";

const RecuperacaoSenha: React.FC = () => {
  const [contato, setContato] = useState("");
  const [metodo, setMetodo] = useState("email");
  const [mensagem, setMensagem] = useState("");
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  const emailSugeridos = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];
  const sugestoesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Atualiza sugestões de e-mail enquanto o usuário digita
  useEffect(() => {
    if (metodo === "email" && contato.includes("@")) {
      const dominio = contato.split("@")[1] || "";
      const sugestoesFiltradas = emailSugeridos.filter((s) => s.startsWith(dominio));
      setSugestoes(sugestoesFiltradas);
      setMostrarSugestoes(sugestoesFiltradas.length > 0);
    } else {
      setMostrarSugestoes(false);
    }
  }, [metodo, contato]);

  // Fecha a lista de sugestões ao clicar fora
  useEffect(() => {
    const fecharSugestoes = (e: MouseEvent) => {
      if (!sugestoesRef.current?.contains(e.target as Node)) {
        setMostrarSugestoes(false);
      }
    };
    document.addEventListener("mousedown", fecharSugestoes);
    return () => document.removeEventListener("mousedown", fecharSugestoes);
  }, []);

  // Manipula a mudança entre recuperação por e-mail ou telefone
  const handleMetodoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMetodo(e.target.value);
    setContato(""); // Limpa o campo ao mudar o método
    setMostrarSugestoes(false); // Esconde sugestões ao trocar o método
  };

  // Seleciona sugestão de e-mail sem remover a lista antes da exibição correta
  const selecionarSugestao = (sugestao: string) => {
    const base = contato.includes("@") ? contato.split("@")[0] : contato;
    setContato(base + "@" + sugestao);

    // Aguarda a atualização do estado antes de remover a lista
    setTimeout(() => {
      setMostrarSugestoes(false);
      inputRef.current?.blur(); // Evitar sugestões do navegador
    }, 100);
  };

  // Manipula o envio da solicitação de recuperação de senha
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(`Se o ${metodo} estiver cadastrado, você receberá um código de verificação.`);
  };

  return (
    <main className="h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/logo2.jpg')" }}>
      <Navbar login={true} />

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md p-8 bg-gray-100 rounded-lg shadow-2xl border border-gray-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Recuperação de Senha</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Escolha um método</label>
              <select
                value={metodo}
                onChange={handleMetodoChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg shadow-md focus:ring-2 focus:ring-purple-500"
              >
                <option value="email">Recuperar via E-mail</option>
                <option value="telefone">Recuperar via Telefone</option>
              </select>
            </div>

            <div className="mb-4 relative" ref={sugestoesRef}>
              <label className="block text-sm font-medium text-gray-700">
                {metodo === "email" ? "Digite seu e-mail" : "Digite seu telefone"}
              </label>
              <input
                ref={inputRef}
                type={metodo === "email" ? "email" : "tel"}
                placeholder={metodo === "email" ? "seuemail@exemplo.com" : "(XX) XXXXX-XXXX"}
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg shadow-md focus:ring-2 focus:ring-purple-500"
                required
                autoComplete="new-password"
                autoCorrect="off"
                spellCheck={false}
              />
              {mostrarSugestoes && sugestoes.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 rounded-md w-full mt-1 shadow-md z-10">
                  {sugestoes.map((sugestao) => (
                    <li
                      key={sugestao}
                      className="px-3 py-2 cursor-pointer hover:bg-purple-100"
                      onClick={() => selecionarSugestao(sugestao)}
                    >
                      {contato.includes("@") ? contato.split("@")[0] : contato}@{sugestao}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button type="submit" className="w-full bg-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-purple-800 transition-all">
              Enviar Código de Verificação
            </button>

            {mensagem && <p className="mt-4 text-sm text-green-600">{mensagem}</p>}
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Lembrou sua senha?{" "}
              <Link to="/login" className="text-purple-600 hover:text-purple-500">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Rodape />
    </main>
  );
};

export default RecuperacaoSenha;
