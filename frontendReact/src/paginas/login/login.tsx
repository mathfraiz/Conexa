import React from 'react';
import { Link } from 'react-router-dom'; // Para navegação

const Login: React.FC = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/logo.jpg')" }}>

      {/* Lado direito: Formulário de Login */}
      
        <div className="w-full max-w-md p-8 bg-white rounded-2xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>

          {/* Formulário */}
          <form>
            {/* Campo de Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Digite seu email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Campo de Senha */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Digite sua senha"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              className="w-full bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Entrar
            </button>
          </form>

          {/* Link para Cadastro */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Não está registrado?{' '}
              <Link to="/cadastro" className="text-purple-600 hover:text-purple-500">
                Crie uma conta
              </Link>
            </p>
          </div>
        </div>
    </main>
  );
};

export default Login;