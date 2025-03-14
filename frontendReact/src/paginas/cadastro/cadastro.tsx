import React, { useState } from "react";

const Cadastro: React.FC = () => {
  // Estados para controlar os campos
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaErro, setSenhaErro] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarRequisitosSenha, setMostrarRequisitosSenha] = useState(false);

  // Validação da senha
  const validarSenha = (senha: string) => {
    const regexSenha = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regexSenha.test(senha);
  };

  // Manipular mudanças nos campos
  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value.replace(/\d/g, "")); // Impede números no nome
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(e.target.value.replace(/\D/g, "")); // Impede letras no telefone
  };

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSenha(value);
    setSenhaErro(validarSenha(value) ? "" : "A senha não atende aos requisitos.");
  };

  // Manipular o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarSenha(senha)) {
      setSenhaErro("A senha não atende aos requisitos.");
      return;
    }

    if (!/^\d{11}$/.test(telefone)) {
      alert("O telefone deve conter exatamente 11 dígitos.");
      return;
    }

    // Exibir modal de sucesso
    setMostrarModal(true);

    // Redirecionar para a tela de login após 3 segundos
    setTimeout(() => {
      window.location.href = "/login"; // Ajuste conforme necessário
    }, 3000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo: Imagem */}
      <div className="w-3/5 bg-cover bg-center" style={{ backgroundImage: "url('/logo2.jpg')" }}></div>

      {/* Lado direito: Formulário de Cadastro */}
      <div className="w-2/5 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Cadastro</h2>

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            {/* Foto de Perfil */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Foto de Perfil</label>
              <input type="file" accept="image/*" className="mt-1 block w-full file:bg-purple-50 file:text-purple-700 file:rounded-md file:px-4 file:py-2 hover:file:bg-purple-100" required />
            </div>

            {/* Nome */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nome</label>
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Telefone */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Número de Telefone</label>
              <input
                type="tel"
                placeholder="Digite seu telefone"
                value={telefone}
                onChange={handleTelefoneChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Senha */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={handleSenhaChange}
                onFocus={() => setMostrarRequisitosSenha(true)}
                onBlur={() => setMostrarRequisitosSenha(false)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500"
                required
              />

              {senhaErro && <p className="text-sm text-red-500 mt-2">{senhaErro}</p>}

              {mostrarRequisitosSenha && (
                <div className="text-sm text-red-500 mt-2">
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
