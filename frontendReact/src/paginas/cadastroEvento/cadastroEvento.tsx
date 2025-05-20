import React, { useEffect, useState } from "react";
import Navbar from "../../componentes/BarraNav";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import BarraLateral from "../../componentes/BarraLateral";
import Rodape from "../../componentes/Rodape";
const CriarEvento = () => {
  const form = new FormData();
  const { usuario, token, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSideBarOpen] = useState(false);

  const [nome, setNome] = useState("");
  const [tema, setTema] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagemArquivo, setImagemArquivo] = useState<File | null>(null);
  const [criadoPor, setCriadoPor] = useState(1);

  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");
  const [cidade, setCidade] = useState("");
  const [UF, setUF] = useState("");

  form.append("nome", nome);
  form.append("tema", tema);
  form.append("data", data);
  form.append("hora", hora);
  form.append("descricao", descricao);
  form.append("criado_por", criadoPor.toString());
  form.append("cep", cep);
  form.append("logradouro", logradouro);
  form.append("bairro", bairro);
  form.append("numero", numero);
  form.append("cidade", cidade);
  form.append("UF", UF);

  if (imagemArquivo) {
    form.append("imagem", imagemArquivo);
  }

  useEffect(() => {
    if (usuario?.id === 0 || !usuario) {
      navigate("/");
    }
  }, [usuario]);

  const [showModal, setShowModal] = useState(false);
  const [cadastroSucesso, setCadastroSucesso] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "nome" && value.length > 50) return;
    if (name === "numero" && !/^\d{0,5}$/.test(value)) return;
    if (name === "descricao" && value.length > 300) return;
    if (name === "cep" && !/^\d{0,8}$/.test(value)) return;

    if (name == "nome") setNome(value);
    if (name === "tema") setTema(value);
    if (name === "data") setData(value);
    if (name === "hora") setHora(value);
    if (name === "descricao") setDescricao(value);
    // if(name==="imagem") setImagemArquivo(value)

    if (usuario) {
      setCriadoPor(usuario.id);
    } else {
      return;
    }

    form.set(name, value);
    console.log(form.get(name));
  };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cep") setCep(value);
    if (name === "numero") setNumero(value);
    if (name === "logradouro") setLogradouro(value);
    if (name === "bairro") setBairro(value);
    if (name === "numero") setNumero(value);
    if (name === "cidade") setCidade(value);
    if (name === "UF") setUF(value);

    if (name === "cep" && value.length === 8) {
      fetch(`https://viacep.com.br/ws/${value}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.erro) {
            setLogradouro(data.logradouro);
            setBairro(data.bairro);
            setCep(data.cep);
            setCidade(data.localidade);
            setUF(data.uf);
          }
        });
    }

    form.set(name, value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImagemArquivo(file);
    }
    console.log(imagemArquivo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (imagemArquivo) {
      form.set("imagem", imagemArquivo);
    }

    try {
      const response = await fetch("http://localhost:3000/evento", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await response.json();

      if (response.ok && data.status === 200) {
        location.href = "/PaginaInicialLogin";
        setCadastroSucesso(true);
      } else if (response.status === 401) {
        logout();
        navigate("/login");
        console.log("erro");
      } else {
        setCadastroSucesso(false);
      }

      setShowModal(true);
    } catch (error) {
      console.error("Erro ao cadastrar evento:", error);
      setCadastroSucesso(false);
      setShowModal(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16">
        <Navbar
          onToggleSidebar={() => {
            setSideBarOpen(!sidebarOpen);
          }}
        />
      </div>

      <BarraLateral isOpen={sidebarOpen} />

      <div
        className={`bg-[url(/logo.jpg)] min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-200 p-6 bg-cover bg-center bg-no-repeat transition-all duration-300 ${
          sidebarOpen ? "ml-60 " : "ml-0 "
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl space-y-6 border border-gray-200"
        >
          <h2 className="text-3xl font-bold text-center text-purple-800 mb-4">
            Criar Novo Evento
          </h2>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Nome do Evento
            </label>
            <input
              type="text"
              name="nome"
              value={nome}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 ">
              Tema
            </label>
            <select
              name="tema"
              value={tema}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            >
              <option value="">Selecione um tema</option>
              <option value="Tecnologia">Tecnologia</option>
              <option value="Arte">Arte</option>
              <option value="Saúde">Saúde</option>
              <option value="Educação">Educação</option>
              <option value="Negócios">Negócios</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium text-gray-700">
                Data
              </label>
              <input
                type="date"
                name="data"
                min={new Date().toISOString().split("T")[0]}
                value={data}
                onKeyDown={(e) => e.preventDefault()}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block mb-1 font-medium text-gray-700">
                Hora
              </label>
              <input
                type="time"
                name="hora"
                value={hora}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">CEP</label>
            <input
              type="text"
              name="cep"
              value={cep}
              onChange={handleEnderecoChange}
              maxLength={8}
              placeholder="Apenas números"
              className="w-full border border-gray-300 rounded-md p-3"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Logradouro
            </label>
            <input
              type="text"
              name="logradouro"
              value={logradouro}
              onChange={handleEnderecoChange}
              className="w-full border border-gray-300 rounded-md p-3"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium text-gray-700">
                Bairro
              </label>
              <input
                type="text"
                name="bairro"
                value={bairro}
                onChange={handleEnderecoChange}
                className="w-full border border-gray-300 rounded-md p-3"
                required
              />
            </div>

            <div className="w-1/3">
              <label className="block mb-1 font-medium text-gray-700">
                Número
              </label>
              <input
                type="text"
                name="numero"
                value={numero}
                onChange={handleEnderecoChange}
                className="w-full border border-gray-300 rounded-md p-3"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium text-gray-700">
                Cidade
              </label>
              <input
                type="text"
                name="cidade"
                value={cidade}
                onChange={handleEnderecoChange}
                className="w-full border border-gray-300 rounded-md p-3"
                required
              />
            </div>
            <div className="flex w-1/3">
              <div className="flex-1">
                <label className="block mb-1 font-medium text-gray-700">
                  UF
                </label>
                <input
                  type="text"
                  name="UF"
                  value={UF}
                  onChange={handleEnderecoChange}
                  className="w-full border border-gray-300 rounded-md p-3"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              name="descricao"
              value={descricao}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
              rows={4}
              maxLength={300}
              required
            ></textarea>
            <p className="text-right text-sm text-gray-500">
              {descricao.length}/300 caracteres
            </p>
          </div>

          <div className="flex flex- items-center gap-2">
            {imagemArquivo && (
              <img
                src={URL.createObjectURL(imagemArquivo)}
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
                onChange={(e) => setImagemArquivo(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md transition"
          >
            Cadastrar Evento
          </button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center space-y-4">
            <h3
              className={`text-xl font-bold ${
                cadastroSucesso ? "text-green-600" : "text-red-600"
              }`}
            >
              {cadastroSucesso
                ? "Evento cadastrado com sucesso!"
                : "Falha ao cadastrar evento"}
            </h3>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <div
        className={` bottom-0  w-full transition-all duration-300 ${
          sidebarOpen ? "ml-58 " : " ml-0"
        }`}
      >
        <Rodape />
      </div>
    </div>
  );
};

export default CriarEvento;
