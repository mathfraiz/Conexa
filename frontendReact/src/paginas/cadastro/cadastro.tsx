import React, { useState, useRef } from "react";

const Cadastro: React.FC = () => {

  // Estados para controlar os campos
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaErro, setSenhaErro] = useState("");
  const [emailErro, setEmailErro] = useState(""); // Estado para erro do email
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarRequisitosSenha, setMostrarRequisitosSenha] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  
  const emailSugeridos = ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com"];
  const [sugestoesEmail, setSugestoesEmail] = useState<string[]>([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  
  // Validação da senha
  const validarSenha = (senha: string) => {
    const regexSenha = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regexSenha.test(senha);
  };

  // Validação do email
  const validarEmail = (email: string) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  };

// Manipular mudanças nos campos
const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setNome(e.target.value.replace(/\d/g, "")); // Impede números no nome
};

const [telefoneErro, setTelefoneErro] = useState(""); // Estado para erro do telefone

// Validação do telefone (Aceita apenas formato (XX) XXXXX-XXXX)
const validarTelefone = (telefone: string) => {
  const regexTelefone = /^\(\d{2}\) \d{5}-\d{4}$/; // Formato correto
  return regexTelefone.test(telefone);
};

// Formatar telefone no padrão (XX) XXXXX-XXXX
const formatarTelefone = (telefone: string) => {
  const numerosApenas = telefone.replace(/\D/g, ""); // Remove caracteres não numéricos

  if (numerosApenas.length <= 2) {
    return `(${numerosApenas}`;
  } else if (numerosApenas.length <= 7) {
    return `(${numerosApenas.slice(0, 2)}) ${numerosApenas.slice(2)}`;
  } else {
    return `(${numerosApenas.slice(0, 2)}) ${numerosApenas.slice(2, 7)}-${numerosApenas.slice(7)}`;
  }
};

// Manipular mudanças no telefone
const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos

  // Impede mais de 11 dígitos
  if (value.length > 11) {
    value = value.slice(0, 11);
  }

  const telefoneFormatado = formatarTelefone(value); // Formata automaticamente
  setTelefone(telefoneFormatado);

  // Verifica se o telefone está no formato correto
  if (value.length < 11) {
    setTelefoneErro("O telefone deve conter exatamente 11 dígitos.");
  } else {
    setTelefoneErro(validarTelefone(telefoneFormatado) ? "" : "O telefone deve estar no formato (XX) XXXXX-XXXX.");
  }
};

// Manipular mudanças na senha
const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setSenha(value);
  setSenhaErro(validarSenha(value) ? "" : "A senha não atende aos requisitos.");
};

const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value.trim();
  setEmail(value);

  // Aguarda a atualização do estado antes de validar
  setTimeout(() => {
    setEmailErro(validarEmail(email) ? email : "Email inválido.");
  }, 0);

  // Verifica se o usuário digitou "@"
  if (value.includes("@")) {
    const partesEmail = value.split("@");
    const dominio = partesEmail[1] || ""; // Obtém a parte depois do "@"

    if (dominio.length > 0) {
      // Filtra sugestões com base no que foi digitado
      const filtrados = emailSugeridos.filter((sugestao) => sugestao.startsWith(dominio));
      setSugestoesEmail(filtrados);
      setMostrarSugestoes(filtrados.length > 0);
    } else {
      setSugestoesEmail(emailSugeridos); // Exibe todas as sugestões
      setMostrarSugestoes(true);
    }
  } else {
    setMostrarSugestoes(false); // Esconde sugestões se "@" não estiver presente
  }
};



const selecionarSugestao = (sugestao: string) => {
  const partesEmail = email.split("@");
  const nomeUsuario = partesEmail[0] || ""; // Evita erro caso ainda não tenha "@"
  const emailCorrigido = `${nomeUsuario}@${sugestao}`;

  setEmail(emailCorrigido);
  setMostrarSugestoes(false); // Esconde sugestões após a seleção

  // Valida o e-mail após atualizar o estado
  setTimeout(() => {
    setEmailErro(validarEmail(email) ? "" : "Email inválido.");
  }, 0);
};


  // Mostrar/Esconder senha
  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const sugerirEmail = () => {
    if (!email.includes("@")) {
      const emailCorrigido = email.trim() + "@gmail.com";
      setEmail(emailCorrigido);
      
      // Aguarda atualização do estado e então revalida
      setTimeout(() => {
        setEmailErro(validarEmail(emailCorrigido) ? "" : "Email inválido.");
      }, 0);
    }
  };
  


