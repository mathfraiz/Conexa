import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../componentes/BarraNav";
import Rodape from "../../componentes/Rodape";

const RecuperacaoSenha: React.FC = () => {
  const [contato, setContato] = useState("");
  const [metodo, setMetodo] = useState("email");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  const emailSugeridos = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];
  const sugestoesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Expressões regulares para validação
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

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

  useEffect(() => {
    const fecharSugestoes = (e: MouseEvent) => {
      if (!sugestoesRef.current?.contains(e.target as Node)) {
        setMostrarSugestoes(false);
      }
    };
    document.addEventListener("mousedown", fecharSugestoes);
    return () => document.removeEventListener("mousedown", fecharSugestoes);
  }, []);

  const handleMetodoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMetodo(e.target.value);
    setContato("");
    setErro("");
    setMostrarSugestoes(false);
  };

  const selecionarSugestao = (sugestao: string) => {
    const novoContato = contato.split("@")[0] + "@" + sugestao;
    setContato(novoContato);
    setErro(""); // Remove erro ao selecionar sugestão válida

    setTimeout(() => {
      setMostrarSugestoes(false);
      inputRef.current?.blur();
    }, 100);
  };

  const formatarTelefone = (valor: string) => {
    let numeros = valor.replace(/\D/g, "");
    if (numeros.length > 11) numeros = numeros.slice(0, 11);
    if (numeros.length >= 2) {
      numeros = `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    }
    return numeros.trim();
  };

  const validarEntrada = (valor: string) => {
    let valorFormatado = valor;

    if (metodo === "telefone") {
      valorFormatado = formatarTelefone(valor);
    }

    setContato(valorFormatado);

    setTimeout(() => {
      if (metodo === "email" && !emailRegex.test(valorFormatado)) {
        setErro("Digite um e-mail válido, ex: nome@dominio.com");
      } else if (metodo === "telefone" && !telefoneRegex.test(valorFormatado)) {
        setErro("Digite um número válido.");
      } else {
        setErro("");
      }
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (erro) return;
    setMensagem(`Se o ${metodo} estiver cadastrado, você receberá um código de verificação.`);
  };

  return (
    <main className="h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/logo2.jpg')" }}>
      <Navbar login={true} />
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md p-8 bg-purple-100 rounded-lg shadow-2xl border border-gray-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Recuperação de Senha</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Escolha um método</label>
              <select value={metodo} onChange={handleMetodoChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-purple-50 text-gray-900 rounded-lg shadow-md focus:ring-2 focus:ring-purple-500">
                <option value="email">Recuperar via E-mail</option>
                <option value="telefone">Recuperar via Telefone</option>
              </select>
            </div>

            <div className="mb-4 relative" ref={sugestoesRef}>
              <label className="block text-sm font-medium text-gray-700">{metodo === "email" ? "Digite seu e-mail" : "Digite seu telefone"}</label>
              <input
                ref={inputRef}
                type={metodo === "email" ? "email" : "tel"}
                placeholder={metodo === "email" ? "seuemail@exemplo.com" : "(XX) XXXXX-XXXX"}
                value={contato}
                onChange={(e) => validarEntrada(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-purple-50 text-gray-900 rounded-lg shadow-md focus:ring-2 focus:ring-purple-500"
                required
                autoComplete="new-password"
                autoCorrect="off"
                spellCheck={false}
              />
              {erro && <p className="text-red-600 text-sm mt-1">{erro}</p>}
              {mostrarSugestoes && sugestoes.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 rounded-md w-full mt-1 shadow-md z-10">
                  {sugestoes.map((sugestao) => (
                    <li key={sugestao} className="px-3 py-2 cursor-pointer hover:bg-purple-100" onClick={() => selecionarSugestao(sugestao)}>
                      {contato.split("@")[0]}@{sugestao}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button type="submit" className="w-full bg-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-purple-800 transition-all" disabled={!!erro}>
              Enviar Código de Verificação
            </button>

            {mensagem && <p className="mt-4 text-sm text-green-600">{mensagem}</p>}
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Lembrou sua senha? <Link to="/login" className="text-purple-600 hover:text-purple-500">Faça login</Link>
            </p>
          </div>
        </div>
      </div>
      <Rodape />
    </main>
  );
};

export default RecuperacaoSenha;
