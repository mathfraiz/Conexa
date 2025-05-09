import React, { useState, useRef, KeyboardEvent } from "react";
import Rodape from "../../componentes/Rodape";
import Navbar from "../../componentes/BarraNav";

const Cadastro: React.FC = () => {
  const [modalMensagem, setModalMensagem] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);

  // Form states
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [imagemPreview, setImagemPreview] = useState<File | null>(null);
  // const [cep, setCep] = useState("");
  // const [endereco, setEndereco] = useState("");
  // const [bairro, setBairro] = useState("");
  // const [cidade, setCidade] = useState("");
  // const [uf, setUf] = useState("");

  // Error states
  const [emailErro, setEmailErro] = useState("");
  const [senhaErro, setSenhaErro] = useState("");
  const [telefoneErro, setTelefoneErro] = useState("");

  // UI states
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

  // const buscarCep = async () => {
  //   if (cep.length === 8) {
  //     try {
  //       const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  //       const data = await response.json();
  //       if (!data.erro) {
  //         setEndereco(data.logradouro || "");
  //         setBairro(data.bairro || "");
  //         setCidade(data.localidade || "");
  //         setUf(data.uf || "");

  //       }
  //     } catch (error) {
  //       console.error("Erro ao buscar o CEP:", error);
  //     }
  //   }
  // };

  const cadastrar = async (form: FormData) => {
    console.log(form.get("nome"));
    console.log(form.get("email"));
    console.log(form.get("telefone"));
    try {
      const response = await fetch("http://localhost:3000/usuario", {
        method: "POST",
        body: form,
      });
      const resp = response.json().then((data) => {
        if (response.ok) {
          console.log("Cadastro bem-sucedido:", data);
          setModalMensagem("Cadastro realizado com sucesso!");
          setMostrarModal(true);
          setTimeout(() => {
            setMostrarModal(false);
            window.location.href = "/login";
          }, 2000);
        } else {
          console.error("Erro no cadastro:", data);
          setModalMensagem("Erro ao cadastrar. Tente novamente.");
          setMostrarModal(true);
          setTimeout(() => {
            setMostrarModal(false);
          }, 2000); // Fecha o modal após 2 segundos
        }
      });
      return resp;
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      throw error;
    }
  };

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
    if (numerosApenas.length == 0) {
      return "";
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
      setImagemPreview(file);
      console.log(file);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.set("nome", nome);
    form.set("telefone", telefone);
    form.set("email", email);
    form.set("senha", senha);
    form.set("tipo", "usuario");
    const telefoneLimpo = telefone.replace(/\D/g, ""); // Resultado: "41999991234"
    form.set("telefone", telefoneLimpo);
    if (imagemPreview) {
      form.set("imagem_perfil", imagemPreview);
    }

    if (validarEmail(email)) {
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

    await cadastrar(form);
  };

  return (
    <div>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat "
        style={{ backgroundImage: "url('/logo2.jpg')" }}
      >
        <Navbar isLogado={false} />
        <div className="w-full max-w-md p-8 bg-purple-100 rounded-lg shadow-xl border border-gray-300">
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
                      src={
                        imagemPreview
                          ? URL.createObjectURL(imagemPreview)
                          : "/placeholder.jpg"
                      }
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-purple-50 text-gray-900 rounded-lg shadow-md focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* CEP */}
              {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  CEP
                </label>
                <input
                  type="text"
                  placeholder="Digite seu CEP"
                  value={cep}
                  onChange={(e) =>
                    setCep(e.target.value.replace(/\D/g, "").slice(0, 8))
                  }
                  onBlur={buscarCep}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div> */}

              {/* Endereço (preenchido automaticamente) */}
              {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Endereço
                </label>
                <input
                  type="text"
                  value={endereco}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:ring-2 focus:ring-purple-500"
                />
              </div> */}

              {/* Bairro (preenchido automaticamente) */}
              {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Bairro
                </label>
                <input
                  type="text"
                  value={bairro}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:ring-2 focus:ring-purple-500"
                />
              </div> */}
              {/* Cidade */}
              {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <input
                  type="text"
                  value={cidade}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:ring-2 focus:ring-purple-500"
                />
              </div> */}

              {/* UF */}
              {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  UF
                </label>
                <input
                  type="text"
                  value={uf}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:ring-2 focus:ring-purple-500"
                />
              </div> */}

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
                  className={'mt-1 block w-full px-3 py-2 border border-gray-300 bg-purple-50 text-gray-900 rounded-lg shadow-md focus:ring-2 focus:ring-purple-500'}
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
                  className={'mt-1 block w-full px-3 py-2 border border-gray-300 bg-purple-50 text-gray-900 rounded-lg shadow-md focus:ring-2 focus:ring-purple-500'}
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
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 bg-purple-50 text-gray-900 rounded-lg shadow-md focus:ring-2 focus:ring-purple-500`}
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
              <h3
                className={`text-2xl font-bold mb-4 ${
                  modalMensagem.includes("sucesso")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {modalMensagem}
              </h3>
              <p className="text-gray-700">
                {modalMensagem.includes("sucesso")
                  ? "Você será redirecionado para a tela de login."
                  : "Por favor, verifique os dados e tente novamente."}
              </p>
            </div>
          </div>
        )}
      </div>
      <Rodape />
    </div>
  );
};

export default Cadastro;
