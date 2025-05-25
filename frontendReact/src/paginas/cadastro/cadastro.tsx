import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import Rodape from "../../componentes/Rodape";
import Navbar from "../../componentes/BarraNav";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const Cadastro: React.FC = () => {
  const [modalMensagem, setModalMensagem] = useState("");
  const { usuario, login } = useAuth();

  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacaosenha, setConfirmacaosenha] = useState("");
  const [imagemPreview, setImagemPreview] = useState<File | null>(null);
  // const [cep, setCep] = useState("");
  // const [endereco, setEndereco] = useState("");
  // const [bairro, setBairro] = useState("");
  // const [cidade, setCidade] = useState("");
  // const [uf, setUf] = useState("");

  // Error states
  const [nomeErro, setNomeErro] = useState("");
  const [emailErro, setEmailErro] = useState("");
  const [senhaErro, setSenhaErro] = useState("");
  const [telefoneErro, setTelefoneErro] = useState("");
  const [confirmacaosenhaErro, setConfirmacaosenhaErro] = useState("");
  const [mostrarSenhaConf, setMostrarSenhaConf] = useState(false);

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
    try {
      const response = await fetch("http://localhost:3000/usuario", {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        const loginResponse = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.get("email"),
            senha: form.get("senha"),
          }),
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();

          login(loginData.usuario, loginData.token); // Usa o contexto global

          setModalMensagem("Cadastro e login realizados com sucesso!");
          setMostrarModal(true);

          setTimeout(() => {
            setMostrarModal(false);
            if (loginData.usuario.tipo === "admin") {
              navigate("paginainiciallogin");
            } else {
              navigate("/admin");
            }
          }, 2000);
        } else {
          setModalMensagem("Cadastro feito, mas erro ao fazer login.");
          setMostrarModal(true);
        }
      } else {
        console.error("Erro no cadastro:", data);
        setModalMensagem("Erro ao cadastrar. Tente novamente.");
        setMostrarModal(true);
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      setModalMensagem("Erro de conexão. Tente novamente.");
      setMostrarModal(true);
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
  const validarNome = (nome: string) => {
    const nomeLimpo = nome.trim();
    const regex = /^[A-Za-zÀ-ÿ\s]{4,}$/;
    return regex.test(nomeLimpo);
  };

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorLimpo = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
    setNome(valorLimpo);

    if (!validarNome(valorLimpo)) {
      setNomeErro("Digite seu nome completo.");
    } else {
      setNomeErro("");
    }
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
  const handleConfirmacaosenhaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmacaosenha(value);
    setConfirmacaosenhaErro(
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
    form.set("confirmacaodesenha", confirmacaosenha);
    form.set("tipo", "usuario");
    const telefoneLimpo = telefone.replace(/\D/g, ""); // Resultado: "41999991234"
    form.set("telefone", telefoneLimpo);
    if (imagemPreview) {
      form.set("imagem_perfil", imagemPreview);
    }
    if (!validarNome(nome)) {
      setNomeErro(
        "Preencha este campo com seu nome completo (mínimo 4 letras)."
      );
      return;
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
      <Navbar onToggleSidebar={() => {}} />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat  "
        style={{ backgroundImage: "url('/logo2.jpg')" }}
      >
        <div className="w-full max-w-md p-8 bg-purple-100 rounded-lg shadow-xl border border-gray-300">
          <div className="w-full max-w">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Cadastro</h2>
            <form onSubmit={handleSubmit}>
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
                  className={`mt-1 block w-full px-3 py-2 bg-purple-50 text-gray-900 rounded-lg shadow-md focus:ring-2 focus:ring-purple-500 ${
                    nomeErro
                      ? "border-red-500 border-2"
                      : "border border-gray-300"
                  }`}
                  required
                />
                {nomeErro && (
                  <p className="text-sm text-red-500 mt-2">{nomeErro}</p>
                )}
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
                  className={
                    "mt-1 block w-full px-3 py-2 border border-gray-300 bg-purple-50 text-gray-900 rounded-lg shadow-md focus:ring-2 focus:ring-purple-500"
                  }
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
                  className={
                    "mt-1 block w-full px-3 py-2 border border-gray-300 bg-purple-50 text-gray-900 rounded-lg shadow-md focus:ring-2 focus:ring-purple-500"
                  }
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
              {/*Confirmação de Senha */}
              <div className="mb-6 relative">
                <label className="block text-sm font-medium text-gray-700">
                  Confirmação de Senha
                </label>
                <div className="relative">
                  <input
                    type={mostrarSenhaConf ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={confirmacaosenha}
                    onChange={handleConfirmacaosenhaChange}
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 bg-purple-50 text-gray-900 rounded-lg shadow-md focus:ring-2 focus:ring-purple-500 ${
                      confirmacaosenhaErro
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:ring-2 focus:ring-purple-500`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenhaConf(!mostrarSenhaConf)}
                    className="absolute inset-y-0 right-2 top-2 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {mostrarSenhaConf ? "🔓" : "🔒"}
                  </button>
                </div>
              </div>
              {/* Foto de Perfil */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  {imagemPreview && (
                    <img
                      src={
                        imagemPreview
                          ? URL.createObjectURL(imagemPreview)
                          : "/imagem_Icon_User.png"
                      }
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
                      onChange={handleImagemChange}
                    />
                  </label>
                </div>

                {imagemPreview && (
                  <button
                    type="button"
                    onClick={handleRemoverImagem}
                    className="mt-2 text-sm text-red-500 hover:text-red-700"
                  >
                    Remover imagem
                  </button>
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
