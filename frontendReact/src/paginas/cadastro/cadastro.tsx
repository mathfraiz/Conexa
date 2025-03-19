import React, { useState, useRef, KeyboardEvent } from "react";
import Rodape from "../../componentes/Rodape";
import BarraNav from "../../componentes/BarraNav"

const Cadastro: React.FC = () => {
  // Form states
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);

  // Error states
  const [emailErro, setEmailErro] = useState("");
  const [senhaErro, setSenhaErro] = useState("");
  const [telefoneErro, setTelefoneErro] = useState("");

  // UI states
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarRequisitosSenha, setMostrarRequisitosSenha] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // References
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const emailSugeridos = [
    "gmail.com",
    "hotmail.com",
    "outlook.com",
    "yahoo.com",
  ];
  const [sugestoesEmail, setSugestoesEmail] = useState<string[]>([]);

  // Validation functions
  const validarEmail = (email: string) => {
    if (!email) return "Email é obrigatório";
    if (!email.includes("@")) return "Email deve conter @";
    if (!email.includes(".")) return "Email deve conter domínio válido";
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email) ? "" : "Formato de email inválido";
  };

  const validarSenha = (senha: string) => {
    const regexSenha = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regexSenha.test(senha);
  };

  const validarTelefone = (telefone: string) => {
    const regexTelefone = /^\(\d{2}\) \d{5}-\d{4}$/;
    return regexTelefone.test(telefone);
  };

  // Handler functions
  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value.replace(/\d/g, ""));
  };

  const formatarTelefone = (telefone: string) => {
    const numerosApenas = telefone.replace(/\D/g, "");
    if(numerosApenas.length == 0){
      return ""
    }
    if (numerosApenas.length <= 2) {
      return `(${numerosApenas}`;
    } else if (numerosApenas.length <= 7) {
      return `(${numerosApenas.slice(0, 2)}) ${numerosApenas.slice(2)}`;
    } else {
      return `(${numerosApenas.slice(0, 2)}) ${numerosApenas.slice(
        2,
        7
      )}-${numerosApenas.slice(7, 11)}`;
    }
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    const telefoneFormatado = formatarTelefone(value);
    setTelefone(telefoneFormatado);
    setTelefoneErro(
      value.length < 11
        ? "O telefone deve conter exatamente 11 dígitos."
        : validarTelefone(telefoneFormatado)
        ? ""
        : "Digite um número válido."
    );
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setEmail(value);
    setSelectedIndex(-1);

    const erro = validarEmail(value);
    setEmailErro(erro);

    if (value.includes("@")) {
      const partesEmail = value.split("@");
      const dominio = partesEmail[1] || "";

      if (dominio.length > 0) {
        const filtrados = emailSugeridos.filter((sugestao) =>
          sugestao.startsWith(dominio)
        );
        setSugestoesEmail(filtrados);
        setMostrarSugestoes(filtrados.length > 0);
      } else {
        setSugestoesEmail(emailSugeridos);
        setMostrarSugestoes(true);
      }
    } else {
      setMostrarSugestoes(false);
    }
  };

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSenha(value);
    setSenhaErro(
      validarSenha(value) ? "" : "A senha não atende aos requisitos."
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!mostrarSugestoes || sugestoesEmail.length === 0) return;

    switch (e.key) {
      case "Tab":
        e.preventDefault();
        setSelectedIndex((prev) => {
          const nextIndex = e.shiftKey ? prev - 1 : prev + 1;
          if (nextIndex >= sugestoesEmail.length) return 0;
          if (nextIndex < 0) return sugestoesEmail.length - 1;
          return nextIndex;
        });
        break;
      case "PageUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev <= 0 ? sugestoesEmail.length - 1 : prev - 1
        );
        break;
      case "PageDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev >= sugestoesEmail.length - 1 ? 0 : prev + 1
        );
        break;
      case "Enter":
        if (selectedIndex >= 0) {
          e.preventDefault();
          selecionarSugestao(sugestoesEmail[selectedIndex]);
        }
        break;
      case "Escape":
        setMostrarSugestoes(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagemPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoverImagem = () => {
    setImagemPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const selecionarSugestao = (sugestao: string) => {
    const partesEmail = email.split("@");
    const nomeUsuario = partesEmail[0] || "";
    const emailCompleto = `${nomeUsuario}@${sugestao}`;

    setEmail(emailCompleto);
    setEmailErro(validarEmail(emailCompleto));
    setMostrarSugestoes(false);
    setSelectedIndex(-1);
  };

  const sugerirEmail = () => {
    if (!email.includes("@") && email.trim()) {
      const emailCompleto = `${email.trim()}@gmail.com`;
      setEmail(emailCompleto);
      setEmailErro(validarEmail(emailCompleto));
    }
  };

  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarEmail(email)) {
      setEmailErro("Email inválido.");
      return;
    }

    if (!validarSenha(senha)) {
      setSenhaErro("A senha não atende aos requisitos.");
      return;
    }

    if (!validarTelefone(telefone)) {
      setTelefoneErro(
        "O telefone deve conter exatamente 11 dígitos numéricos."
      );
      return;
    }

    setMostrarModal(true);
    setTimeout(() => {
      window.location.href = "/login";
    }, 3000);
  };

  return (
    <div>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat "
        style={{ backgroundImage: "url('/logo2.jpg')" }}
      >
        <BarraNav cadastro={true}></BarraNav>
        <div className="w-full max-w-md p-8 bg-gray-100 rounded-lg shadow-xl border border-gray-300">
          <div className="w-full max-w">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Cadastro</h2>
            <form onSubmit={handleSubmit}>
              {/* Foto de Perfil */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Foto de Perfil
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagemChange}
                  ref={fileInputRef}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                       file:rounded-md file:border-0 file:text-purple-700 
                       file:bg-purple-100 hover:file:bg-purple-200 cursor-pointer"
                />
                {imagemPreview && (
                  <div className="mt-2 flex flex-col items-start">
                    <img
                      src={imagemPreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border border-gray-300 shadow"
                    />
                    <button
                      type="button"
                      onClick={handleRemoverImagem}
                      className="mt-2 text-sm text-red-500 hover:text-red-700"
                    >
                      Remover imagem
                    </button>
                  </div>
                )}
              </div>

              {/* Nome */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  placeholder="Digite seu nome"
                  value={nome}
                  onChange={handleNomeChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={handleEmailChange}
                  onKeyDown={handleKeyDown}
                  onBlur={sugerirEmail}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    emailErro ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-2 focus:ring-purple-500`}
                  required
                />
                {emailErro && (
                  <p className="text-sm text-red-500 mt-2">{emailErro}</p>
                )}
                {mostrarSugestoes && (
                  <ul className="absolute bg-white border border-gray-300 rounded-md w-full mt-1 shadow-md z-10">
                    {sugestoesEmail.map((sugestao, index) => (
                      <li
                        key={sugestao}
                        className={`px-3 py-2 cursor-pointer flex justify-between ${
                          index === selectedIndex
                            ? "bg-purple-100"
                            : "hover:bg-purple-50"
                        }`}
                        onClick={() => selecionarSugestao(sugestao)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        {email.split("@")[0]}@{sugestao}
                        <span className="text-gray-400">↗</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Telefone */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Número de Telefone
                </label>
                <input
                  type="tel"
                  placeholder="Digite seu telefone"
                  value={telefone}
                  onChange={handleTelefoneChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    telefoneErro ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-2 focus:ring-purple-500`}
                  required
                />
                {telefoneErro && (
                  <p className="text-sm text-red-500 mt-2">{telefoneErro}</p>
                )}
              </div>

              {/* Senha */}
              <div className="mb-6 relative">
                <label className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={handleSenhaChange}
                    onFocus={() => setMostrarRequisitosSenha(true)}
                    onBlur={() => setMostrarRequisitosSenha(false)}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      senhaErro ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-2 focus:ring-purple-500`}
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleMostrarSenha}
                    className="absolute inset-y-0 right-2 top-2 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {mostrarSenha ? "🔓" : "🔒"}
                  </button>
                </div>
                {senhaErro && (
                  <p className="text-sm text-red-500 mt-2">{senhaErro}</p>
                )}
                {mostrarRequisitosSenha && (
                  <div className="text-sm text-gray-600 mt-2">
                    <p>A senha deve ter:</p>
                    <ul className="list-disc list-inside">
                      <li>No mínimo 6 caracteres</li>
                      <li>Pelo menos 1 letra maiúscula</li>
                      <li>Pelo menos 1 número</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Botão de Salvar */}
              <button
              type="submit"
              className="w-full bg-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-purple-800 transition-all"
            >
              Salvar
            </button>

            </form>
          </div>
        </div>

        {/* Modal de Sucesso */}
        {mostrarModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-bold text-green-600 mb-4">
                Salvo com sucesso!
              </h3>
              <p className="text-gray-700">
                Você será redirecionado para a tela de login.
              </p>
            </div>
          </div>
        )}
      </div>
      <Rodape/>
    </div>
  );
};

export default Cadastro;