<input 
  type="email"
  placeholder="Digite seu email"
  value={email}
  onChange={handleEmailChange}
  onBlur={sugerirEmail} // Agora a sugestão é validada corretamente
  className={`mt-1 block w-full px-3 py-2 border ${emailErro ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:ring-2 focus:ring-purple-500`}
  required
/>
{emailErro && <p className="text-sm text-red-500 mt-2">{emailErro}</p>}

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagemPreview(URL.createObjectURL(file));
    }
  };

  // Manipular o envio do formulário
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
      setTelefoneErro("O telefone deve conter exatamente 11 dígitos numéricos.");
      return;
    }
    
    // Exibir modal de sucesso
    setMostrarModal(true);

    // Redirecionar para a tela de login após 3 segundos
    setTimeout(() => {
      window.location.href = "/login"; // Ajuste conforme necessário
    }, 3000);
  };

  // Criar referência para o input file
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Função para remover a imagem e resetar o input file
  const handleRemoverImagem = () => {
    setImagemPreview(null); // Remove o preview da imagem
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reseta o input file para "Nenhum arquivo escolhido"
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Lado esquerdo: Imagem */}
      <div className="md:w-3/5 w-full h-64 md:h-auto bg-cover bg-center" style={{ backgroundImage: "url('/logo2.jpg')" }}></div>

      {/* Lado direito: Formulário de Cadastro */}
      <div className="w-full md:w-2/5 flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Cadastro</h2>

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
{/* Foto de Perfil */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Foto de Perfil</label>
  <input
    type="file"
    accept="image/*"
    onChange={handleImagemChange}
    ref={fileInputRef} // Adiciona referência ao input
    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
               file:rounded-md file:border-0 file:text-purple-700 
               file:bg-purple-100 hover:file:bg-purple-200 cursor-pointer"
  />

  {/* Exibir preview da imagem escolhida */}
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
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input type="text" placeholder="Digite seu nome" value={nome} onChange={handleNomeChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500" required />
            </div>

{/* Email */}
<div className="mb-4 relative">
  <label className="block text-sm font-medium text-gray-700">Email</label>
  <input 
    type="email"
    placeholder="Digite seu email"
    value={email}
    onChange={handleEmailChange}
    onBlur={() => setTimeout(() => setMostrarSugestoes(false), 200)} // Esconde sugestões após clicar fora
    className={`mt-1 block w-full px-3 py-2 border ${emailErro ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:ring-2 focus:ring-purple-500`}
    required
  />
  {emailErro && <p className="text-sm text-red-500 mt-2">{emailErro}</p>}

  {/* Lista de sugestões */}
  {mostrarSugestoes && (
    <ul className="absolute bg-white border border-gray-300 rounded-md w-full mt-1 shadow-md z-10">
      {sugestoesEmail.map((sugestao) => (
        <li
          key={sugestao}
          className="px-3 py-2 hover:bg-purple-100 cursor-pointer flex justify-between"
          onClick={() => selecionarSugestao(sugestao)}
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
  <label className="block text-sm font-medium text-gray-700">Número de Telefone</label>
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
  {telefoneErro && <p className="text-sm text-red-500 mt-2">{telefoneErro}</p>}
</div>

{/* Senha */}
<div className="mb-6 relative">
  <label className="block text-sm font-medium text-gray-700">Senha</label>
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
    {/* Botão para mostrar/ocultar senha */}
    <button
      type="button"
      onClick={toggleMostrarSenha}
      className="absolute inset-y-0 right-2 top-2 flex items-center text-gray-500 hover:text-gray-700"
    >
      {mostrarSenha ? "🔓" : "🔒"}
    </button>
  </div>

  {/* Exibição do erro da senha */}
  {senhaErro && <p className="text-sm text-red-500 mt-2">{senhaErro}</p>}

  {/* Exibição dos requisitos da senha quando o campo está em foco */}
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
        <button type="submit" className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700">
          Salvar
        </button>
      </form>
    </div>
  </div>

      {/* Modal de Sucesso */}
      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold text-green-600 mb-4">Salvo com sucesso!</h3>
            <p className="text-gray-700">Você será redirecionado para a tela de login.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cadastro;
